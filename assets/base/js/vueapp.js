import Vue from "@magento/vue";
import VueUtil from "@magento/vueutil";

const placeholderSelector = "[role=placeholder]";

export default function(opts, el) {
  const components = opts.components || [];

  const paths = components.map(function(cmpt) {
    return VueUtil.getComponentPath(cmpt);
  });

  const deps = paths.map(function(path) {
    return path[0] === false ? path[1] : path[0];
  });

  require(deps, function() {
    const args = Array.prototype.slice.call(arguments);

    const components = {};
    paths.forEach(function(path, idx) {
      components[path[1]] = path[0] === false ? args[idx] : args[idx][path[1]];
    });

    // By default, remove the placeholder once script finishes loading
    if (!opts.placeholder) {
      const placeholder = Element.prototype.querySelector.call(
        el,
        placeholderSelector
      );
      if (placeholder) {
        el.removeChild(placeholder);
      }
    }

    new Vue({
      el: el,
      components: components,
      provider: VueUtil.buildProvider(opts.provider || {}),
      placeholder: { option: opts.placeholder, selector: placeholderSelector }
    });
  });
}
