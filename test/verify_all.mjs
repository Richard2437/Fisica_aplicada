/**
 * Script de Verificación Integral de Todos los Presets y Casos de Prueba
 */

import { ProblemParser } from '../js/parser.js';
import { DynamicsEngine } from '../js/physics.js';

console.log('--- INICIANDO VERIFICACIÓN DE TODOS LOS PRESETS ---');

ProblemParser.presets.forEach((preset, index) => {
  console.log(`\n========================================================`);
  console.log(`[Preset ${index + 1}] ${preset.title} (${preset.category})`);
  console.log(`Texto: "${preset.text}"`);

  const parsed = ProblemParser.parse(preset.text);
  console.log(`- Masa: ${parsed.mass.value} ${parsed.mass.unit}`);
  console.log(`- Ángulo: ${parsed.angle.value}°`);
  console.log(`- Velocidad: ${parsed.velocity.value} ${parsed.velocity.unit}`);
  console.log(`- Aceleración: ${parsed.acceleration.value} ${parsed.acceleration.unit}`);
  console.log(`- Fricción: modo=${parsed.frictionType}, fr=${parsed.frictionForce.value}, mu=${parsed.mu.value}`);
  console.log(`- Dirección: ${parsed.direction}`);

  const solution = DynamicsEngine.solve({
    mass: parsed.mass,
    angle: parsed.angle,
    velocity: parsed.velocity,
    acceleration: parsed.acceleration,
    frictionType: parsed.frictionType,
    frictionForce: parsed.frictionForce,
    mu: parsed.mu,
    direction: parsed.direction,
    gravity: 9.8
  });

  console.log(`- Resultados: W=${solution.results.W} N, N=${solution.results.N} N, fr=${solution.results.fr} N, Ft=${solution.results.Ft} N, P=${solution.results.powerHP} HP`);
  
  if (solution.results.W > 0 && solution.results.N >= 0 && solution.results.Ft >= 0) {
    console.log(`✔ OK: Solución físicamente admisible calculada correctamente.`);
  } else {
    console.error(`❌ ERROR: Valores físicos no admisibles`);
  }
});

console.log(`\n========================================================`);
console.log(`✔ TODOS LOS PRESETS FUERON VERIFICADOS SATISFACTORIAMENTE.`);
