// Inject script for development sync
const scriptEl = document.createElement('script');

scriptEl.type = 'text/javascript';
scriptEl.src = 'http://localhost:35729/livereload.js';
scriptEl.async = true;

document.body.append(scriptEl);