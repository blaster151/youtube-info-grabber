import { sendTypedMessage, addTypedMessageListener } from '../../src/utils/messaging';
import { MessageRequest, MessageResponse } from '../../src/types';

// Mock chrome runtime
const mockChrome = global.chrome as any;

describe('Messaging Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockChrome.runtime.lastError = null;
  });

  describe('sendTypedMessage', () => {
    it('should send message and resolve with response', async () => {
      const mockResponse: MessageResponse = { type: 'STATUS', value: 'ready' };
      mockChrome.runtime.sendMessage.mockImplementation((message, callback) => {
        callback(mockResponse);
      });

      const message: MessageRequest = { type: 'GET_STATUS' };
      const result = await sendTypedMessage(message);

      expect(mockChrome.runtime.sendMessage).toHaveBeenCalledWith(message, expect.any(Function));
      expect(result).toEqual(mockResponse);
    });

    it('should reject when chrome runtime has error', async () => {
      const errorMessage = 'Extension not found';
      mockChrome.runtime.sendMessage.mockImplementation((message, callback) => {
        mockChrome.runtime.lastError = { message: errorMessage };
        callback();
      });

      const message: MessageRequest = { type: 'GET_STATUS' };
      
      await expect(sendTypedMessage(message)).rejects.toThrow(errorMessage);
    });

    it('should handle different message types', async () => {
      const mockResponse: MessageResponse = { type: 'CAPTURE_SUCCESS', formattedString: 'success' };
      mockChrome.runtime.sendMessage.mockImplementation((message, callback) => {
        callback(mockResponse);
      });

      const videoMessage: MessageRequest = { 
        type: 'CAPTURE_VIDEO', 
        data: {
          title: 'Test',
          url: 'https://test.com',
          channelName: 'Test Channel',
          runningTime: '10:30'
        }
      };

      const result = await sendTypedMessage(videoMessage);
      expect(result).toEqual(mockResponse);
      expect(mockChrome.runtime.sendMessage).toHaveBeenCalledWith(videoMessage, expect.any(Function));
    });
  });

  describe('addTypedMessageListener', () => {
    it('should add message listener with synchronous handler', () => {
      const mockListener = jest.fn().mockReturnValue({ type: 'STATUS', value: 'ready' });
      
      addTypedMessageListener(mockListener);
      
      expect(mockChrome.runtime.onMessage.addListener).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should add message listener with asynchronous handler', () => {
      const mockListener = jest.fn().mockResolvedValue({ type: 'STATUS', value: 'ready' });
      
      addTypedMessageListener(mockListener);
      
      expect(mockChrome.runtime.onMessage.addListener).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should handle async errors in listener', () => {
      const mockListener = jest.fn().mockRejectedValue(new Error('Test error'));
      const mockSendResponse = jest.fn();
      
      addTypedMessageListener(mockListener);
      
      // Get the listener function that was registered
      const listenerFunction = mockChrome.runtime.onMessage.addListener.mock.calls[0][0];
      
      // Simulate calling the listener
      const result = listenerFunction({ type: 'GET_STATUS' }, {}, mockSendResponse);
      
      expect(result).toBe(true); // Should return true for async handlers
    });
  });
}); 