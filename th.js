let disks = [
  { id: "disk-1", width: 100, height: 20 },
  { id: "disk-2", width: 80, height: 18 },
  { id: "disk-3", width: 60, height: 16 }
];

let towers = [
  { id: "tower-1", disks: [...disks] },
  { id: "tower-2", disks: [] },
  { id: "tower-3", disks: [] }
];

let currentMove = null;

document.getElementById("start-button").addEventListener("click", startGame);

function startGame() {
  towers.forEach(tower => {
    tower.disks.forEach(disk => {
      document.getElementById(disk.id).style.left = `${tower.id === "tower-1" ? 50 : 0}%`;
    });
  });
  moveDisk(towers[0].disks.pop(), towers[1]);
  moveNextDisk();
}

function moveDisk(disk, targetTower) {
  currentMove = { disk, targetTower };
  document.getElementById(disk.id).classList.add("moving");
  setTimeout(() => {
    document.getElementById(disk.id).classList.remove("moving");
    targetTower.disks.push(disk);
    document.getElementById(disk.id).style.left = '50%';
    if (towers[2].disks.length === 3) {
      alert("Congratulations! You won!");
    } else {
      moveNextDisk();
    }
  }, 500);
}

function moveNextDisk() {
  let fromTower, toTower;
  for (let i = 0; i < towers.length; i++) {
    if (towers[i].disks.length > 0) {
      fromTower = towers[i];
      break;
    }
  }
  for (let i = 0; i < towers.length; i++) {
    if (towers[i].id !== fromTower.id && towers[i].disks.length === 0) {
      toTower = towers[i];
      break;
    }
  }
  moveDisk(fromTower.disks.pop(), toTower);
}
