// YouTube video/playlist data structures
export interface VideoInfo {
  title: string;
  url: string;
  channelName: string;
  runningTime: string;
}

export interface PlaylistInfo {
  title: string;
  url: string;
  channelName: string;
  videoCount: number;
  totalTime: string;
}

// Message types for communication between content script and background
export type MessageRequest = 
  | { type: 'CAPTURE_VIDEO'; data: VideoInfo }
  | { type: 'CAPTURE_PLAYLIST'; data: PlaylistInfo }
  | { type: 'GET_STATUS' };

export type MessageResponse = 
  | { type: 'CAPTURE_SUCCESS'; formattedString: string }
  | { type: 'CAPTURE_ERROR'; error: string }
  | { type: 'STATUS'; value: string };

// Extension configuration
export interface ExtensionConfig {
  enableNotifications: boolean;
  autoCopyToClipboard: boolean;
  formatType: 'spreadsheet' | 'plain';
}

// DOM element types for YouTube
export interface YouTubeElements {
  videoRenderer: Element | null;
  playlistRenderer: Element | null;
  titleElement: Element | null;
  urlElement: Element | null;
  channelElement: Element | null;
  timeElement: Element | null;
} 