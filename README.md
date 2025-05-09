# Liquid-PDF-live

## Introduction

This project is designed to generate PDF files using Liquid templates in live mode.
That means whenever the template file is modified, the server will automatically regenerate the PDF file and reload it in the browser.

### TL;DR;
This app allows you to have the following workflow
> Liquid Templates > HTML > PDF > Live Comparison (live reload)

![20250508_18h47m50s_grim](https://github.com/user-attachments/assets/ada16cc2-dabc-478c-b2c9-7576b8d63587)

## Features

- Live reloading of PDF files
- Comparing HTML and PDF files side by side
- Liquid Template-based PDF generation
- Command-line interface for easy usage

## Getting Started

### Prerequisites

 - Node.js (v22.x or later)
 - npm (Node Package Manager)
 - A chrome-based browser (for live reloading and PDF generation)

### Clone the Repository

To clone the repository, run the following command:

```bash 
git clone https://github.com/cristianoliveira/liquid-pdf-live.git
```

### Installing

To install the project dependencies, run:

```bash
npm install
```

## Running the Server

To start the server, use the following command:

```bash
npm run start
```

## Usage

This will launch the server, and you can access it at `http://localhost:3000?template=foobar`.

Once it is running, add the `templates/` like this `{foobar}.liquid` and `{foobar}.json` to start
generating PDFs. It **watches** for changes and automatically generates and reload the browser

## CLI Usage

To generate a PDF on demand, use the following command:

```bash
npm run generate -- <path-to-template-file>
```

Replace `<path-to-template-file>` with the path to your Liquid template file.

## Project Structure

- `src/`: Contains the source code for the project.
- `template/`: Contains the template files and associated JSON data files.
- `dist/`: Output directory for generated PDF files.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
