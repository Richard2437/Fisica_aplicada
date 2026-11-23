/**
 * Script de Verificación y Pruebas Unitarias
 * Valida la extracción de datos y los cálculos físicos de dinámica
 */

import { ProblemParser } from '../js/parser.js';
import { DynamicsEngine } from '../js/physics.js';

console.log('--- INICIANDO SUITE DE PRUEBAS ---');

// Caso 1: Problema del Camión en pendiente (Propuesta Lasallista)
const problem1 = 'Un camión de 1200 kg asciende por una pendiente inclinada 15° con una velocidad constante de 72 km/h. Si la fuerza de resistencia al movimiento (fricción y arrastre del aire) es de 450 N, determine la fuerza de tracción necesaria y la potencia en HP.';
console.log('\n[Prueba 1] Parsing del problema del camión:');
const parsed1 = ProblemParser.parse(problem1);
console.log('Masa detectada:', parsed1.mass);
console.log('Ángulo detectado:', parsed1.angle);
console.log('Velocidad detectada:', parsed1.velocity);
console.log('Fricción / Resistencia detectada:', parsed1.frictionForce);
console.log('Dirección:', parsed1.direction);

console.log('\n[Prueba 2] Solución física del caso 1:');
const solution1 = DynamicsEngine.solve({
  mass: parsed1.mass,
  angle: parsed1.angle,
  velocity: parsed1.velocity,
  acceleration: parsed1.acceleration,
  frictionType: parsed1.frictionType,
  frictionForce: parsed1.frictionForce,
  direction: parsed1.direction,
  gravity: 9.8
});

console.log('Resultados numéricos:');
console.log('- Peso W:', solution1.results.W, 'N');
console.log('- Wx:', solution1.results.Wx, 'N');
console.log('- Wy:', solution1.results.Wy, 'N');
console.log('- Normal N:', solution1.results.N, 'N');
console.log('- Fricción fr:', solution1.results.fr, 'N');
console.log('- Fuerza de Tracción Ft:', solution1.results.Ft, 'N');
console.log('- Potencia en Watts:', solution1.results.powerWatts, 'W');
console.log('- Potencia en kW:', solution1.results.powerKW, 'kW');
console.log('- Potencia en HP:', solution1.results.powerHP, 'HP');

// Aserciones
if (Math.abs(solution1.results.W - 11760) < 0.1) {
  console.log('✔ Peso W = 11760 N correcto');
} else {
  console.error('❌ Error en Peso W');
}

if (Math.abs(solution1.results.Ft - 3493.71) < 1.0) {
  console.log('✔ Fuerza de tracción Ft ≈ 3493.71 N correcta');
} else {
  console.error('❌ Error en Ft:', solution1.results.Ft);
}

if (Math.abs(solution1.results.powerHP - 93.7) < 0.5) {
  console.log('✔ Potencia ≈ 93.7 HP correcta');
} else {
  console.error('❌ Error en Potencia HP:', solution1.results.powerHP);
}

console.log('\n--- PRUEBAS COMPLETADAS CON ÉXITO ---');
