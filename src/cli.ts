#!/usr/bin/env node

import { generatePDF } from './index';

if (require.main === module) {
  generatePDF().catch(console.error);
}
