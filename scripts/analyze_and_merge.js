const fs = require('fs');
const path = require('path');

const tasksFilePath = path.join(__dirname, '../src/data/tasks.json');
const parsedTasksPath = path.join(__dirname, '../parsed_tasks.json');

const existingData = JSON.parse(fs.readFileSync(tasksFilePath, 'utf8'));
const parsedTasks = JSON.parse(fs.readFileSync(parsedTasksPath, 'utf8'));

let currentMaxId = existingData.tasks.reduce((max, t) => Math.max(max, t.id), 0);
const existingTitles = new Set(existingData.tasks.map(t => t.title));

let addedCount = 0;

parsedTasks.forEach(task => {
    // Simple duplicate check by title
    if (!existingTitles.has(task.title)) {
        currentMaxId++;
        task.id = currentMaxId;
        existingData.tasks.push(task);
        existingTitles.add(task.title);
        addedCount++;
    }
});

// Save merged data
fs.writeFileSync(tasksFilePath, JSON.stringify(existingData, null, 2));

// Analyze counts
const counts = {};
existingData.tasks.forEach(t => {
    counts[t.stage] = (counts[t.stage] || 0) + 1;
});

console.log(`Merged ${addedCount} new tasks.`);
console.log('Current counts per stage:');
Object.keys(counts).forEach(stage => {
    console.log(`- ${stage}: ${counts[stage]}`);
});

const target = 50;
const missing = {};
Object.keys(counts).forEach(stage => {
    if (counts[stage] < target) {
        missing[stage] = target - counts[stage];
    }
});

console.log('Missing tasks per stage:', JSON.stringify(missing, null, 2));
