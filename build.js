/**
 * Script de empaquetado para compatibilidad universal (file:// y http://)
 * Genera js/bundle.js para que funcione tanto al hacer doble clic local como en servidor web.
 */

import fs from 'node:fs';
import path from 'node:path';

const parserSrc = fs.readFileSync('js/parser.js', 'utf8')
  .replace('export const ProblemParser =', 'const ProblemParser =');

const physicsSrc = fs.readFileSync('js/physics.js', 'utf8')
  .replace('export const DynamicsEngine =', 'const DynamicsEngine =');

const canvasSrc = fs.readFileSync('js/canvas.js', 'utf8')
  .replace('export class DCLCanvas', 'class DCLCanvas');

const rendererSrc = fs.readFileSync('js/renderer.js', 'utf8')
  .replace('export const StepRenderer =', 'const StepRenderer =');

const appSrc = fs.readFileSync('js/app.js', 'utf8')
  .replace(/import\s+.*?\s+from\s+['"].*?['"];?\n/g, '');

const bundleContent = `/**
 * Bundle Universal Autocontenido - Dinámica Newtoniana y DCL
 * Estudiante: Ricardo Jaraba Gallego
 */
(function() {
  'use strict';

  ${parserSrc}

  ${physicsSrc}

  ${canvasSrc}

  ${rendererSrc}

  ${appSrc}
})();
`;

fs.writeFileSync('js/bundle.js', bundleContent, 'utf8');
console.log('✔ js/bundle.js generado exitosamente (Tamaño:', bundleContent.length, 'bytes)');
