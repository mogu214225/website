let numDisks = 3;
let towers = [[], [], []];
let animationFrameId = null;
let instructions = [];
let stack = [[], [], []];
let period = 1; // 默认时间间隔为 1 秒

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
  createPoles();

  // 计算移动步骤
  move(numDisks, 0, 2, 1, instructions);

  // 开始移动盘子
  moveDisk(0);
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
// 检查 startbtn 元素是否存在,如果存在再添加事件监听器
const startBtn = document.getElementById('startbtn');
if (startBtn) {
  startBtn.addEventListener('click', startGame);
}

// 检查 pausebtn 元素是否存在,如果存在再添加事件监听器
const pauseBtn = document.getElementById('pausebtn');
if (pauseBtn) {
  pauseBtn.addEventListener('click', pauseGame);
}

// 检查 resumebtn 元素是否存在,如果存在再添加事件监听器
const resumeBtn = document.getElementById('resumebtn');
if (resumeBtn) {
  resumeBtn.addEventListener('click', resumeGame);
}

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
periodSelect.addEventListener('change', () => {
  period = parseFloat(periodSelect.value);
});

const THICKNESS = 60;
const TOPWIDTH = 100;
const INDENT = 20;
const GAP = 20;
const RATIO = 0.3;
const N = 8;

function layer(n, i) {
  let x = i * INDENT;
  let y = (n - i - 1) * THICKNESS;
  let width = 2 * (n - i - 1) * INDENT + TOPWIDTH;
  let height = THICKNESS;
  let ele = document.createElement("div");
  ele.className = "layer";
  ele.style.left = x + 'px';
  ele.style.top = y + 'px';
  ele.style.width = width + 'px';
  ele.style.height = (height - GAP) + 'px';
  ele.id = "layer" + i;
  ele.innerHTML = disk(width, height, i);
  ele.style.backgroundColor = 'transparent';
  document.body.appendChild(ele);
}

function tower(n) {
  for (let i = 0; i < n; i++) {
    layer(n, i);
  }

  for (let i = 0; i < n; i++) {
    let disk = document.getElementById('layer' + i);
    // 检查 Drag 对象是否存在,如果存在再调用 init 方法
    if (typeof Drag !== 'undefined' && Drag.init) {
      Drag.init(disk);
    }
  }
}

function move(n, source, destin, temp, instructions) {
  if (n === 1) {
    instructions.push([source, destin]);
  } else {
    move(n - 1, source, temp, destin, instructions);
    instructions.push([source, destin]);
    move(n - 1, temp, destin, source, instructions);
  }
}

function disk(w, h, i) {
  const adjustedWidth = w * 0.8
  let h1 = w * RATIO;
  let color = 'rgb(' + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")";
  let s = '<div style="margin-top:' + h1 + 'px;width:' + w + 'px;height:' + h + 'px;' + 'background-color:' + color + '"></div>' +
    '<div style="margin:-' + h1 / 2 + 'px 0px -' + (h1 + h) + 'px 0px;width:' + w + 'px;height:' + h1 + 'px;' + 'background-color:' + color + ';border-radius:' + (w / 2) + 'px/' + h1 / 2 + 'px"></div>' +
    '<div style="width:' + (w - 2) + 'px;height:' + h1 + 'px;' + 'background-image:radial-gradient(#101010,#305020,15%,yellow,' + color + ');' + 'border-radius:' + (w / 2 - 1) + 'px/' + h1 / 2 + 'px;' + 'border:1px red solid;"></div>';
  return s;
}

function moveDisk(k) {
  let p = instructions[k];
  if (p == null) return;
  let s = p[0];
  let d = p[1];
  let topid = stack[s].pop();
  let disk = document.getElementById('layer' + topid);
  let x0 = disk.style.left;
  let y0 = disk.style.top;

  let x1 = (window.innerWidth - TOPWIDTH) / 2 + 'px';
  let y1 = (numDisks - stack[d].length) * THICKNESS + 'px';
  let q = stack[d];
  q.push(topid);

  let poleSpacing = (window.innerWidth - 3 * TOPWIDTH) / 4;
  let sourceX = window.innerWidth / 4 + s * poleSpacing;
  let destX = window.innerWidth / 4 + d * poleSpacing;

  let kftext = `@keyframes diskmove${k} {
    0% {
      left: ${x0};
      top: ${y0};
    }
    25% {
      left: ${sourceX}px;
      top: ${y0 - THICKNESS}px;
    }
    50% {
      left: ${sourceX}px;
      top: ${y0 - THICKNESS * 2}px;
    }
    75% {
      left: ${destX}px;
      top: ${y0 - THICKNESS * 2}px;
    }
    100% {
      left: ${x1};
      top: ${y1};
    }
  }`;
  document.getElementById('dynamic').innerHTML = `<style>${kftext}</style>`;
  disk.style.animation = `diskmove${k} ${period}s 1`;
  disk.style.left = x1;
  disk.style.top = y1;

  if (k < instructions.length - 1) {
    setTimeout(() => moveDisk(k + 1), period * 1000);
  }
}


function createPoles() {
  const poleWidth = 20;
  const poleHeight = THICKNESS * (numDisks + 1);
  const poleColor = 'brown';
  const windowWidth = window.innerWidth;
  const poleSpacing = (windowWidth - 3 * TOPWIDTH) / 4;

  for (let i = 0; i < 3; i++) {
    const pole = document.createElement('div');
    pole.className = 'pole';
    pole.style.width = `${poleWidth}px`;
    pole.style.height = `${poleHeight}px`;
    pole.style.backgroundColor = poleColor;
    pole.style.position = 'absolute';
    pole.style.left = `${windowWidth / 4 + i * poleSpacing}px`;
    pole.style.bottom = '0';
    document.body.appendChild(pole);
  }
}


// 将函数暴露给全局作用域
window.layer = layer;
window.tower = tower;
window.move = move;
window.disk = disk;
window.moveDisk = moveDisk;
