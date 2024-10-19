const sceneEl = document.querySelector('#scene');
const fpsEl = document.querySelector('.frames-per-second');
const numDotsEl = document.querySelector('.num-dots');
const playPauseButton = document.querySelector('#play-pause');

const radius = 4;
const speed = 0.1;
let newDotTimerID;
let movingTimerID;

const dots = [];

const getSceneSize = function () {
  const sceneRect = sceneEl.getBoundingClientRect();
  return [sceneRect.width, sceneRect.height]
}

const makeDot = function () {
  const [width, height] = getSceneSize();
  const x = radius + Math.random() * (width - radius * 2);
  const y = radius + Math.random() * (height - radius * 2);
  const theta = Math.random() * 2 * Math.PI;
  const vx = Math.cos(theta) * speed;
  const vy = Math.sin(theta) * speed;

  return {x, y, vx, vy};
}

const moveDot = function (dot, dt) {
  const [width, height] = getSceneSize();
  const xmin = radius;
  const xmax = width - radius;
  const ymin = radius;
  const ymax = height - radius;

  let newX = dot.x + dot.vx * dt;
  let newY = dot.y + dot.vy * dt;

  if (newX < xmin || newX > xmax) {
    const edge = (newX < xmin) ? xmin : xmax
    const dt1 = (dot.x - edge) / (dot.x - newX) * dt;
    const dt2 = dt - dt1;

    dot.vx *= -1;
    dot.x = edge + dot.vx * dt2;
  } else {
    dot.x += dot.vx * dt;
  }

  if (newY < ymin || newY > ymax) {
    const edge = (newY < ymin) ? ymin : ymax
    const dt1 = (dot.y - edge) / (dot.y - newY) * dt;
    const dt2 = dt - dt1;

    dot.vy *= -1;
    dot.y = edge + dot.vy * dt2;
  } else {
    dot.y += dot.vy * dt;
  }
}

const dtHistory = [];
let prevMoveTime = new Date();

const showFPS = function () {
  const fps = Math.round(dtHistory.length / dtHistory.reduce((a, b) => a + b) * 1000)
  fpsEl.innerHTML = `${fps} Frames / Second`;
}

const showNumDots = function () {
  const count = dots.length;
  numDotsEl.innerHTML = `${count} dots`;
}

const addDotToScene = function () {
  dots.push([makeDot(), null]);
  showNumDots();
}

const redrawDotsOnScene = function () {
  const moveTime = new Date();
  const dt = moveTime - prevMoveTime;

  for (let dotPair of dots) {
    if (dotPair[1] === null) {
      dotPair[1] = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
      dotPair[1].setAttribute('r', radius);
      sceneEl.appendChild(dotPair[1]);
    }

    const [dot, dotEl] = dotPair;
    moveDot(dot, dt);
    dotEl.setAttribute('cx', dot.x);
    dotEl.setAttribute('cy', dot.y);
  }

  prevMoveTime = moveTime;
  dtHistory.push(dt);
  if (dtHistory.length > 150) {
    dtHistory.splice(0, 50);
  }

  showFPS();
}

const resizeScene = function () {
  const [width, height] = getSceneSize();
  sceneEl.setAttribute('viewBox', `0 0 ${width} ${height}`);
}

const play = function () {
  newDotTimerID = setInterval(addDotToScene, 100);
  movingTimerID = setInterval(redrawDotsOnScene, 10);
}

const pause = function () {
  clearInterval(newDotTimerID);
  clearInterval(movingTimerID);
}

resizeScene();

addDotToScene();
addDotToScene();
addDotToScene();
addDotToScene();
addDotToScene();
addDotToScene();
addDotToScene();
addDotToScene();
addDotToScene();
addDotToScene();

play();

window.addEventListener('resize', resizeScene);

playPauseButton.addEventListener('click', pause);
