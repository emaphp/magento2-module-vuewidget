import Vue from "@magento/vue";

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

const hyphenateRE = /\B([A-Z])/g;

export default {
  hyphenate: function(str) {
    return str.replace(hyphenateRE, "-$1").toLowerCase();
  },

  readOption: function(opts, key) {
    if (opts.hasOwnProperty(key)) {
      return opts[key];
    }
  },

  getComponentPath: function(str) {
    const index = str.indexOf("::");
    if (index == -1) {
      return [false, str];
    }

    return [str.substring(0, index), str.substring(index + 2)];
  },

  buildProvider: function(data) {
    const _cache = {};

    return {
      get: function(path) {
        if (path === undefined) {
          return data;
        }

        const exists = this.has(path);

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

        const _path = path.split(".");
        let _temp = data;
        let found = true;

        for (let i = 0; i < _path.length; i++) {
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
