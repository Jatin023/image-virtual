 
export class HistoryManager {
  
  constructor(maxStates = 20) {
    this.states = [];
    this.currentIndex = -1;
    this.maxStates = maxStates;
  }
  
  
  addState(state) {
    // If we're not at the end of the history, remove future states
    if (this.currentIndex < this.states.length - 1) {
      this.states = this.states.slice(0, this.currentIndex + 1);
    }
    
    // Add the new state
    this.states.push(this.deepClone(state));
    this.currentIndex = this.states.length - 1;
    
    // Limit the number of states
    if (this.states.length > this.maxStates) {
      this.states.shift();
      this.currentIndex--;
    }
  }
  
   
  undo() {
    if (!this.canUndo()) return null;
    
    this.currentIndex--;
    return this.deepClone(this.states[this.currentIndex]);
  }
  
  
  redo() {
    if (!this.canRedo()) return null;
    
    this.currentIndex++;
    return this.deepClone(this.states[this.currentIndex]);
  }
  
 
  canUndo() {
    return this.currentIndex > 0;
  }
  
   
  canRedo() {
    return this.currentIndex < this.states.length - 1;
  }
  
  
  clear() {
    this.states = [];
    this.currentIndex = -1;
  }
  
   
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  
 
  getCurrentState() {
    if (this.currentIndex < 0) return null;
    return this.deepClone(this.states[this.currentIndex]);
  }
  
  
  getStateCount() {
    return this.states.length;
  }
}