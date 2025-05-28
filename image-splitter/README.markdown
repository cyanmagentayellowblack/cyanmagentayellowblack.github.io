# Image Splitter

Image Splitter is a web-based tool built with HTML, CSS, and JavaScript that allows users to upload an image and split it into smaller parts, such as tiles or sections, based on custom parameters. Perfect for creating image grids, preparing assets for web development, or processing images for creative projects, it runs seamlessly on GitHub Pages, Playgrounds, or locally in any modern web browser.

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

Image Splitter provides an intuitive web interface for dividing images into smaller segments, making it easy to create tiles for games, slice images for web design, or prepare data for machine learning. Its lightweight design and cross-platform compatibility ensure accessibility for developers and casual users alike.

## Features

- **Image Upload and Splitting**: Upload images (PNG, JPEG, etc.) and split them into a grid or custom regions.
- **Customizable Parameters**: Specify the number of rows and columns or pixel-based divisions.
- **Preview and Download**: View split images in the browser and download them as individual files.
- **Cross-Platform**: Runs on GitHub Pages, Playgrounds, or locally in any modern browser.

## Prerequisites

To use or deploy Image Splitter, you need:
- A modern web browser (e.g., Chrome, Firefox, Safari).
- Git (optional, for cloning the repository).
- A GitHub account (if deploying to GitHub Pages).
- An internet connection for Playgrounds or GitHub Pages deployment.

## Setup and Deployment

1. **Clone or Download**:
   - Clone the repository: `git clone https://github.com/[your-username]/image-splitter.git`
   - Or download the ZIP file from the repository.

2. **Run Locally**:
   - Navigate to the project directory.
   - Open `index.html` in a web browser to use the tool locally.

3. **Deploy to GitHub Pages**:
   - Push the repository to a GitHub repository.
   - Enable GitHub Pages in the repository settings, selecting the `main` branch and `/ (root)` folder.
   - Access the site at `https://[your-username].github.io/image-splitter`.

4. **Run on Playgrounds**:
   - Upload the project files to a platform like Swift Playgrounds or similar web-based IDEs supporting HTML/CSS/JS.
   - Run the project directly in the Playgrounds environment.

## Usage

1. **Open the Tool**:
   - Access the deployed site (e.g., via GitHub Pages) or open `index.html` locally.

2. **Split an Image**:
   - Click the "Upload Image" button to select an image file (PNG, JPEG, etc.).
   - Enter the desired number of rows and columns (e.g., 2x2 for four tiles).
   - Click "Split Image" to generate the segments.
   - Preview the split images in the browser.
   - Download individual segments or a ZIP file containing all split images.

3. **Example**:
   - Upload `sample.jpg` and set a 3x3 grid.
   - The tool generates nine images (`sample_0_0.jpg`, `sample_0_1.jpg`, etc.), displayed in the interface and available for download.

## Contributing

We welcome contributions to enhance Image Splitter! To contribute:
1. Fork the repository.
2. Create a branch: `git checkout -b feature/your-feature`.
3. Commit changes: `git commit -m "Add your feature"`.
4. Push to your fork: `git push origin feature/your-feature`.
5. Open a pull request with a clear description.

Check the [Issues](https://github.com/[your-username]/image-splitter/issues) page for tasks or to report bugs.

## Troubleshooting

- **Image Not Uploading**: Ensure the file is a supported format (PNG, JPEG) and under the browser’s size limit.
- **Split Images Not Displaying**: Check browser console for errors (F12) and verify JavaScript is enabled.
- **GitHub Pages Not Working**: Confirm the repository is public and GitHub Pages is enabled in settings.

For further help, open an issue on the [GitHub repository](https://github.com/[your-username]/image-splitter/issues).

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](https://www.gnu.org/licenses/gpl-3.0.txt) file for details.