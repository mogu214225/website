let numDisks = 3;

// 定义三根柱子
let towers = [[], [], []];

// 定义动画帧ID
let animationFrameId = null;

// 定义指令数组
let instructions = [];

// 定义盘子堆栈
let stack = [[], [], []];

// 引入hanoi.js中的函数
const { layer, tower, move, disk, moveDisk } = window;

// 渲染柱子的函数
function renderTowers() {
  let towersHTML = '';
  for (let i = 0; i < 3; i++) {
    towersHTML += `<div class="tower">`;
    for (let j = 0; j < towers[i].length; j++) {
      towersHTML += `<div class="disk" style="width: ${towers[i][j] * 20}px;"></div>`;
    }
    towersHTML += `</div>`;
  }
  document.getElementById('dynamic').innerHTML = towersHTML;
}


// 开始游戏
function startGame() {
  const numDisksSelect = document.getElementById('numdisks');
  numDisks = parseInt(numDisksSelect.value);
  towers = [[], [], []];
  stack = [[], [], []];
  instructions = [];

  // 初始化,将所有盘子放在第一根柱子上
  for (let i = numDisks; i > 0; i--) {
    towers[0].push(i);
    stack[0].push(i - 1);
  }

  // 渲染初始状态
  tower(numDisks);
  renderTowers();

  // 计算移动步骤
  move(numDisks, 0, 2, 1, instructions);

  // 开始移动盘子
  animationFrameId = requestAnimationFrame(animateDisks);
}

// 暂停游戏
function pauseGame() {
  cancelAnimationFrame(animationFrameId);
}

// 恢复游戏
function resumeGame() {
  animationFrameId = requestAnimationFrame(animateDisks);
}

// 移动盘子的动画函数
let currentStep = 0;
function animateDisks() {
  if (currentStep < instructions.length) {
    moveDisk(currentStep);
    currentStep++;
    animationFrameId = requestAnimationFrame(animateDisks);
  } else {
    cancelAnimationFrame(animationFrameId);
    alert('游戏结束!');
  }
}

// 初始化事件监听器
document.getElementById('startbtn').addEventListener('click', startGame);
document.getElementById('pausebtn').addEventListener('click', pauseGame);
document.getElementById('resumebtn').addEventListener('click', resumeGame);

// 初始化选择框
const numDisksSelect = document.getElementById('numdisks');
for (let i = 3; i <= 10; i++) {
  const option = document.createElement('option');
  option.value = i;
  option.text = i;
  numDisksSelect.add(option);
}

const periodSelect = document.getElementById('period');
for (let i = 1; i <= 5; i++) {
  const option = document.createElement('option');
  option.value = i * 0.5;
  option.text = `${i * 0.5} 秒`;
  periodSelect.add(option);
}