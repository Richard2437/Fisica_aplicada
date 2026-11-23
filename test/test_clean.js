export function cleanLaTeX(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    // Grados
    .replace(/\^\\circ\b/g, '°')
    .replace(/\^\{\\circ\}/g, '°')
    .replace(/\^o\b/g, '°')
    // Comandos de texto de unidades y variables
    .replace(/\\text\s*\{\s*([^{}]+?)\s*\}/g, '$1')
    .replace(/\\mathrm\s*\{\s*([^{}]+?)\s*\}/g, '$1')
    .replace(/\\textbf\s*\{\s*([^{}]+?)\s*\}/g, '$1')
    .replace(/\\textit\s*\{\s*([^{}]+?)\s*\}/g, '$1')
    // Letras griegas
    .replace(/\\theta/g, 'θ')
    .replace(/\\mu/g, 'μ')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\gamma/g, 'γ')
    .replace(/\\Sigma/g, 'Σ')
    // Operadores
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\approx/g, '≈')
    .replace(/\\leq?/g, '≤')
    .replace(/\\geq?/g, '≥')
    .replace(/\\pm/g, '±')
    // Fracciones \frac{a}{b} -> a/b
    .replace(/\\frac\s*\{\s*([^{}]+?)\s*\}\s*\{\s*([^{}]+?)\s*\}/g, '$1/$2')
    // Potencias comunes m/s^2 -> m/s²
    .replace(/\^2\b/g, '²')
    .replace(/\^3\b/g, '³')
    // Eliminar delimitadores de fórmula matemática $ y $$
    .replace(/\$+/g, '')
    // Eliminar barras invertidas residuales antes de palabras
    .replace(/\\([a-zA-Z]+)/g, '$1')
    // Normalizar espacios múltiples
    .replace(/[ \t]+/g, ' ')
    .trim();
}

const input = 'posición horizontal mediante un cable tensor sujeto a un punto $B$ de la viga, situado a $3.0\\text{ m}$ de $A$. El cable forma un ángulo de $37^\\circ$ por encima de la horizontal con la viga. Además, en el extremo libre derecho de la viga (a $4.0\\text{ m}$ de $A$) cuelga una caja de $1000\\text{ N}$.';

console.log('--- ENTRADA CON LATEX ---');
console.log(input);
console.log('\n--- SALIDA LIMPIA Y NORMAL ---');
console.log(cleanLaTeX(input));
