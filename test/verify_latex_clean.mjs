import { ProblemParser } from '../js/parser.js';

const raw = 'posición horizontal mediante un cable tensor sujeto a un punto $B$ de la viga, situado a $3.0\\text{ m}$ de $A$. El cable forma un ángulo de $37^\\circ$ por encima de la horizontal con la viga. Además, en el extremo libre derecho de la viga (a $4.0\\text{ m}$ de $A$) cuelga una caja de $1000\\text{ N}$.';

console.log('--- TEXTO ORIGINAL ---');
console.log(raw);

const parsed = ProblemParser.parse(raw);
console.log('\n--- TEXTO NORMALIZADO ---');
console.log(parsed.normalizedText);

console.log('\n--- DATOS EXTRAÍDOS ---');
console.log('Matches:', parsed.matchesFound);
console.log('Ángulo:', parsed.angle);
console.log('Fricción / Fuerza resistiva:', parsed.frictionForce);
