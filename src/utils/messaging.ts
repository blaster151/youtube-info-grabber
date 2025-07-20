import { MessageRequest, MessageResponse } from '../types';

/**
 * Type-safe message sender for Chrome extension communication
 */
export function sendTypedMessage<T extends MessageRequest>(
  message: T
): Promise<MessageResponse> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response: MessageResponse) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(response);
      }
    });
  });
}

/**
 * Type-safe message listener setup
 */
export function addTypedMessageListener(
  listener: (message: MessageRequest, sender: chrome.runtime.MessageSender) => Promise<MessageResponse> | MessageResponse
): void {
  chrome.runtime.onMessage.addListener((
    message: MessageRequest, 
    sender: chrome.runtime.MessageSender, 
    sendResponse: (response: MessageResponse) => void
  ) => {
    const result = listener(message, sender);
    
    if (result instanceof Promise) {
      result.then(sendResponse).catch((error) => {
        sendResponse({ type: 'CAPTURE_ERROR', error: error.message });
      });
      return true; // Keep the message channel open for async response
    } else {
      sendResponse(result);
    }
  });
} 