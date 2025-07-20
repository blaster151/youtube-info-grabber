import { VideoInfo, PlaylistInfo } from '../types';

/**
 * Formats video information into a Google Sheets compatible string
 */
export function formatVideoInfo(videoInfo: VideoInfo): string {
  const { title, url, channelName, runningTime } = videoInfo;
  
  // Format: Title | HYPERLINK(url, channelName) | | | | | | | | RunningTime
  return `${title}\t=HYPERLINK("${url}", "${channelName}")\t\t\t\t\t'${runningTime}`;
}

/**
 * Formats playlist information into a Google Sheets compatible string
 */
export function formatPlaylistInfo(playlistInfo: PlaylistInfo): string {
  const { title, url, channelName, videoCount, totalTime } = playlistInfo;
  
  // Format: Title | HYPERLINK(url, channelName) | (videoCount) | | | | | | TotalTime
  return `${title.replace(/'/g, "\\'")}\t=HYPERLINK("${url}", "${channelName}")\t"(${videoCount})"\t\t\t\t\t${totalTime}`;
}

/**
 * Converts seconds to HH:MM:SS format
 */
export function secondsToTimeFormat(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Parses time string (MM:SS or HH:MM:SS) to seconds
 */
export function parseTimeString(timeString: string): number {
  const parts = timeString.split(':').map(Number);
  
  if (parts.length === 3) {
    // HH:MM:SS format
    return (parts[0] ?? 0) * 3600 + (parts[1] ?? 0) * 60 + (parts[2] ?? 0);
  } else if (parts.length === 2) {
    // MM:SS format
    return (parts[0] ?? 0) * 60 + (parts[1] ?? 0);
  }
  
  return 0;
} 