// ==================== 全局变量 ====================
let allTasks = [];
let currentTask = null;
let dailyChangesRemaining = 3;
let usedTaskIds = [];
const MAX_DAILY_CHANGES = 3;
const STORAGE_KEY_DATE = 'lovebox_last_date';
const STORAGE_KEY_CHANGES = 'lovebox_changes_remaining';
const STORAGE_KEY_USED_TASKS = 'lovebox_used_tasks';

// 筛选器状态
let activeFilters = {
    duration: null,
    location: null,
    budget: null
};

// ==================== DOM 元素 ====================
const drawButton = document.getElementById('drawButton');
const changeButton = document.getElementById('changeButton');
const confirmButton = document.getElementById('confirmButton');
const tipToggle = document.getElementById('tipToggle');

const drawState = document.getElementById('drawState');
const loadingState = document.getElementById('loadingState');
const cardState = document.getElementById('cardState');

const remainingDrawsEl = document.getElementById('remainingDraws');
const remainingChangesEl = document.getElementById('remainingChanges');

const categoryTagEl = document.getElementById('categoryTag');
const taskTitleEl = document.getElementById('taskTitle');
const taskDescriptionEl = document.getElementById('taskDescription');
const taskScienceEl = document.getElementById('taskScience');
const stepsListEl = document.getElementById('stepsList');
const tipContentEl = document.getElementById('tipContent');

// ==================== 初始化 ====================
async function init() {
    try {
        // 加载任务数据
        await loadTasks();

        // 检查并重置每日数据
        checkAndResetDaily();

        // 更新UI
        updateRemainingChangesUI();

        // 绑定事件
        bindEvents();

        console.log('应用初始化成功！');
    } catch (error) {
        console.error('初始化失败:', error);
        alert('应用加载失败，请刷新页面重试');
    }
}

// ==================== 加载任务数据 ====================
async function loadTasks() {
    try {
        const response = await fetch('src/data/tasks.json');
        if (!response.ok) {
            throw new Error('无法加载任务数据');
        }
        const data = await response.json();
        allTasks = data.tasks;
        console.log(`成功加载 ${allTasks.length} 个任务`);
    } catch (error) {
        console.error('加载任务失败:', error);
        throw error;
    }
}

// ==================== 每日数据重置 ====================
function checkAndResetDaily() {
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem(STORAGE_KEY_DATE);

    if (lastDate !== today) {
        // 新的一天，重置数据
        dailyChangesRemaining = MAX_DAILY_CHANGES;
        usedTaskIds = [];

        localStorage.setItem(STORAGE_KEY_DATE, today);
        localStorage.setItem(STORAGE_KEY_CHANGES, dailyChangesRemaining);
        localStorage.setItem(STORAGE_KEY_USED_TASKS, JSON.stringify(usedTaskIds));

        console.log('新的一天，数据已重置');
    } else {
        // 同一天，加载已保存的数据
        const savedChanges = localStorage.getItem(STORAGE_KEY_CHANGES);
        const savedUsedTasks = localStorage.getItem(STORAGE_KEY_USED_TASKS);

        dailyChangesRemaining = savedChanges ? parseInt(savedChanges) : MAX_DAILY_CHANGES;
        usedTaskIds = savedUsedTasks ? JSON.parse(savedUsedTasks) : [];

        console.log(`继续今天的进度: 剩余 ${dailyChangesRemaining} 次换取机会`);
    }
}

// ==================== 保存数据到本地存储 ====================
function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY_CHANGES, dailyChangesRemaining);
    localStorage.setItem(STORAGE_KEY_USED_TASKS, JSON.stringify(usedTaskIds));
}

// ==================== 绑定事件 ====================
function bindEvents() {
    drawButton.addEventListener('click', handleDraw);
    changeButton.addEventListener('click', handleChange);
    confirmButton.addEventListener('click', handleConfirm);
    tipToggle.addEventListener('click', toggleTip);

    // 绑定筛选器按钮事件
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });

    // 绑定清除筛选按钮
    const clearFilterBtn = document.getElementById('clearFilterBtn');
    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', clearFilters);
    }
}

// ==================== 抽取任务 ====================
async function handleDraw() {
    // 显示加载动画
    showLoading();

    // 模拟加载延迟（增加仪式感）
    await sleep(1500);

    // 随机选择一个任务
    const task = getRandomTask();

    if (!task) {
        alert('暂时没有可用的任务了，请明天再来！');
        showDrawState();
        return;
    }

    // 显示任务卡片
    currentTask = task;
    displayTask(task);
    showCardState();

    // 重置换取次数为3
    dailyChangesRemaining = MAX_DAILY_CHANGES;
    updateRemainingChangesUI();
    saveToLocalStorage();
}

// ==================== 换一个任务 ====================
async function handleChange() {
    if (dailyChangesRemaining <= 0) {
        alert('今天的换取次数已用完，请明天再来！');
        return;
    }

    // 减少剩余次数
    dailyChangesRemaining--;
    updateRemainingChangesUI();
    saveToLocalStorage();

    // 显示加载动画
    showLoading();

    // 模拟加载延迟
    await sleep(1000);

    // 随机选择新任务
    const task = getRandomTask();

    if (!task) {
        alert('暂时没有更多任务了，请明天再来！');
        dailyChangesRemaining++; // 恢复次数
        updateRemainingChangesUI();
        showCardState();
        return;
    }

    // 显示新任务
    currentTask = task;
    displayTask(task);
    showCardState();
}

