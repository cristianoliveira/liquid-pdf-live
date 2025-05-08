const { Liquid } = require('liquidjs');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePDF() {
  const engine = new Liquid();
  const templatePath = path.join(__dirname, 'template', 'index.liquid');
  const dataPath = path.join(__dirname, 'template', 'index.json');
  const outputPath = path.join(__dirname, 'dist', 'output.pdf');

  // Read the template and CSS
  const template = fs.readFileSync(templatePath, 'utf8');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  // Render the template with data
  const fullHtml = await engine.parseAndRender(template, data);

  // Output HTML to a file for debugging
  const htmlOutputPath = path.join(__dirname, 'dist', 'output.html');
  fs.writeFileSync(htmlOutputPath, fullHtml);

  // Launch Puppeteer and generate PDF
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
  await page.pdf({ path: outputPath, format: 'A4' });

  await browser.close();
  console.log('PDF generated at', outputPath);
}

// In case you want to run this file directly
// `node index.js`
if (require.main === module) {
  generatePDF().catch(console.error);
}

exports.generatePDF = generatePDF;
