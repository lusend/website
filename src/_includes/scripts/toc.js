const elementsToObserve = document.querySelectorAll('h1[id], h2[id], h3[id]');

const visibleClass = 'visible';

const tocContainer = document.querySelector('.table-of-contents-container');

const toc = document.querySelector('.table-of-contents');

const tocSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

const tocPath = tocSVG.appendChild(
  document.createElementNS('http://www.w3.org/2000/svg', 'path')
);

tocContainer.innerHTML = '';
tocContainer.appendChild(toc);

toc.appendChild(tocSVG);

const tocListItems = [...toc.querySelectorAll('li')];

const tocItems = tocListItems
  .map((listItem) => {
    const anchor = listItem.querySelector('a'),
      targetID = anchor && anchor.getAttribute('href').slice(1),
      target = document.getElementById(targetID);
    return { listItem, anchor, target };
  })
  .filter((item) => item.target);

function drawPath() {
  let path = [],
    pathIndent;

  tocItems.forEach((item, i) => {
    const x = item.anchor.offsetLeft - 5,
      y = item.anchor.offsetTop,
      height = item.anchor.offsetHeight;

    if (i === 0) {
      path.push('M', x, y, 'L', x, y + height);
      item.pathStart = 0;
    } else {
      if (pathIndent !== x) path.push('L', pathIndent, y);

      path.push('L', x, y);

      tocPath.setAttribute('d', path.join(' '));
      item.pathStart = tocPath.getTotalLength() || 0;
      path.push('L', x, y + height);
    }

    pathIndent = x;
    tocPath.setAttribute('d', path.join(' '));
    item.pathEnd = tocPath.getTotalLength();
  });

  const coord = tocPath.getBBox();
  tocSVG.setAttribute(
    'viewBox',
    coord.x -
      5 +
      ' ' +
      (coord.y - 5) +
      ' ' +
      (coord.width + 10) +
      ' ' +
      (coord.height + 10)
  );
}

function syncPath() {
  const someElsAreVisible = () =>
      toc.querySelectorAll(`.${visibleClass}`).length > 0,
    thisElIsVisible = (el) => el.classList.contains(visibleClass),
    pathLength = tocPath.getTotalLength();

  let pathStart = pathLength,
    pathEnd = 0,
    lastPathStart,
    lastPathEnd;

  tocItems.forEach((item) => {
    if (thisElIsVisible(item.listItem)) {
      pathStart = Math.min(item.pathStart, pathStart);
      pathEnd = Math.max(item.pathEnd, pathEnd);
    }
  });

  if (someElsAreVisible() && pathStart < pathEnd) {
    if (pathStart !== lastPathStart || pathEnd !== lastPathEnd) {
      const dashArray = `1 ${pathStart} ${pathEnd - pathStart} ${pathLength}`;

      tocPath.style.setProperty('stroke-dashoffset', '1');
      tocPath.style.setProperty('stroke-dasharray', dashArray);
      tocPath.style.setProperty('opacity', 1);
    }
  } else {
    tocPath.style.setProperty('opacity', 0);
  }

  lastPathStart = pathStart;
  lastPathEnd = pathEnd;
}

const tocElements = [];

function decideVisibility() {
  let prevItem;
  tocElements.forEach((item, index) => {
    if (item.status === 'present') {
      item.element.classList.add(visibleClass);
    } else if (item.status === 'past') {
      if (prevItem) prevItem.element.classList.remove(visibleClass);
      item.element.classList.remove(visibleClass);
    } else if (item.status === 'future') {
      if (prevItem && prevItem.status !== 'future')
        prevItem.element.classList.add(visibleClass);
      item.element.classList.remove(visibleClass);
    }

    prevItem = item;
  });

  if (prevItem && prevItem.status !== 'future') {
    prevItem.element.classList.add(visibleClass);
  }
}

function markVisibleSection(observedEls) {
  observedEls.forEach((observedEl) => {
    let status;

    if (observedEl.isIntersecting) {
      status = 'present';
    } else if (observedEl.boundingClientRect.top < 0) {
      status = 'past';
    } else {
      status = 'future';
    }

    const id = observedEl.target.getAttribute('id');
    const anchor = document.querySelector(
      `.table-of-contents li a[href="#${id}"]`
    );

    const elId = tocElements.findIndex((el) => el.id === id);
    if (elId < 0) {
      tocElements.push({
        heading: observedEl,
        element: !!anchor && anchor.parentElement,
        id,
        status
      });
    } else {
      tocElements[elId].status = status;
    }

    decideVisibility();
  });

  syncPath();
}

window.onresize = function () {
  drawPath();
  syncPath();
};

drawPath();

const observer = new IntersectionObserver(markVisibleSection);
elementsToObserve.forEach((thisEl) => observer.observe(thisEl));
