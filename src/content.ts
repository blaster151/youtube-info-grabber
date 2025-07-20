import { VideoInfo, PlaylistInfo, YouTubeElements } from './types';
import { formatVideoInfo, formatPlaylistInfo, parseTimeString, secondsToTimeFormat } from './utils/formatter';

class YouTubeInfoGrabber {
  private isProcessing = false;

  constructor() {
    this.init();
  }

  private init(): void {
    document.addEventListener('contextmenu', this.handleContextMenu.bind(this));
    console.log('YouTube Info Grabber: Content script loaded');
  }

  private handleContextMenu(event: MouseEvent): void {
    if (this.isProcessing) {
      return;
    }

    const videoRenderer = event.target as Element;
    const videoElement = videoRenderer.closest('ytd-video-renderer, ytd-playlist-renderer');
    
    if (!videoElement) {
      return;
    }

    event.preventDefault();
    this.isProcessing = true;

    const tagName = videoElement.tagName.toLowerCase();
    
    if (tagName === 'ytd-video-renderer') {
      this.handleVideoElement(videoElement);
    } else if (tagName === 'ytd-playlist-renderer') {
      this.handlePlaylistElement(videoElement);
    }
  }

  private handleVideoElement(videoElement: Element): void {
    const elements = this.extractVideoElements(videoElement);
    
    if (!elements.titleElement || !elements.urlElement) {
      this.isProcessing = false;
      return;
    }

    const videoInfo: VideoInfo = {
      title: elements.titleElement.textContent?.trim() || '',
      url: (elements.urlElement as HTMLAnchorElement).href || '',
      channelName: elements.channelElement?.textContent?.trim().replace(' · Playlist', '') || '',
      runningTime: elements.timeElement?.textContent?.trim() || ''
    };

    const formattedString = formatVideoInfo(videoInfo);
    this.copyToClipboard(formattedString);
  }

  private handlePlaylistElement(playlistElement: Element): void {
    const elements = this.extractPlaylistElements(playlistElement);
    
    if (!elements.titleElement || !elements.urlElement) {
      this.isProcessing = false;
      return;
    }

    const playlistInfo: PlaylistInfo = {
      title: elements.titleElement.textContent?.trim() || '',
      url: (elements.urlElement as HTMLAnchorElement).href || '',
      channelName: elements.channelElement?.textContent?.trim().replace(' · Playlist', '') || '',
      videoCount: 0,
      totalTime: ''
    };

    // Click the "View Full Playlist" link to get detailed info
    const viewFullPlaylistLink = playlistElement.querySelector('#view-more a') as HTMLAnchorElement;
    if (viewFullPlaylistLink) {
      this.processPlaylistDetails(playlistInfo, viewFullPlaylistLink);
    } else {
      this.isProcessing = false;
    }
  }

  private async processPlaylistDetails(playlistInfo: PlaylistInfo, playlistLink: HTMLAnchorElement): Promise<void> {
    // const originalUrl = window.location.href; // Unused variable
    
    // Click the playlist link
    playlistLink.click();

    // Wait for the playlist page to load
    await this.waitForPlaylistLoad();

    try {
      // Extract video count and total time
      const videoCount = this.extractPlaylistVideoCount();
      const totalTime = await this.calculatePlaylistTotalTime();

      playlistInfo.videoCount = videoCount;
      playlistInfo.totalTime = totalTime;

      const formattedString = formatPlaylistInfo(playlistInfo);
      this.copyToClipboard(formattedString);

      // Navigate back to the original page
      history.back();
    } catch (error) {
      console.error('Error processing playlist:', error);
      history.back();
    } finally {
      this.isProcessing = false;
    }
  }

  private extractVideoElements(videoElement: Element): YouTubeElements {
    return {
      videoRenderer: videoElement,
      playlistRenderer: null,
      titleElement: videoElement.querySelector('#video-title'),
      urlElement: videoElement.querySelector('a#thumbnail'),
      channelElement: videoElement.querySelector('#channel-name yt-formatted-string'),
      timeElement: videoElement.querySelector('ytd-thumbnail-overlay-time-status-renderer span')
    };
  }

  private extractPlaylistElements(playlistElement: Element): YouTubeElements {
    return {
      videoRenderer: null,
      playlistRenderer: playlistElement,
      titleElement: playlistElement.querySelector('#video-title'),
      urlElement: playlistElement.querySelector('a#thumbnail'),
      channelElement: playlistElement.querySelector('#channel-name yt-formatted-string'),
      timeElement: null
    };
  }

  private extractPlaylistVideoCount(): number {
    const statsElement = document.querySelector('ytd-playlist-header-renderer .metadata-stats yt-formatted-string');
    if (!statsElement) return 0;

    const textContent = statsElement.textContent?.trim() || '';
    const match = textContent.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  private async calculatePlaylistTotalTime(): Promise<string> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const videoEntries = document.querySelectorAll('ytd-playlist-video-list-renderer ytd-playlist-video-renderer');
        const expectedCount = this.extractPlaylistVideoCount();
        
        if (videoEntries.length === expectedCount && expectedCount > 0) {
          const timeElements = document.querySelectorAll('ytd-playlist-video-list-renderer ytd-thumbnail-overlay-time-status-renderer span');
          
          if (timeElements.length === expectedCount) {
            clearInterval(interval);
            
            let totalSeconds = 0;
            videoEntries.forEach((entry) => {
              const timeElement = entry.querySelector('ytd-thumbnail-overlay-time-status-renderer span');
              if (timeElement) {
                const timeText = timeElement.textContent?.trim() || '';
                totalSeconds += parseTimeString(timeText);
              }
            });

            resolve(secondsToTimeFormat(totalSeconds));
          }
        }
      }, 500);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(interval);
        resolve('00:00:00');
      }, 10000);
    });
  }

  private async waitForPlaylistLoad(): Promise<void> {
    return new Promise((resolve) => {
      const checkLoaded = () => {
        if (document.querySelector('ytd-playlist-header-renderer')) {
          resolve();
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
    });
  }

  private async copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Copied to clipboard:', text);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  }
}

// Initialize the extension
new YouTubeInfoGrabber(); 