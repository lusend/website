function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const lineProperties = (pointA, pointB) => {
  const lengthX = pointB[0] - pointA[0];
  const lengthY = pointB[1] - pointA[1];
  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX)
  };
};

const controlPointCalc = (current, previous, next, reverse) => {
  const c = current;
  const p = previous ? previous : c;
  const n = next ? next : c;
  const smoothing = 0.2;
  const o = lineProperties(p, n);
  const rev = reverse ? Math.PI : 0;

  const x = c[0] + Math.cos(o.angle + rev) * o.length * smoothing;
  const y = c[1] + Math.sin(o.angle + rev) * o.length * smoothing;

  return [x, y];
};

const svgPathRender = (points) => {
  const d = points.reduce((acc, e, i, a) => {
    if (i === 0) return `L ${e[0]},${e[1]}`;

    const cs = controlPointCalc(a[i - 1], a[i - 2], e);
    const ce = controlPointCalc(e, a[i - 1], a[i + 1], true);
    return `${acc} C ${cs[0]},${cs[1]} ${ce[0]},${ce[1]} ${e[0]},${e[1]}`;
  }, '');

  return d;
};

const svg = document.querySelector('#header-wave');
const mainPath = svg.querySelector('path:nth-child(1)');
const fillPath = svg.querySelector('path:nth-child(2)');

if (svg && mainPath && fillPath) {
  const points = [
    [0, 37],
    [200, 10],
    [400, 23],
    [600, 79],
    [800, 48],
    [1000, 62],
    [1200, 19]
  ].map((item, idx) => {
    if (idx % 2 === 0) item[1] = getRandomInt(5, 45);
    else item[1] = getRandomInt(45, 75);
    return item;
  });

  const renderedPoints = svgPathRender(points);

  mainPath.setAttribute('d', `M 1200,0 H 0 ${renderedPoints} V 0 Z`);
  fillPath.setAttribute('d', `M 1200,80 H 0 ${renderedPoints} V 80 Z`);
}

function resizeSVG() {
  const ratio = 80 / 1200;
  const svg = document.querySelector('#header-wave');
  svg.style.height = Math.ceil(window.innerWidth * ratio);
}

document.addEventListener('alpine:init', () => {
  Alpine.store('background', '');
});

window.addEventListener('load', resizeSVG);
window.addEventListener('resize', resizeSVG);
