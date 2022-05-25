import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import magento2 from "rollup-plugin-magento2";

export default [
  {
    input: "./assets/base/js/vueutil.js",
    output: {
      file: "./view/base/web/js/vueutil.requirejs.js",
      format: "iife",
      name: "vueutil"
    },
    plugins: [
      babel({
        exclude: "node_modules/**",
        babelHelpers: "bundled"
      }),
      resolve(),
      commonjs(),
      magento2({
        virtualDir: "magento"
      })
    ]
  },
  {
    input: "./assets/base/js/vueapp.js",
    output: {
      file: "./view/base/web/js/vueapp.requirejs.js",
      format: "iife",
      name: "vueapp"
    },
    plugins: [
      babel({
        exclude: "node_modules/**",
        babelHelpers: "bundled"
      }),
      resolve(),
      commonjs(),
      magento2({
        virtualDir: "magento"
      })
    ]
  },
  {
    input: "./assets/base/js/vuewidget.js",
    output: {
      file: "./view/base/web/js/vuewidget.requirejs.js",
      format: "iife",
      name: "vuewidget"
    },
    plugins: [
      babel({
        exclude: "node_modules/**",
        babelHelpers: "bundled"
      }),
      resolve(),
      commonjs(),
      magento2({
        virtualDir: "magento"
      })
    ]
  }
];
