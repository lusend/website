document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelector('.splide')) {
    const splide = new Splide('.splide', {
      type: 'loop',
      speed: 700,
      gap: '2rem',
      arrows: false,
      padding: '5%',
      mediaQuery: 'min',
      keyboard: false,
      breakpoints: {
        640: {
          padding: '15%'
        },
        840: {
          padding: '22%'
        },
        1024: {
          padding: '30%'
        }
      },
      focus: 'center',
      drag: 'free',
      lazyLoad: 'nearby',
      autoScroll: {
        speed: 0.25
      }
    });

    splide.mount(window.splide.Extensions);
  }
});
