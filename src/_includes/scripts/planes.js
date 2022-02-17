const planeBase64 =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBhcmlhLWhpZGRlbj0idHJ1ZSIgcm9sZT0iaW1nIiBjbGFzcz0iaWNvbmlmeSBpY29uaWZ5LS1mYS1zb2xpZCIgd2lkdGg9IjEuMTNlbSIgaGVpZ2h0PSIxZW0iIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiIHZpZXdCb3g9IjAgMCA1NzYgNTEyIj48cGF0aCBkPSJNNDgwIDE5MkgzNjUuNzFMMjYwLjYxIDguMDZBMTYuMDE0IDE2LjAxNCAwIDAgMCAyNDYuNzEgMGgtNjUuNWMtMTAuNjMgMC0xOC4zIDEwLjE3LTE1LjM4IDIwLjM5TDIxNC44NiAxOTJIMTEybC00My4yLTU3LjZjLTMuMDItNC4wMy03Ljc3LTYuNC0xMi44LTYuNEgxNi4wMUM1LjYgMTI4LTIuMDQgMTM3Ljc4LjQ5IDE0Ny44OEwzMiAyNTZMLjQ5IDM2NC4xMkMtMi4wNCAzNzQuMjIgNS42IDM4NCAxNi4wMSAzODRINTZjNS4wNCAwIDkuNzgtMi4zNyAxMi44LTYuNEwxMTIgMzIwaDEwMi44NmwtNDkuMDMgMTcxLjZjLTIuOTIgMTAuMjIgNC43NSAyMC40IDE1LjM4IDIwLjRoNjUuNWM1Ljc0IDAgMTEuMDQtMy4wOCAxMy44OS04LjA2TDM2NS43MSAzMjBINDgwYzM1LjM1IDAgOTYtMjguNjUgOTYtNjRzLTYwLjY1LTY0LTk2LTY0eiIgZmlsbD0iY3VycmVudENvbG9yIj48L3BhdGg+PC9zdmc+';

let config = {
  autoPlay: true,
  fullScreen: {
    enable: true
  },
  detectRetina: true,
  duration: 0,
  fpsLimit: 60,
  interactivity: {
    detectsOn: 'window',
    events: {
      onClick: {
        enable: true,
        mode: 'push'
      },
      onHover: {
        enable: true,
        mode: 'repulse'
      },
      resize: true
    },
    modes: {
      repulse: {
        distance: 150
      },
      push: {
        quantity: 1
      },
      trail: {
        delay: 0.05,
        quantity: 1,
        pauseOnStop: true
      }
    }
  },

  particles: {
    color: {
      value: '#fff',
      animation: {
        h: {
          count: 0
        }
      }
    },
    move: {
      enable: true,
      direction: 'right',
      straight: false
    },
    opacity: {
      value: {
        min: 0.1,
        max: 0.5
      },
      animation: {
        enable: true,
        speed: 0.5,
        startValue: 'random',
        minimumValue: 0.2
      }
    },
    number: {
      density: {
        enable: true,
        area: 800,
        factor: 1000
      },
      limit: 0,
      value: 10
    },
    rotate: {
      path: true
    },
    shape: {
      type: 'image',
      image: {
        width: 100,
        height: 100,
        src: planeBase64
      }
    },
    size: {
      value: 64,
      random: {
        enable: true,
        minimumValue: 8
      }
    }
  }
};

window.togglePlanes = function (planes) {};

const particles = $('#planes')
  .particles()
  .init(config, (container) => {
    window.togglePlanes = function (planes) {
      if (planes) {
        $('#planes').css('opacity', 1);
        container.options.particles.size.value = 64;
        container.options.particles.opacity.value.min = 0.1;
        container.options.particles.opacity.value.max = 0.5;
        container.options.particles.shape.image.width = 100;
        container.options.particles.shape.image.height = 100;
        container.options.interactivity.events.onHover.mode = 'repulse';
        container.options.particles.number.density.area = 800;
        container.options.particles.shape.image.src = planeBase64;
        container.start();
      } else {
        $('#planes').css('opacity', 0);
        container.stop();
      }
    };

    Mousetrap.bind(
      'up up down down left right left right b a enter',
      function () {
        container.options.particles.size.value = 300;
        container.options.particles.opacity.value.min = 0.8;
        container.options.particles.opacity.value.max = 1;
        container.options.particles.shape.image.width = 102;
        container.options.particles.shape.image.height = 73;
        container.options.interactivity.events.onHover.mode = 'trail';
        container.options.particles.number.density.area = 50;
        container.options.particles.shape.image.src =
          'https://liberty-sa.terradotta.com/_customtags/ct_Image.cfm?Image_ID=35457';
        container.refresh();
      }
    );
  });