// ==================== 确认任务 ====================
function handleConfirm() {
    // 显示祝福信息
    const messages = [
        '祝你们约会愉快！💕',
        '期待你们创造美好的回忆！✨',
        '享受这段特别的时光吧！🌟',
        '愿这次约会为你们的关系增添色彩！🎨',
        '相信这会是一次难忘的体验！🌈'
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    // 显示提示
    if (confirm(`${randomMessage}\n\n是否要重新开始抽取新的任务？`)) {
        // 重置到初始状态
        showDrawState();
        currentTask = null;
    }
}

// ==================== 切换科学小贴士显示 ====================
function toggleTip() {
    tipContentEl.classList.toggle('hidden');
    tipToggle.classList.toggle('active');
}

// ==================== 获取随机任务 ====================
function getRandomTask() {
    // 首先根据筛选条件过滤任务
    let filteredTasks = allTasks.filter(task => {
        // 如果有筛选条件，检查是否匹配
        if (activeFilters.duration && task.duration !== activeFilters.duration) {
            return false;
        }
        if (activeFilters.location && task.location !== activeFilters.location) {
            return false;
        }
        if (activeFilters.budget && task.budget !== activeFilters.budget) {
            return false;
        }
        return true;
    });

    // 再过滤掉已使用的任务
    const availableTasks = filteredTasks.filter(task => !usedTaskIds.includes(task.id));

    if (availableTasks.length === 0) {
        // 如果没有可用任务，检查是否因为筛选条件太严格
        if (filteredTasks.length === 0) {
            alert('没有符合筛选条件的任务，请尝试更换筛选条件！');
            return null;
        }

        // 如果所有符合筛选的任务都用过了，从筛选结果中随机选择
        usedTaskIds = [];
        saveToLocalStorage();
        return filteredTasks[Math.floor(Math.random() * filteredTasks.length)];
    }

    // 随机选择一个任务
    const randomIndex = Math.floor(Math.random() * availableTasks.length);
    const selectedTask = availableTasks[randomIndex];

    // 记录已使用的任务
    usedTaskIds.push(selectedTask.id);
    saveToLocalStorage();

    return selectedTask;
}

// ==================== 显示任务卡片 ====================
function displayTask(task) {
    // 更新分类标签
    categoryTagEl.textContent = `#${task.category}`;

    // 更新标题和描述
    taskTitleEl.textContent = task.title;
    taskDescriptionEl.textContent = task.description;

    // 更新科学依据
    taskScienceEl.textContent = task.science;

    // 更新行动步骤
    stepsListEl.innerHTML = '';
    task.steps.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        stepsListEl.appendChild(li);
    });

    // 重置科学小贴士为收起状态
    tipContentEl.classList.add('hidden');
    tipToggle.classList.remove('active');
}

// ==================== 状态切换 ====================
function showDrawState() {
    drawState.classList.remove('hidden');
    loadingState.classList.add('hidden');
    cardState.classList.add('hidden');
}

function showLoading() {
    drawState.classList.add('hidden');
    loadingState.classList.remove('hidden');
    cardState.classList.add('hidden');
}

function showCardState() {
    drawState.classList.add('hidden');
    loadingState.classList.add('hidden');
    cardState.classList.remove('hidden');
}

// ==================== 更新剩余次数UI ====================
function updateRemainingChangesUI() {
    if (remainingChangesEl) {
        remainingChangesEl.textContent = dailyChangesRemaining;
    }

    // 禁用/启用按钮
    if (changeButton) {
        if (dailyChangesRemaining <= 0) {
            changeButton.disabled = true;
            changeButton.style.opacity = '0.5';
            changeButton.style.cursor = 'not-allowed';
        } else {
            changeButton.disabled = false;
            changeButton.style.opacity = '1';
            changeButton.style.cursor = 'pointer';
        }
    }
}

// ==================== 工具函数 ====================
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ==================== 筛选器功能 ====================
// 处理筛选按钮点击
function handleFilterClick(event) {
    const button = event.currentTarget;
    const filterType = button.dataset.filterType;
    const filterValue = button.dataset.filterValue;

    // 获取同组的所有按钮
    const groupButtons = document.querySelectorAll(`[data-filter-type="${filterType}"]`);

    // 检查是否已经激活
    const isActive = button.classList.contains('active');

    if (isActive) {
        // 如果已激活，则取消激活
        button.classList.remove('active');
        activeFilters[filterType] = null;
    } else {
        // 取消同组其他按钮的激活状态
        groupButtons.forEach(btn => btn.classList.remove('active'));
        // 激活当前按钮
        button.classList.add('active');
        activeFilters[filterType] = filterValue;
    }

    console.log('当前筛选条件:', activeFilters);
}

// 清除所有筛选
function clearFilters() {
    // 重置筛选状态
    activeFilters = {
        duration: null,
        location: null,
        budget: null
    };

    // 移除所有按钮的激活状态
    const allFilterButtons = document.querySelectorAll('.filter-btn');
    allFilterButtons.forEach(btn => btn.classList.remove('active'));

    console.log('已清除所有筛选');
}

// ==================== 页面加载完成后初始化 ====================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
