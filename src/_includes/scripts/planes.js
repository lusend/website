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

tsParticles
  .load('planes', config)
  .then((container) => {
    window.togglePlanes = function (planes) {
      if (planes) {
        document.getElementById('planes').style.opacity = 1;
        container.options.particles.size.value = 64;
        container.options.particles.opacity.value.min = 0.1;
        container.options.particles.opacity.value.max = 0.5;
        container.options.particles.shape.image.width = 100;
        container.options.particles.shape.image.height = 100;
        container.options.interactivity.events.onHover.mode = 'repulse';
        container.options.particles.number.density.area = 800;
        container.options.particles.shape.image.src = planeBase64;
        container.play();
      } else {
        document.getElementById('planes').style.opacity = 0;
        container.pause();
        container.refresh();
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

    Mousetrap.bind(
      'a b a c a b b enter',
      function (){
      container.options.particles.size.value = 150;
      container.options.particles.opacity.value.min = 0.8;
      container.options.particles.opacity.value.max = 1;
      container.options.particles.shape.image.width = 100;
      container.options.particles.shape.image.height = 100;
      container.options.interactivity.events.onHover.mode = 'trail';
      container.options.particles.number.density.area = 50;
      container.options.particles.shape.image.src =
        'https://liberty-sa.terradotta.com/_customtags/ct_DocumentRetrieve.cfm?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjp7InRpbWVzdGFtcCI6IjIwMjUtMDktMDJUMTU6MzI6NTkiLCJleHBpcmVMaW5rIjpmYWxzZSwiZmlsZUlkIjo1MTY5M319._ardX5QBkdnbVdQ5d9JcyuEv0uLiXoqq0eh4byQ6O9w';
      container.refresh();
      }
    );
    
    Mousetrap.bind(
      'f a r e w e l l enter',
      function () {
      if (window.confirm('Do you want to give your farewell to Terra Dotta?')) {

          window.location = 'https://www.youtube.com/watch?v=9WU6AlwzdX4';
        } else {
          window.location = 'https://www.youtube.com/shorts/DpxDl68brww';
        }
      }
    );

  })
  .catch((error) => {
    console.error(error);
  });
