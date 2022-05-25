import Vue from "@magento/vue";
import VueUtil from "@magento/vueutil";

export default function(opts, el) {
  const path = VueUtil.getComponentPath(opts.component);
  const deps = path[0] === false ? [path[1]] : [path[0]];
  const props = opts.props || {};

  require(deps, function(c) {
    const widget = document.createElement(VueUtil.hyphenate(path[1]));

    for (let attr in props) {
      widget.setAttribute(attr, props[attr]);
    }

    el.appendChild(widget);

    const components = {};
    components[path[1]] = path[0] === false ? c : c[path[1]];

    new Vue({
      el: el,
      components: components
    });
  });
}
