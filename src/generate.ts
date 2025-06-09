import { Liquid } from 'liquidjs';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootPath = path.resolve(__dirname, '..');

const wkhtmltopdfBin = process.env.WKHTMLTOPDF_BIN || 'wkhtmltopdf';

export async function generatePDF(file: string): Promise<void> {
  const engine = new Liquid();
  const fileName = path.basename(file, path.extname(file));
  console.log(`Generating PDF for ${fileName}...`);

  const templatePath = path.join(rootPath, 'template', `${fileName}.liquid`);
  const dataPath = path.join(rootPath, 'template', `${fileName}.json`);

  const template = fs.readFileSync(templatePath, 'utf8');
  let data = {};
  if (fs.existsSync(dataPath)) {
    data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  }

  const html = await engine.parseAndRender(
    template,
    data
  );

  // NOTE: wkhtmltopdf injects padding to the body, which we need to the same 
  const fullHtml = html.replace(
    '<head>',
    '<head>\n<style> html { padding: 70px !important; } </style>');

  const htmlOutputPath = path.join(rootPath, 'public/preview', `${fileName}.html`);
  fs.writeFileSync(htmlOutputPath, fullHtml);
  // Run wkhtmltopdf
  const outputPath = path.join(rootPath, 'public/preview', `${fileName}.pdf`);
  const command = `${wkhtmltopdfBin} ${htmlOutputPath} ${outputPath}`;
  execSync(command, { stdio: 'inherit' });
}
