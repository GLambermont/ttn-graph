import 'normalize.css';
import '../scss/main.scss';
import './controllers/_server-connection';
import './controllers/_graph';
import { init as initGraph } from './controllers/_graph';

/**
 * Initialize this app
 */
const init = () => {   
  initGraph();
};

document.addEventListener('DOMContentLoaded', init);
