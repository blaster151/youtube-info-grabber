# YouTube Info Grabber

A Chrome extension that allows you to capture YouTube video and playlist information via right-click, formatted for easy copying to spreadsheets.

## Features

- **Right-click to capture**: Right-click on any YouTube video or playlist in search results
- **Automatic clipboard copy**: Information is automatically copied to your clipboard
- **Spreadsheet-friendly format**: Output formatted for Google Sheets with HYPERLINK functions
- **Playlist support**: Captures video count and total duration for playlists
- **TypeScript**: Built with TypeScript for better development experience
- **Comprehensive testing**: Unit tests with Jest and Chrome API mocking

## Installation

### Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd youtube-info-grabber
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder from this project

### Production Build

```bash
npm run build
```

The built extension will be in the `dist` folder.

## Usage

1. Go to YouTube search results page (e.g., `https://www.youtube.com/results?search_query=your+search`)
2. Right-click on any video or playlist entry
3. The extension will capture the information and copy it to your clipboard
4. Paste into your spreadsheet

### Output Format

**Videos:**
```
Video Title	=HYPERLINK("https://youtube.com/watch?v=...", "Channel Name")		'10:30
```

**Playlists:**
```
Playlist Title	=HYPERLINK("https://youtube.com/playlist?list=...", "Channel Name")	"(15)"		02:30:45
```

## Development

### Project Structure

```
src/
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── background.ts    # Background service worker
├── content.ts       # Content script
├── popup.ts         # Popup interface
├── popup.html       # Popup HTML
└── manifest.json    # Extension manifest
```

### Available Scripts

- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run watch` - Watch for changes and rebuild
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking

### Testing

The project includes comprehensive unit tests using Jest with Chrome API mocking:

```bash
npm test
```

Tests cover:
- Utility functions (formatter, messaging)
- Type safety
- Chrome API interactions

### Adding New Features

1. **New message types**: Add to `src/types/index.ts`
2. **New utilities**: Add to `src/utils/`
3. **New UI components**: Add to popup or create new HTML files
4. **New permissions**: Update `manifest.json`

## Technical Details

### Manifest V3

This extension uses Chrome's Manifest V3, which means:
- Background scripts are service workers (event-driven)
- Content scripts run in isolated contexts
- Enhanced security and performance

### Type Safety

The extension uses TypeScript throughout with:
- Typed message contracts between components
- Strict type checking
- Interface definitions for all data structures

### Chrome APIs Used

- `chrome.runtime` - Message passing and extension lifecycle
- `chrome.storage` - Configuration storage
- `chrome.tabs` - Tab management
- `navigator.clipboard` - Clipboard access

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Troubleshooting

### Extension not working
- Check that the extension is enabled in `chrome://extensions/`
- Ensure you're on a YouTube search results page
- Check the browser console for error messages

### Build issues
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript compilation with `npm run type-check`
- Verify webpack configuration

### Test failures
- Ensure Jest is properly configured
- Check that Chrome API mocks are working
- Verify test environment setup 