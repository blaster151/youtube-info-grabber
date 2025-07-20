import { formatVideoInfo, formatPlaylistInfo, secondsToTimeFormat, parseTimeString } from '../../src/utils/formatter';
import { VideoInfo, PlaylistInfo } from '../../src/types';

describe('Formatter Utils', () => {
  describe('formatVideoInfo', () => {
    it('should format video info correctly', () => {
      const videoInfo: VideoInfo = {
        title: 'Test Video Title',
        url: 'https://www.youtube.com/watch?v=test123',
        channelName: 'Test Channel',
        runningTime: '10:30'
      };

      const result = formatVideoInfo(videoInfo);
      
      expect(result).toBe('Test Video Title\t=HYPERLINK("https://www.youtube.com/watch?v=test123", "Test Channel")\t\t\t\t\t\'10:30');
    });

    it('should handle empty values', () => {
      const videoInfo: VideoInfo = {
        title: '',
        url: '',
        channelName: '',
        runningTime: ''
      };

      const result = formatVideoInfo(videoInfo);
      
      expect(result).toBe('\t=HYPERLINK("", "")\t\t\t\t\t\'');
    });
  });

  describe('formatPlaylistInfo', () => {
    it('should format playlist info correctly', () => {
      const playlistInfo: PlaylistInfo = {
        title: 'Test Playlist',
        url: 'https://www.youtube.com/playlist?list=test123',
        channelName: 'Test Channel',
        videoCount: 15,
        totalTime: '02:30:45'
      };

      const result = formatPlaylistInfo(playlistInfo);
      
      expect(result).toBe('Test Playlist\t=HYPERLINK("https://www.youtube.com/playlist?list=test123", "Test Channel")\t"(15)"\t\t\t\t\t02:30:45');
    });

    it('should escape single quotes in playlist title', () => {
      const playlistInfo: PlaylistInfo = {
        title: "Test's Playlist",
        url: 'https://www.youtube.com/playlist?list=test123',
        channelName: 'Test Channel',
        videoCount: 5,
        totalTime: '01:15:30'
      };

      const result = formatPlaylistInfo(playlistInfo);
      
      expect(result).toBe('Test\\\'s Playlist\t=HYPERLINK("https://www.youtube.com/playlist?list=test123", "Test Channel")\t"(5)"\t\t\t\t\t01:15:30');
    });
  });

  describe('secondsToTimeFormat', () => {
    it('should convert seconds to HH:MM:SS format', () => {
      expect(secondsToTimeFormat(3661)).toBe('01:01:01');
      expect(secondsToTimeFormat(7325)).toBe('02:02:05');
      expect(secondsToTimeFormat(0)).toBe('00:00:00');
    });

    it('should handle large numbers', () => {
      expect(secondsToTimeFormat(36661)).toBe('10:11:01');
    });
  });

  describe('parseTimeString', () => {
    it('should parse HH:MM:SS format', () => {
      expect(parseTimeString('01:30:45')).toBe(5445);
      expect(parseTimeString('00:05:30')).toBe(330);
    });

    it('should parse MM:SS format', () => {
      expect(parseTimeString('05:30')).toBe(330);
      expect(parseTimeString('10:45')).toBe(645);
    });

    it('should handle invalid formats', () => {
      expect(parseTimeString('invalid')).toBe(0);
      expect(parseTimeString('')).toBe(0);
    });

    it('should handle undefined values gracefully', () => {
      expect(parseTimeString('1:2')).toBe(62); // 1:02 = 62 seconds
    });
  });
}); 