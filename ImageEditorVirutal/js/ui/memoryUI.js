 
export function setupMemoryUI({ memoryManager, eventBus }) {
 
  const memoryUsageEl = document.getElementById('memory-usage');
  const memoryUsageBarEl = document.getElementById('memory-usage-bar');
  const activePagesEl = document.getElementById('active-pages');
  const inactivePagesEl = document.getElementById('inactive-pages');
  const pageHitsEl = document.getElementById('page-hits');
  const pageFaultsEl = document.getElementById('page-faults');
  const pageGridEl = document.getElementById('page-grid');
  
 
  function init() {
   
    eventBus.on('memory:stats:updated', updateMemoryStats);
     
    eventBus.on('memory:page:swapped-out', ({ pageId }) => {
      animatePageSwap(pageId, 'out');
    });
    
    eventBus.on('memory:page:swapped-in', ({ pageId }) => {
      animatePageSwap(pageId, 'in');
    });
    
    
    updateMemoryStats(memoryManager.getMemoryStats());
  }
  
   
    
  function updateMemoryStats(stats) {
     
    memoryUsageEl.textContent = stats.memoryUsage.toFixed(1);
    activePagesEl.textContent = stats.activePages;
    inactivePagesEl.textContent = stats.inactivePages;
    pageHitsEl.textContent = stats.pageHits;
    pageFaultsEl.textContent = stats.pageFaults;
    
     
    const usagePercent = (stats.memoryUsage / 100) * 100;
    memoryUsageBarEl.style.width = `${usagePercent}%`;
    
    
    if (usagePercent > 90) {
      memoryUsageBarEl.style.backgroundColor = 'var(--color-error)';
    } else if (usagePercent > 70) {
      memoryUsageBarEl.style.backgroundColor = 'var(--color-warning)';
    } else {
      memoryUsageBarEl.style.backgroundColor = 'var(--color-primary)';
    }
    
     
    updatePageGrid();
  }
  
   
  function updatePageGrid() {
  
    const pages = memoryManager.getPageTableArray();
    
    
    pageGridEl.innerHTML = '';
    
    
    pages.forEach(page => {
      const pageEl = document.createElement('div');
      pageEl.className = `memory-page ${page.status}`;
      pageEl.dataset.pageId = page.pageId;
      pageEl.title = `${page.pageId}: ${page.status}`;
      
       
      const pageNumber = page.pageId.split('_')[1];
      pageEl.textContent = pageNumber;
      
    
      pageGridEl.appendChild(pageEl);
      
      
      pageEl.addEventListener('click', () => {
        showPageDetails(page);
      });
    });
  }
  
  
  function animatePageSwap(pageId, direction) {
    const pageEl = pageGridEl.querySelector(`[data-page-id="${pageId}"]`);
    if (!pageEl) return;
    
     
    pageEl.classList.add(`swap-${direction}`);
    
     
    setTimeout(() => {
      pageEl.classList.remove(`swap-${direction}`);
      
      if (direction === 'out') {
        pageEl.classList.remove('active');
        pageEl.classList.add('inactive');
      } else {
        pageEl.classList.remove('inactive');
        pageEl.classList.add('active');
      }
    }, 300);  
  }
  
  
  function showPageDetails(page) {
    const details = `
      <div class="page-details">
        <p><strong>Page ID:</strong> ${page.pageId}</p>
        <p><strong>Status:</strong> ${page.status}</p>
        <p><strong>Last Accessed:</strong> ${new Date(page.lastAccessed).toLocaleTimeString()}</p>
      </div>
    `;
    
    eventBus.emit('modal:show', {
      title: 'Memory Page Details',
      content: details,
      showCancel: false,
      confirmText: 'Close'
    });
  }
  
  return {
    init,
    updateMemoryStats
  };
}