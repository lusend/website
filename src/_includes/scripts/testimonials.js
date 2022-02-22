document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelector('.splide')) {
    const splide = new Splide('.splide', {
      type: 'loop',
      speed: 400,
      start: 1,
      gap: '2rem',
      perMove: 1,
      arrows: false,
      padding: '10%',
      mediaQuery: 'min',
      keyboard: 'focus',
      waitForTransition: false,
      breakpoints: {
        640: {
          padding: '24%'
        },
        840: {
          padding: '28%'
        },
        1024: {
          padding: '34%'
        }
      },
      focus: 'center',
      drag: 'free',
      autoScroll: {
        speed: 0.25
      }
    });

    splide.mount(window.splide.Extensions);
  }
});
