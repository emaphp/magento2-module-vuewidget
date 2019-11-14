define(['vue', 'vueutil'], function (Vue, VueUtil) {
  var placeholderSelector = '[role=placeholder]';

  return function (opts, el) {
    var components = opts.components || [];

    var paths = components.map(function (cmpt) {
      return VueUtil.getComponentPath(cmpt);
    });

    var deps = paths.map(function (path) {
      return path[0] === false ? path[1] : path[0];
    });

    require(deps, function() {
      var args = Array.prototype.slice.call(arguments);

      var components = {};
      paths.forEach(function (path, idx) {
        components[path[1]] = path[0] === false ? args[idx] : args[idx][path[1]];
      });

      // By default, remove the placeholder once script finishes loading
      if (!opts.placeholder) {
        var placeholder = Element.prototype.querySelector.call(el, placeholderSelector);
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
  };
});
