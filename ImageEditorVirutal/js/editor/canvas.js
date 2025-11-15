 
export function createCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });     
  
   // Set initial canvas size
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  
 
  function setCanvasSize(width, height) {
    if (canvas.width === width && canvas.height === height) return;
    
    canvas.width = width;
    canvas.height = height;
  }
 
  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  
  
  function drawImage(imageData) {
    if (!imageData) return;
    clearCanvas();
    ctx.putImageData(imageData, 0, 0);
  }
  
   
  function resizeToFit(container, aspectRatio) {
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    let width, height;
    
    if (containerWidth / containerHeight > aspectRatio) {
      
      height = containerHeight;
      width = height * aspectRatio;
    } else {
      
      width = containerWidth;
      height = width / aspectRatio;
    }
    
    setCanvasSize(width, height);
  }
  
  return {
    canvas,
    ctx,
    setCanvasSize,
    clearCanvas,
    drawImage,
    resizeToFit
  };
}