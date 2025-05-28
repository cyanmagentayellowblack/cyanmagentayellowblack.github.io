# Open Speed Reader

Open Speed Reader is a web-based tool built with HTML, CSS, and JavaScript that helps you speed read a large body of text, no matter how fast or slow you want it to be. Using Rapid Serial Visual Presentation (RSVP), it displays text word-by-word or in small chunks at a customizable speed, enhancing reading efficiency for students, professionals, or anyone tackling dense texts. With features like adjustable words-per-minute (WPM), font customization, and advanced options like skipping stopwords, it’s deployable on GitHub Pages, Playgrounds, or locally in any modern web browser.

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Setup and Deployment](#setup-and-deployment)
5. [Usage](#usage)
6. [Contributing](#contributing)
7. [Troubleshooting](#troubleshooting)
8. [License](#license)

## Introduction

Open Speed Reader empowers you to read large bodies of text quickly and efficiently by presenting words sequentially at a speed you control. Whether you’re studying, reviewing documents, or exploring new material, this tool offers a customizable, user-friendly interface to optimize your reading experience. Paste your text, adjust settings like WPM or chunk size, and dive in at your preferred pace, from leisurely to lightning-fast.

## Features

- **Customizable Reading Speed**: Set words-per-minute (WPM) from 50 to 2000 for comfortable or rapid reading.
- **Chunk Size Control**: Display 1–10 words at a time, balancing speed and comprehension.
- **Text Customization**: Adjust font size (16–120px), font color, background color, and text alignment (center, left, right).
- **Advanced Options**: Enable speed variability, sentence-based chunking, pausing at sentence/paragraph ends, or skipping stopwords (e.g., "the," "and") for faster skimming.
- **Interactive Controls**: Play, pause, restart, skip ±10 seconds, or toggle fullscreen for an immersive experience.
- **Progress Tracking**: View progress via a dynamic progress bar and info display.
- **Cross-Platform**: Runs on GitHub Pages, Playgrounds, or locally in any modern browser.

## Prerequisites

To use or deploy Open Speed Reader, you need:
- A modern web browser (e.g., Chrome, Firefox, Safari).
- Git (optional, for cloning the repository).
- A GitHub account (if deploying to GitHub Pages).
- An internet connection for Playgrounds or GitHub Pages deployment.

## Setup and Deployment

1. **Clone or Download**:
   - Clone the repository: `git clone https://github.com/[your-username]/open-speed-reader.git`
   - Or download the ZIP file from the repository.

2. **Run Locally**:
   - Navigate to the project directory.
   - Open `index.html` in a web browser to use the tool locally.

3. **Deploy to GitHub Pages**:
   - Push the repository to a GitHub repository.
   - Enable GitHub Pages in the repository settings, selecting the `main` branch and `/ (root)` folder.
   - Access the site at `https://[your-username].github.io/open-speed-reader`.

4. **Run on Playgrounds**:
   - Upload the project files to a platform like Swift Playgrounds or similar web-based IDEs supporting HTML/CSS/JS.
   - Run the project directly in the Playgrounds environment.

## Usage

1. **Open the Tool**:
   - Access the deployed site (e.g., via GitHub Pages) or open `index.html` locally.

2. **Read Text**:
   - Paste your text into the textarea or type directly.
   - Click "Speed Read" to start the RSVP display.
   - Use the settings modal to adjust:
     - **WPM**: Set to 200 for average reading or up to 2000 for speed reading.
     - **Chunk Size**: Choose 1–3 words for comprehension or more for faster reading.
     - **Font Size/Color**: Optimize for visibility and comfort.
     - **Alignment**: Select center, left, or right.
     - **Advanced Options**: Enable speed variability, sentence chunking, pausing, or stopword skipping.
   - Use controls to play, pause, restart, skip ±10 seconds, or toggle fullscreen.

3. **Example**:
   - Input: A 1000-word article pasted into the textarea.
   - Settings: 300 WPM, chunk size of 2, center alignment, pause at sentence ends.
   - Action: Click "Speed Read" to see words displayed two at a time at 300 WPM, pausing briefly at sentence ends.
   - Controls: Pause to take a break, skip forward 10 seconds, or enter fullscreen for focus.

## Contributing

We welcome contributions to enhance Open Speed Reader! To contribute:
1. Fork the repository.
2. Create a branch: `git checkout -b feature/your-feature`.
3. Commit changes: `git commit -m "Add your feature"`.
4. Push to your fork: `git push origin feature/your-feature`.
5. Open a pull request with a clear description.

Check the [Issues](https://github.com/[your-username]/open-speed-reader/issues) page for tasks or to report bugs.

## Troubleshooting

- **Text Not Displaying**: Ensure valid text is pasted and JavaScript is enabled; check the browser console (F12) for errors.
- **Speed Too Fast/Slow**: Adjust WPM in settings (50–2000) to match your comfort level.
- **Progress Bar Issues**: Verify text input is sufficient for progress tracking.
- **GitHub Pages Not Loading**: Confirm the repository is public and GitHub Pages is enabled in settings.

For further help, open an issue on the [GitHub repository](https://github.com/[your-username]/open-speed-reader/issues).

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](https://www.gnu.org/licenses/gpl-3.0.txt) file for details.