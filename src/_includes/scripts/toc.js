const toc = {
  container: document.querySelector('.table-of-contents-container'),
  element: document.querySelector('.table-of-contents'),
  headings: [
    ...document.querySelectorAll('#appMainContent h1[id], h2[id], h3[id]')
  ].map((header) => ({
    element: header,
    link: header.querySelector('a')
  })),
  links:
    document.querySelector('.table-of-contents') &&
    [...document.querySelector('.table-of-contents').querySelectorAll('a')].map(
      (link) => ({
        element: link
      })
    ),
  svg: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
  path: document.createElementNS('http://www.w3.org/2000/svg', 'path'),
  exists: true,
  smooth: !window.matchMedia('(prefers-reduced-motion)').matches,
  mostRecentlyActive: null
};

let timer = null;
let currentLink = null;
window.addEventListener(
  'scroll',
  function () {
    if (timer !== null) clearTimeout(timer);

    timer = setTimeout(function () {
      if (currentLink) putLinkInView();
      if (toc.exists) {
        drawPath();
        syncPath();
      }
    }, 150);
  },
  false
);

window.addEventListener(
  'resize',
  function () {
    if (toc.exists) {
      drawPath();
      syncPath();
    }
  },
  false
);

function putLinkInView() {
  var offset = currentLink.offsetTop - toc.container.scrollTop;

  if (offset + 10 > toc.container.clientHeight || offset - 10 < 0) {
    toc.container.scroll({
      top: offset + toc.container.scrollTop - toc.container.clientHeight / 2,
      behavior: 'smooth'
    });
  }
}

function drawPath() {
  let path = [];
  let pathIndent;

  toc.links.forEach((link, i) => {
    const x = link.element.offsetLeft + 3;
    const y = link.element.offsetTop;
    const height = link.element.offsetHeight;

    if (i === 0) {
      path.push('M', x, y, 'L', x, y + height);
      link.pathStart = 0;
    } else {
      if (pathIndent !== x) path.push('L', pathIndent, y);

      path.push('L', x, y);

      toc.path.setAttribute('d', path.join(' '));
      link.pathStart = toc.path.getTotalLength() || 0;
      path.push('L', x, y + height);
    }

    pathIndent = x;
    toc.path.setAttribute('d', path.join(' '));
    link.pathEnd = toc.path.getTotalLength();
  });
}

function syncPath() {
  const someElsAreVisible = () =>
    toc.element.querySelectorAll(`.active`).length > 0;
  const thisElIsVisible = (el) => el.classList.contains('active');
  const pathLength = toc.path.getTotalLength();

  let pathStart = pathLength;
  let pathEnd = 0;
  let lastPathStart;
  let lastPathEnd;

  toc.links.forEach((link) => {
    if (thisElIsVisible(link.element)) {
      pathStart = Math.min(link.pathStart, pathStart);
      pathEnd = Math.max(link.pathEnd, pathEnd);
    }
  });

  if (someElsAreVisible() && pathStart < pathEnd) {
    if (pathStart !== lastPathStart || pathEnd !== lastPathEnd) {
      const dashArray = `1 ${pathStart} ${pathEnd - pathStart} ${pathLength}`;

      toc.path.style.setProperty('stroke-dashoffset', '1');
      toc.path.style.setProperty('stroke-dasharray', dashArray);
      toc.path.style.setProperty('opacity', 1);
    }
  } else {
    toc.path.style.setProperty('opacity', 0);
  }

  lastPathStart = pathStart;
  lastPathEnd = pathEnd;
}

function isBelowViewport(element) {
  var distance = element.getBoundingClientRect();
  return (
    distance.bottom >=
    (window.innerHeight || document.documentElement.clientHeight)
  );
}

function setupTOC() {
  const observer = new IntersectionObserver(observerHandler, {
    rootMargin: '0px',
    threshold: 1
  });

  try {
    toc.container.innerHTML = '';
    toc.svg.appendChild(toc.path);
    toc.element.appendChild(toc.svg);
    toc.container.appendChild(toc.element);
    toc.headings.forEach((heading) => observer.observe(heading.link));
    drawPath();
  } catch (error) {
    console.warn(
      'Table of Contents threw an error. This may be because it does not exist.\n\n',
      error
    );
    toc.exists = false;
  }

  if (!toc.exists) {
    observer.disconnect();
    toc.svg.remove();
  }
}

function observerHandler(entries) {
  entries.forEach((entry) => {
    const href = entry.target.getAttribute('href');
    const link = toc.links.find(
      (link) => link.element.getAttribute('href') === href
    );

    if (entry.isIntersecting && entry.intersectionRatio >= 1) {
      link.element.classList.add('visible');
      toc.mostRecentlyActive = entry.target.getAttribute('id');
    } else {
      link.element.classList.remove('visible');
    }
  });

  highlight();
}

function highlight() {
  const visibleLinks = [...toc.element.querySelectorAll('.visible')];

  toc.links.forEach((link) => {
    link.element.classList.remove('active');
  });

  if (visibleLinks.length) {
    let index = toc.links.findIndex(
      (link) =>
        link.element.getAttribute('href') ===
        visibleLinks[visibleLinks.length - 1].getAttribute('href')
    );

    const firstToChange = toc.links[index].element;
    let lastToChange;
    for (; index >= 0; index--) {
      if (!toc.links[index].element.classList.contains('visible')) break;
      toc.links[index].element.classList.add('active');
      lastToChange = toc.links[index].element;
    }

    toc.mostRecentlyActive = lastToChange.getAttribute('href').replace('#', '');
    currentLink = firstToChange;
  }

  if (!visibleLinks.length && toc.mostRecentlyActive) {
    const href = `#${toc.mostRecentlyActive}`;

    const index = toc.links.findIndex(
      (link) => link.element.getAttribute('href') === href
    );

    const link =
      isBelowViewport(toc.headings[index].element) && index > 0
        ? toc.links[index - 1]
        : toc.links[index];

    link.element.classList.add('active');
    toc.mostRecentlyActive = link.element.getAttribute('href').replace('#', '');
    currentLink = link.element;
  }

  syncPath();
}

document.addEventListener('DOMContentLoaded', setupTOC, false);
