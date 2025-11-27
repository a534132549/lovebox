const fs = require('fs');
const path = require('path');

const tasksFilePath = path.join(__dirname, 'src/data/tasks.json');
const newTasksFilePath = process.argv[2];

if (!newTasksFilePath) {
    console.error('Please provide the path to the new tasks JSON file.');
    process.exit(1);
}

try {
    // Read existing tasks
    const tasksData = JSON.parse(fs.readFileSync(tasksFilePath, 'utf8'));
    let currentMaxId = tasksData.tasks.reduce((max, task) => Math.max(max, task.id), 0);

    // Read new tasks
    const newTasks = JSON.parse(fs.readFileSync(newTasksFilePath, 'utf8'));

    // Assign IDs and append
    const tasksToAdd = newTasks.map(task => {
        currentMaxId++;
        return {
            id: currentMaxId,
            ...task
        };
    });

    tasksData.tasks.push(...tasksToAdd);

    // Write back to file
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasksData, null, 2), 'utf8');

    console.log(`Successfully added ${tasksToAdd.length} tasks. New max ID: ${currentMaxId}`);

} catch (error) {
    console.error('Error processing tasks:', error);
    process.exit(1);
}
