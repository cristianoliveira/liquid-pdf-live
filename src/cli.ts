#!/usr/bin/env node

import { generatePDF } from './index';

const filePath = process.argv[2];

if (!filePath) {
  console.error('Please provide a file path');
  console.error('Usage: node cli.js <file-path>');
  process.exit(1);
}

if (require.main === module) {
  generatePDF(filePath).catch(console.error);
}
