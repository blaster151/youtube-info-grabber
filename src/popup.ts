import { sendTypedMessage } from './utils/messaging';

class PopupController {
  private statusElement: HTMLElement | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    document.addEventListener('DOMContentLoaded', () => {
      this.statusElement = document.getElementById('status');
      this.checkExtensionStatus();
    });
  }

  private async checkExtensionStatus(): Promise<void> {
    try {
      const response = await sendTypedMessage({ type: 'GET_STATUS' });
      
      if (response.type === 'STATUS') {
        this.updateStatus('ready', 'Extension is active and ready to capture');
      } else {
        this.updateStatus('error', 'Extension status unknown');
      }
    } catch (error) {
      console.error('Error checking extension status:', error);
      this.updateStatus('error', 'Failed to connect to extension');
    }
  }

  private updateStatus(type: 'ready' | 'error', message: string): void {
    if (!this.statusElement) return;

    // Remove existing status classes
    this.statusElement.classList.remove('ready', 'error');
    
    // Add new status class
    this.statusElement.classList.add(type);
    
    // Update content
    this.statusElement.innerHTML = `
      <strong>${type === 'ready' ? 'Ready' : 'Error'}</strong><br>
      ${message}
    `;
  }
}

// Initialize the popup controller
new PopupController(); 