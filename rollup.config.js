import babel from 'rollup-plugin-babel';
import vue from 'rollup-plugin-vue';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import magento2 from 'rollup-plugin-magento2';

export default [
  {
    input: './assets/adminhtml/components/WidgetProps.vue',
    output: {
      file: './view/adminhtml/web/js/components/WidgetProps.js',
      format: 'iife',
      name: 'bundle',
    },
    plugins: [
      babel({
        exclude: 'node_modules/**'
      }),
      resolve(),
      commonjs(),
      vue(),
      magento2(),
    ]
  },
];
