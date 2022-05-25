import babel from "@rollup/plugin-babel";
import vue from "rollup-plugin-vue";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import magento2 from "rollup-plugin-magento2";

export default [
  {
    input: "./assets/adminhtml/components/WidgetProps.vue",
    output: {
      file: "./view/adminhtml/web/js/components/WidgetProps.js",
      format: "iife",
      name: "admin::WidgetProps"
    },
    plugins: [
      babel({
        exclude: "node_modules/**",
        babelHelpers: "bundled"
      }),
      vue(),
      resolve(),
      commonjs(),
      magento2()
    ]
  },
  {
    input: "./assets/frontend/components/VueHelloWorld.vue",
    output: {
      file: "./view/frontend/web/js/components/VueHelloWorld.js",
      format: "iife",
      name: "VueHelloWorld"
    },
    plugins: [
      babel({
        exclude: "node_modules/**",
        babelHelpers: "bundled"
      }),
      vue(),
      resolve(),
      commonjs(),
      magento2()
    ]
  }
];
