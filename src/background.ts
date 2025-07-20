import { MessageRequest, MessageResponse } from './types';
import { addTypedMessageListener } from './utils/messaging';

class BackgroundService {
  constructor() {
    this.init();
  }

  private init(): void {
    // Set up message listeners
    addTypedMessageListener(this.handleMessage.bind(this));
    
    // Handle extension installation
    chrome.runtime.onInstalled.addListener(this.handleInstallation.bind(this));
    
    console.log('YouTube Info Grabber: Background service worker initialized');
  }

  private handleInstallation(details: chrome.runtime.InstalledDetails): void {
    if (details.reason === 'install') {
      console.log('YouTube Info Grabber: Extension installed');
      
      // Set default configuration
      chrome.storage.sync.set({
        enableNotifications: true,
        autoCopyToClipboard: true,
        formatType: 'spreadsheet'
      });
    } else if (details.reason === 'update') {
      console.log('YouTube Info Grabber: Extension updated');
    }
  }

  private async handleMessage(
    message: MessageRequest, 
    sender: chrome.runtime.MessageSender
  ): Promise<MessageResponse> {
    try {
      switch (message.type) {
        case 'GET_STATUS':
          return { type: 'STATUS', value: 'ready' };
        
        case 'CAPTURE_VIDEO':
          // For now, just acknowledge the capture
          // In a more complex extension, you might store this data
          return { 
            type: 'CAPTURE_SUCCESS', 
            formattedString: 'Video captured successfully' 
          };
        
        case 'CAPTURE_PLAYLIST':
          // For now, just acknowledge the capture
          return { 
            type: 'CAPTURE_SUCCESS', 
            formattedString: 'Playlist captured successfully' 
          };
        
        default:
          return { 
            type: 'CAPTURE_ERROR', 
            error: 'Unknown message type' 
          };
      }
    } catch (error) {
      console.error('Error handling message:', error);
      return { 
        type: 'CAPTURE_ERROR', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

// Initialize the background service
new BackgroundService(); 