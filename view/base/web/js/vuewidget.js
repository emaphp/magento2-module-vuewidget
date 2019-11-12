define(['vue', 'vueutil'], function (Vue, VueUtil) {
  return function (opts, el) {
    var path = VueUtil.getComponentPath(opts.component);
    var deps = path[0] === false ? [ path[1] ] : [ path[0] ];
    var props = opts.props || {};
    var options = opts.options || {};

    require(deps, function (c) {
      var widget = document.createElement(VueUtil.hyphenate(path[1]));

      for (var attr in props) {
        widget.setAttribute(attr, props[attr]);
      }

      el.appendChild(widget);

      var components = {};
      components[path[1]] = path[0] === false ? c : c[path[1]];

      new Vue({
        el: el,
        components: components
      });
    });
  };
});
