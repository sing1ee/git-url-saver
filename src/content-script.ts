// Create floating button
function createFloatingButton() {
  const button = document.createElement('button');
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
    </svg>
  `;
  
  // Style the button
  button.style.cssText = `
    position: fixed;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 9999;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #4F46E5;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    padding: 12px;
  `;

  // Add hover effect
  button.onmouseover = () => {
    button.style.transform = 'translateY(-50%) scale(1.1)';
    button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
  };
  button.onmouseout = () => {
    button.style.transform = 'translateY(-50%)';
    button.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
  };

  // Style the SVG icon
  const svg = button.querySelector('svg');
  if (svg) {
    svg.style.cssText = `
      width: 24px;
      height: 24px;
      stroke: white;
    `;
  }

  // Add click handler
  button.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'openPopup' });
  });

  // Append button to body
  document.body.appendChild(button);
}

// Initialize floating button
createFloatingButton();
