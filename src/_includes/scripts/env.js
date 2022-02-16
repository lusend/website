document.addEventListener('alpine:init', () => {
  Alpine.store('env', {
    value: 'production',
    label: 'Preview & Copy Production Content',

    toggle() {
      this.value = this.value === 'production' ? 'stage' : 'production';

      switch (this.value) {
        case 'stage':
          this.label = 'Preview & Copy Stage Content';
          break;
        default:
          this.label = 'Preview & Copy Production Content';
      }

      console.log(this.value);
    }
  });
});
