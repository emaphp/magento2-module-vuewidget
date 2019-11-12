define(['vue'], function (Vue) {
  Vue.mixin({
    beforeCreate() {
      const options = this.$options;
      if (options.provider) {
        this.$provider = options.provider;
      } else if (options.parent && options.parent.$provider) {
        this.$provider = options.parent.$provider;
      }
    }
  });

  var hyphenateRE = /\B([A-Z])/g;

  return {
    hyphenate: function (str) {
      return str.replace(hyphenateRE, '-$1').toLowerCase();
    },

    readOption: function (opts, key) {
      if (opts.hasOwnProperty(key)) {
        return opts[key];
      }
    },

    getComponentPath: function (str) {
      var index = str.indexOf('::');
      if (index == -1) {
        return [false, str];
      }

      return [str.substring(0, index), str.substring(index + 2)];
    },

    buildProvider: function (data) {
      var _cache = {};

      return {
        get: function(path) {
          if (path === undefined) {
            return data;
          }

          var exists = this.has(path);

          if (exists) {
            return _cache[path];
          }
        },

        has: function(path) {
          if (path === undefined) {
            return false;
          }

          if (_cache.hasOwnProperty(path)) {
            return true;
          }

          var _path = path.split('.');
          var _temp = data;
          var found = true;

          for (var i = 0; i < _path.length; i++) {
            found = _temp.hasOwnProperty(_path[i]);
            if (found === false) break;
            _temp = _temp[_path[i]];
          }

          if (found) {
            _cache[path] = _temp;
            return true;
          }

          return false;
        }
      };
    }
  };
});
