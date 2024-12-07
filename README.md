# GitHub URL Saver

A Chrome extension that helps you save URLs and text snippets directly to GitHub with notes.

## Features

- 📎 Save current page URL and title to GitHub
- 📝 Add custom notes to your bookmarks
- ✨ Multiple ways to save:
  - Click the extension icon
  - Right-click context menu for selected text
  - Floating save button on the right side of the page
- 🎯 Auto-fill selected text as notes
- 🔄 Sync with GitHub for access anywhere
- 🌙 Dark mode support

## Installation

1. Clone this repository:
```bash
git clone [repository-url]
cd git-url-saver
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
   - Select the `dist` directory from this project

## Usage

### 1. Extension Icon
- Click the extension icon in the toolbar to save the current page
- Add optional notes in the popup window

### 2. Context Menu
- Select any text on a webpage
- Right-click and choose "Save to GitHub"
- The selected text will automatically be added as a note

### 3. Floating Button
- A floating save button is available on the right side of every webpage
- Click it to quickly save the current page
- The button stays in a fixed position for easy access

## Development

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup Development Environment
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
```

### Project Structure
```
git-url-saver/
├── src/
│   ├── popup/          # Extension popup UI
│   ├── background.ts   # Background script
│   ├── content-script.ts # Content script for floating button
│   └── utils/          # Utility functions
├── assets/            # Icons and images
└── dist/             # Build output
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with Vite
- Uses React for UI
- TypeScript for type safety
- Tailwind CSS for styling
