const { Liquid } = require('liquidjs');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePDF() {
  const engine = new Liquid();
  const templatePath = path.join(__dirname, 'template', 'index.liquid');
  const cssPath = path.join(__dirname, 'template', 'style.css');
  const outputPath = path.join(__dirname, 'dist', 'output.pdf');

  // Read the template and CSS
  const template = fs.readFileSync(templatePath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');

  // Render the template with data
  const html = await engine.parseAndRender(template, { title: 'Hello, World!' });

  // Add CSS to the HTML
  const fullHtml = `
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>${html}</body>
    </html>
  `;

  // Launch Puppeteer and generate PDF
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
  await page.pdf({ path: outputPath, format: 'A4' });

  await browser.close();
  console.log('PDF generated at', outputPath);
}

generatePDF().catch(console.error);
