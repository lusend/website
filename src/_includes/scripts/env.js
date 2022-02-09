let env = 'production';

function toggleEnv() {
  const toggle = document.getElementById('envToggle').checked;
  document.getElementById('envToggle').checked = toggle;

  env = toggle ? 'production' : 'stage';

  document.getElementById('envToggleLabel').innerHTML = toggle
    ? 'Production Content'
    : 'Stage Content';
}

toggleEnv();
