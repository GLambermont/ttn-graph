// DEPENDENCIES
const path = require('path');

// CONFIG
export default {
  context: path.resolve(__dirname, 'src'),
  entries: {
    babelPolyfill: '@babel/polyfill',
    main: './js/main.js'
  },
  html: [
    {
      filename: 'index.html',
      template: './index.html'
    },
    {
      filename: '404.html',
      template: './404.html'
    },
    {
      filename: '5xx.html',
      template: './5xx.html'
    }
  ]
};
