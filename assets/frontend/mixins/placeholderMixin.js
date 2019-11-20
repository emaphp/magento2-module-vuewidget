const placeholderMixin = {
  mounted() {
    const { option ,selector } = this.$parent.$options.placeholder;
    const $parent = this.$parent;

    this.$placeholder = {
      get() {
        return Element.prototype.querySelector.call($parent.$el, selector);
      },
      hide() {
        const placeholder = this.get();
        placeholder.style.display = 'none';
        return placeholder;
      },
      remove() {
        $parent.$el.removeChild(this.get());
      }
    };

    if (option && option.indexOf(':') != -1) {
      // Setup event listener
      const [ event, action ] = option.split(':');
      if (action) {
        this.$on(event, () => {
          if (action == 'remove') {
            this.$placeholder.remove();
          } else if (action == 'hide') {
            this.$placeholder.hide();
          } else {
            this[action].call(this, this.$placeholder.get());
          }
        });
      }
    }
  }
};

export default placeholderMixin;
