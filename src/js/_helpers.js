/**
 * Add multiple CSS properties to an element.
 * @param {HTMLElement} el Element to apply styling to.
 * @param {Object.<string, string>} properties CSS properties to add.
 */
const style = (el, properties) => {
  let styleString = '';

  for (let propertyName in properties) {
    styleString += `${property}:${properties[propertyName]};`;
  }

  el.style.cssText += styleString;
};

/**
 * Convert an RGB value to HEX.
 * @param {number} r Red channel value.
 * @param {number} g Green channel value.
 * @param {number} b Blue channel value.
 * @returns {string} The input value in HEX format.
 */
const rgbToHex = (r, g, b) => {
  if (r > 255 || g > 255 || b > 255)
    throw new Error('Invalid color component');
  return ((r << 16) | (g << 8) | b).toString(16);
};

/**
 * Round a number to a specific decimal length.
 * @param {number} number Number to round.
 * @param {number} precision Number of decimals.
 */
const precisionRound = (number, precision) => {
  const factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
};

/**
 * Check if a value is numeric.
 * @param {*} value Value to check.
 * @returns {boolean} Boolean indicating if the input value is numeric.
 */
const isNumeric = value => {
  return (!isNaN(parseFloat(value)) && isFinite(value));
};

/**
 * Re-map a number from one range to another. 
 * @param {number} value The number to map. 
 * @param {number} inMin The lower bound of the value’s current range.
 * @param {number} inMax The upper bound of the value’s current range.
 * @param {number} outMin The lower bound of the value’s target range.
 * @param {number} outMax The upper bound of the value’s target range.
 * @returns {number} The mapped value.
 */
const mapValue = (value, inMin, inMax, outMin, outMax) => {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
};

/**
 * Generate a random integer.
 * @param {number} min Minimum value.
 * @param {number} max Maximum value.
 * @returns {number} Random integer.
 */
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generate a random float.
 * @param {number} min Minimum value.
 * @param {number} max Maximum value.
 * @returns {number} Random float.
 */
const randomFloat = (min, max) => {
  return Math.random() * (max - min + 1) + min;
};

/**
 * Randomly pick a value from a list of values and weights for each value.
 * @param {Object.<*, number>} values Object containing values and their weight.
 * @param {*} values.value Value from which wil be picked.
 * @param {number} values.weight The weight for this value.
 * @returns A picked value.
 */
const weightedRandom = (values) => {
  const random = Math.random();
  let sum = 0;

  for (let value in values) {
    sum += values[value];

    if (random <= sum) return value;
  }
}

/**
 * Force reload a class name on an element to retrigger an animation.
 * @param {HTMLElement} el HTML element on wich to reload animation.
 * @param {string} className The class name used to trigger the animation.
 */
const reloadAnimationClass = (el, className) => {
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
}

/**
 * Set --vh CSS custom property to simulate correct vh unit behaviour on mobile
 */
const setCssVhProperty = () => {
  let vh = window.innerHeight * 0.01;
  let throttleTimeout;

  document.documentElement.style.setProperty('--vh', `${vh}px`);

  // Reset vh CSS custom property on resize
  window.addEventListener('resize', () => {
    // Throttle/debounce
    clearTimeout(throttleTimeout);

    throttleTimeout = setTimeout(() => {
      vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }, 250);
  });
};

/**
 * Returns the first HTML element matching the given selector query.
 * @param {String} query Query used to select the HTML elements.
 * @param {HTMLElement} [parent=document] Parent in which to search for the element.
 * @returns {HTMLElement} 
 */
const select = (query, parent = document) => parent.querySelector(query);

/**
 * Returns all HTML elements matching the given selector query.
 * @param {String} query Query used to select the HTML elements.
 * @param {HTMLElement} [parent=document] Parent in which to search for the elements.
 * @returns {NodeList|null} 
 */
const selectAll = (query, parent = document) => parent.querySelectorAll(query);

/**
 * Create a new HTML element.
 * @param {String} tagName The type of element to be created.
 * @param {Object} [options] Object containing a single property named is, whose value is the tag name for a custom element previously defined using customElements.define().
 * @returns {HTMLElement} 
 */
const createEl = (tagName, options) => document.createElement(tagName, options);

/**
 * Create a new HTML element.
 * @param {String} namespaceURI the namespace URI to associate with the element.
 * @param {String} qualifiedName The type of element to be created.
 * @param {Object} [options] Object containing a single property named is, whose value is the tag name for a custom element previously defined using customElements.define().
 * @returns {HTMLElement} 
 */
const createElNS = (namespaceURI, qualifiedName, options) => document.createElementNS(namespaceURI, qualifiedName, options);
export {
  style,
  rgbToHex,
  precisionRound,
  isNumeric,
  mapValue,
  randomInt,
  randomFloat,
  weightedRandom,
  reloadAnimationClass,
  setCssVhProperty,
  select,
  selectAll,
  createEl,
  createElNS
};