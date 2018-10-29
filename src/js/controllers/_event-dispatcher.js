/**
 * Class representing a dispatcher for custom events.
 */
export default class EventDispatcher {
  constructor() {
    this.events = new Map; // Map containing listener callbacks.
  }

  /**
   * Add a listener for an event.
   * @param {String} eventName Name of the event to listen to.
   * @param {Function} fn Callback function to execute when event is emitted.
   * @returns Reference to the dispatcher class.
   */
  on(eventName, fn) {
    // Create new Set for listener callbacks if not already created for this event
    if (!this.events.has(eventName)) this.events.set(eventName, new Set); 
    
    // Add the listener callback to the callback Set
    this.events.get(eventName).add(fn);

    return this;
  }

  /**
   * Remove a listener for an event.
   * @param {String} eventName Name of the event from which to remove the listener.
   * @param {Function} fn Callback function to remove from the event.
   * @returns Reference to the dispatcher class.
   */
  remove(eventName, fn) {
    this.events.get(eventName).delete(fn);    
    
    return this;
  }

  /**
   * Emit event and and execute the event callback function of each listener.
   * @param {String} eventName Name of the event to emit.
   * @param {...any} args Arguments to pass to the listeners of this event.
   * @returns Reference to the dispatcher class.
   */
  emit(eventName, ...args) {
    // Check if callbacks for listener exist
    if (this.events.has(eventName)) {
      // Loop through listeners for this event and execute their callback functions
      this.events.get(eventName).forEach(fn => fn(...args));
    }

    return this;
  }
}