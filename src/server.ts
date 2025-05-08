import fs from 'fs';
import { generatePDF } from './index';
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

liveServer.start({
  port,
  root: './public',
  host: '0.0.0.0',
  open: false,
  mount: [['./dist', '/dist']],
  ignore: './dist/*.html',
});
