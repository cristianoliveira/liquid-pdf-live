import { Liquid } from 'liquidjs';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const rootPath = path.resolve(__dirname, '..');

export async function generatePDF(file: string): Promise<void> {
  const engine = new Liquid();
  const fileName = path.basename(file, path.extname(file));
  const templatePath = path.join(rootPath, 'template', file);
  const dataPath = path.join(rootPath, 'template', `${fileName}.json`);
  const outputPath = path.join(rootPath, 'dist', `${fileName}.pdf`);

  const template = fs.readFileSync(templatePath, 'utf8');
  let data = {};
  if (fs.existsSync(dataPath)) {
    data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  }

  const fullHtml = await engine.parseAndRender(template, data);

  const htmlOutputPath = path.join(rootPath, 'dist', `${fileName}.html`);
  fs.writeFileSync(htmlOutputPath, fullHtml);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
  await page.pdf({ path: outputPath, format: 'A4' });

  await browser.close();
  console.log('PDF generated at', outputPath);
}
