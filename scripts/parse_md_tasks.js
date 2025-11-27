const fs = require('fs');
const path = require('path');

const mdFilePath = path.join(__dirname, '../不同阶段情侣增进感情.md');
const outputFilePath = path.join(__dirname, '../parsed_tasks.json');

const content = fs.readFileSync(mdFilePath, 'utf8');

// Helper to clean text
const clean = (text) => text ? text.trim().replace(/^\*\*/, '').replace(/\*\*$/, '').trim() : '';

const stages = [
    { name: "刚开始谈恋爱（0-3个月）", pattern: /## 第一阶段：刚开始谈恋爱/ },
    { name: "热恋阶段（3-12个月）", pattern: /## 第二阶段：热恋阶段/ },
    { name: "稳定关系（1-3年）", pattern: /## 第三阶段：稳定关系/ },
    { name: "结婚前准备", pattern: /## 第四阶段：结婚前准备/ },
    { name: "新婚阶段（结婚后1-2年）", pattern: /## 第五阶段：新婚阶段/ }
];

const tasks = [];
let currentStage = "";

const lines = content.split('\n');
let currentTask = null;
let captureMode = null; // 'science', 'steps', 'desc'

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check for stage
    const stageMatch = stages.find(s => line.match(s.pattern));
    if (stageMatch) {
        currentStage = stageMatch.name;
        continue;
    }

    // Check for new task
    // Format: #### 活动1：深度问题交流（Aron的36个问题）
    // or #### 活动7-12：其他初期活动 (We might need to handle these bulk ones differently or skip)
    const taskMatch = line.match(/^####\s*活动(\d+)(?:-\d+)?：(.+)/);
    if (taskMatch) {
        if (currentTask) {
            tasks.push(currentTask);
        }

        // If it's a range (e.g. 7-12), it might be a header for a list of smaller tasks.
        // For now, let's treat it as a task title, but we might need to refine logic if the format differs.
        // Actually, looking at the file, "活动7-12" is a header, and then sub-items are listed below.
        // We'll handle standard tasks first.

        currentTask = {
            stage: currentStage,
            title: taskMatch[2].trim(),
            description: "",
            science: "",
            steps: [],
            category: "通用", // Default
            duration: "1-2小时", // Default
            location: "不限", // Default
            budget: "免费" // Default
        };
        captureMode = null;
        continue;
    }

    // Handle sub-tasks in "Other activities" sections
    // Format: **活动7：分享喜欢的音乐...**
    const subTaskMatch = line.match(/^\*\*\s*活动(\d+)：(.+)\*\*/);
    if (subTaskMatch) {
        if (currentTask) {
            tasks.push(currentTask);
        }
        currentTask = {
            stage: currentStage,
            title: subTaskMatch[2].trim(),
            description: "",
            science: "",
            steps: [],
            category: "通用",
            duration: "1-2小时",
            location: "不限",
            budget: "免费"
        };
        captureMode = 'desc'; // Usually followed by description bullets
        continue;
    }

    if (!currentTask) continue;

    // Capture fields
    if (line.includes('**科学基础**')) {
        captureMode = 'science';
        continue;
    }
    if (line.includes('**操作指南**') || line.includes('**实施指南**') || line.includes('**步骤**')) {
        captureMode = 'steps';
        continue;
    }
    if (line.includes('**建议**')) {
        captureMode = 'meta'; // Duration/freq often here
        continue;
    }

    // Content capture
    if (line.length > 0) {
        if (captureMode === 'science') {
            // Remove bullet points
            currentTask.science += (currentTask.science ? " " : "") + line.replace(/^-\s*/, '');
        } else if (captureMode === 'steps') {
            // Capture numbered lists or bullets
            if (line.match(/^\d+\./) || line.match(/^-\s/)) {
                currentTask.steps.push(line.replace(/^\d+\.\s*/, '').replace(/^-\s*/, ''));
            }
        } else if (captureMode === 'desc') {
            if (line.match(/^-\s/)) {
                currentTask.description += (currentTask.description ? " " : "") + line.replace(/^-\s*/, '');
            }
        } else if (captureMode === 'meta') {
            // Try to extract duration
            if (line.includes('分钟') || line.includes('小时')) {
                currentTask.duration = line.replace('**建议**', '').trim();
            }
        }
    }
}

if (currentTask) {
    tasks.push(currentTask);
}

// Post-processing to infer categories or clean up
tasks.forEach(t => {
    if (t.title.includes('深度') || t.title.includes('交流') || t.title.includes('对话')) t.category = '深度连接';
    else if (t.title.includes('玩') || t.title.includes('游戏') || t.title.includes('放松')) t.category = '玩乐与放松';
    else if (t.title.includes('冒险') || t.title.includes('旅行') || t.title.includes('新')) t.category = '冒险与新奇';
    else if (t.title.includes('做饭') || t.title.includes('协作') || t.title.includes('项目')) t.category = '团队协作';
    else if (t.title.includes('未来') || t.title.includes('钱') || t.title.includes('目标')) t.category = '价值与未来';

    // Ensure description is populated if empty (use title or science)
    if (!t.description && t.science) t.description = t.science.substring(0, 100) + '...';
    if (!t.description) t.description = t.title;
});

fs.writeFileSync(outputFilePath, JSON.stringify(tasks, null, 2));
console.log(`Parsed ${tasks.length} tasks.`);
