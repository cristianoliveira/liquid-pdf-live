import fs from 'fs';
import { generatePDF } from './generate';
import liveServer from 'live-server';

const port = Number(process.env.PORT || 3033);

const changeStack = new Set<string>();
fs.watch('./template', async (event, file) => {
  console.log('Event: ', file, event);
  if (!file) {
    console.log('No file specified');
    return;
  }

  if (changeStack.has(file)) {
    console.log('Already processing this file, skipping...');
    return;
  }
  changeStack.add(file);

  try {
    generatePDF(file)
    console.log('PDF generated successfully');

  } catch (err) {
    console.error('Error generating PDF:', err);

  } finally {
    setTimeout(() => {
      changeStack.delete(file);
    }, 500);

  }
});

// If running first time, generate all PDFs
const files = fs.readdirSync('./template');
files.forEach((file) => {
  if (file.endsWith('.liquid')) {
    console.log('Generating PDF for:', file);
    generatePDF(file)
    .then(() => {
      console.log('PDF generated successfully');
    })
    .catch((err) => {
      console.error('Error generating PDF:', err);
    });
  }
});

liveServer.start({
  port,
  root: './public',
  host: '0.0.0.0',
  open: false,
  mount: [['./public/preview', '/preview']],
  ignore: './public/preview/*.html',
  middleware: [
    (req: Request, res, next) => {
      // To generate on demand, use:
      // localhost:3033/generate-file?generate-file=foobar.liquid
      if (req.url.includes('generate-file')) {
        res.setHeader('Content-Type', 'text/html');
        const sp = new URLSearchParams(req.url.split('?')[1] || '');
        const file = sp.get('generate-file');
        if (!file) {
          res.writeHead(400);
          res.end('File not specified');
          return;
        }

        generatePDF(`${file}`)
        .then(() => {
          res.writeHead(200);
          res.end('PDF generated successfully');
        })
        .catch((err) => {
          console.error('Error generating PDF:', err);
          res.writeHead(500);
          res.end('Error generating PDF: ' + err.message);
        });

        return;
      }

      next();
    },
  ],
});
