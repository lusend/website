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

  return `<path d='M 1200,0 H 0 ${d} V 0 Z' fill='#0A254E' />`;
};

const svg = document.querySelector('#header-wave');

if (svg) {
  const points = [
    [0, 37],
    [200, 10],
    [400, 23],
    [600, 79],
    [800, 48],
    [1000, 62],
    [1200, 19]
  ].map((item, idx) => {
    if (idx % 2 === 0) item[1] = getRandomInt(10, 45);
    else item[1] = getRandomInt(45, 80);
    return item;
  });

  svg.innerHTML = svgPathRender(points);
}
