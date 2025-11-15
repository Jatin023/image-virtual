 
export class EventBus {
  constructor() {
    this.events = {};
  }
 
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    
    this.events[event].push(callback);
    
    // Return unsubscribe function
    return () => {
      this.off(event, callback);
    };
  }
  
  
  off(event, callback) {
    if (!this.events[event]) return;
    
    this.events[event] = this.events[event].filter(cb => cb !== callback);
    
    // Clean up empty event arrays
    if (this.events[event].length === 0) {
      delete this.events[event];
    }
  }
  
 
  emit(event, data) {
    if (!this.events[event]) return;
    
    this.events[event].forEach(callback => {
      callback(data);
    });
  }
  
 
  once(event, callback) {
    const onceCallback = (data) => {
      callback(data);
      this.off(event, onceCallback);
    };
    
    this.on(event, onceCallback);
  }
  
  /**
   * Clear all event listeners
   */
  clear() {
    this.events = {};
  }
  
   
  getEvents() {
    return Object.keys(this.events);
  }
  
 
  hasListeners(event) {
    return !!this.events[event] && this.events[event].length > 0;
  }
}