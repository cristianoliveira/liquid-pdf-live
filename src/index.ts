import { Liquid } from 'liquidjs';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const rootPath = path.resolve(__dirname, '..');

async function generatePDF(): Promise<void> {
  const engine = new Liquid();
  const templatePath = path.join(rootPath, 'template', 'index.liquid');
  const dataPath = path.join(rootPath, 'template', 'index.json');
  const outputPath = path.join(rootPath, 'dist', 'output.pdf');

  const template = fs.readFileSync(templatePath, 'utf8');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const fullHtml = await engine.parseAndRender(template, data);

  const htmlOutputPath = path.join(rootPath, 'dist', 'output.html');
  fs.writeFileSync(htmlOutputPath, fullHtml);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
  await page.pdf({ path: outputPath, format: 'A4' });

  await browser.close();
  console.log('PDF generated at', outputPath);
}

if (require.main === module) {
  generatePDF().catch(console.error);
}

export { generatePDF };
