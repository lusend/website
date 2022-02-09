let env = 'production';

function toggleEnv() {
  const toggle = document.getElementById('envToggle').checked;
  document.getElementById('envToggle').checked = toggle;

  env = toggle ? 'production' : 'stage';

  document.getElementById('envToggleLabel').innerHTML = toggle
    ? 'Preview & Copy Production Content'
    : 'Preview & Copy Stage Content';
}

toggleEnv();
