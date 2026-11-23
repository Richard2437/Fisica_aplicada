/**
 * Bundle Universal Autocontenido - Dinámica Newtoniana y DCL
 * Estudiante: Ricardo Jaraba Gallego
 */
(function() {
  'use strict';

  /**
 * Módulo de Extracción de Datos y Procesamiento de Lenguaje Natural (NLP / RegEx)
 * Proyecto de Aula - Física Mecánica
 * Autor: Ricardo Jaraba Gallego
 */

const ProblemParser = {
  /**
   * Colección de problemas de ejemplo clásicos de Física Mecánica
   */
  presets: [
    {
      id: 'camion-pendiente-potencia',
      title: 'Camión en pendiente con resistencia (Cálculo de Potencia en HP)',
      category: 'Equilibrio Dinámico & Potencia',
      description: 'Problema clásico de dinámica y potencia mecánica.',
      text: 'Un camión de 1200 kg asciende por una pendiente inclinada 15° con una velocidad constante de 72 km/h. Si la fuerza de resistencia al movimiento (fricción y arrastre del aire) es de 450 N, determine la fuerza de tracción necesaria que debe ejercer el motor y la potencia mecánica desarrollada expresada en Watts, kilovatios (kW) y caballos de potencia (HP).'
    },
    {
      id: 'bloque-acelerado-friccion',
      title: 'Bloque acelerado hacia arriba con fricción dinámica',
      category: 'Segunda Ley de Newton (a ≠ 0)',
      description: 'Determinación de la fuerza motriz para generar aceleración.',
      text: 'Un bloque de masa m = 85 kg se encuentra sobre una rampa inclinada 28 grados respecto a la horizontal. Se le aplica una fuerza de tracción paralela a la rampa hacia arriba, logrando una aceleración constante de 1.8 m/s². El coeficiente de rozamiento dinámico entre el bloque y la superficie es μ = 0.22. Calcule la fuerza normal, la fuerza de fricción y la fuerza de tracción aplicada.'
    },
    {
      id: 'caja-descenso-velocidad-cte',
      title: 'Caja descendiendo por una rampa a velocidad constante',
      category: 'Equilibrio en Descenso',
      description: 'Cuerpo en movimiento descendente uniforme.',
      text: 'Una caja pesada de 150 kg desciende por un plano inclinado de 20° a velocidad uniforme de 5 m/s. Si el coeficiente de fricción cinética entre la caja y el plano es 0.35, determine la magnitud de la fuerza normal, la fuerza de rozamiento y la fuerza de retención o tracción necesaria para mantener dicha velocidad constante.'
    },
    {
      id: 'objeto-plano-horizontal',
      title: 'Objeto arrastrado en superficie horizontal con fricción',
      category: 'Plano Horizontal (θ = 0°)',
      description: 'Caso canónico de arrastre horizontal.',
      text: 'Un contenedor de 250 kg es arrastrado sobre un piso horizontal a una velocidad constante de 12 m/s. El coeficiente de fricción cinética entre el contenedor y el piso es de 0.28. Determine la fuerza normal ejercida por el suelo, la fuerza de fricción opuesta y la potencia mecánica requerida para moverlo en kW y HP.'
    },
    {
      id: 'automovil-pendiente-porcentual',
      title: 'Automóvil subiendo una cuesta con pendiente porcentual',
      category: 'Conversión de Pendiente (%)',
      description: 'Conversión de pendiente porcentual a grados trigonométricos.',
      text: 'Un automóvil de 1400 kg sube por una carretera con una pendiente del 12% a una velocidad constante de 90 km/h. La fuerza de resistencia por fricción y rozamiento con el aire es de 600 N. Calcule el ángulo de inclinación, la fuerza de tracción del motor y la potencia mecánica en caballos de vapor (HP).'
    },
    {
      id: 'bloque-liso-sin-friccion',
      title: 'Bloque en rampa ideal sin rozamiento',
      category: 'Superficie Lisa Ideal (μ = 0)',
      description: 'Análisis teórico del efecto puro de la componente del peso.',
      text: 'Un bloque de 40 kg asciende por una rampa inclinada 35° sobre una superficie lisa sin fricción a velocidad constante de 8 m/s mediante una fuerza paralela al plano. Determine la fuerza normal, la fuerza motriz necesaria y la potencia mecánica.'
    }
  ],

  /**
   * Limpia y normaliza texto proveniente de fuentes LaTeX o procesadores matemáticos
   * Convierte expresiones como $37^\circ$, $1000\text{ N}$, $3.0\text{ m}$ a texto legible normal
   */
  cleanLaTeX(text) {
    if (!text || typeof text !== 'string') return '';
    return text
      // Grados: $37^\circ$, 37^\circ, 37^{\circ}, 37^o
      .replace(/(\d+(?:[.,]\d+)?)\s*(?:\^\\circ|\^\{\\circ\}|\^o)/g, '$1°')
      .replace(/\^\\circ\b/g, '°')
      .replace(/\^\{\\circ\}/g, '°')
      .replace(/\^o\b/g, '°')
      // \text{ m}, \mathrm{kg}, etc., asegurando espacio con el número
      .replace(/(\d+(?:[.,]\d+)?)\s*\\(?:text|mathrm|textbf|textit)\s*\{\s*([^{}]+?)\s*\}/g, '$1 $2')
      .replace(/\\(?:text|mathrm|textbf|textit)\s*\{\s*([^{}]+?)\s*\}/g, '$1')
      // Letras griegas
      .replace(/\\theta/g, 'θ')
      .replace(/\\mu/g, 'μ')
      .replace(/\\alpha/g, 'α')
      .replace(/\\beta/g, 'β')
      .replace(/\\gamma/g, 'γ')
      .replace(/\\Sigma/g, 'Σ')
      // Operadores matemáticos
      .replace(/\\times/g, '×')
      .replace(/\\cdot/g, '·')
      .replace(/\\approx/g, '≈')
      .replace(/\\leq?/g, '≤')
      .replace(/\\geq?/g, '≥')
      .replace(/\\pm/g, '±')
      // Fracciones \frac{a}{b} -> a/b
      .replace(/\\frac\s*\{\s*([^{}]+?)\s*\}\s*\{\s*([^{}]+?)\s*\}/g, '$1/$2')
      // Potencias
      .replace(/\^2\b/g, '²')
      .replace(/\^3\b/g, '³')
      // Delimitadores de ecuación $ y $$
      .replace(/\$+/g, '')
      // Barras invertidas antes de letras residuales
      .replace(/\\([a-zA-Z]+)/g, '$1')
      // Espacios múltiples a un solo espacio
      .replace(/[ \t]+/g, ' ')
      .trim();
  },

  /**
   * Analiza el enunciado de texto libre y extrae los parámetros físicos
   * @param {string} text - Enunciado del problema
   * @returns {Object} Datos extraídos con valores numéricos, unidades originales y conversiones al SI
   */
  parse(text) {
    if (!text || typeof text !== 'string') {
      return this.getDefaults();
    }

    // Normalizar primero cualquier código LaTeX pegado
    const normalizedText = this.cleanLaTeX(text);
    const cleanText = normalizedText.trim();
    const lower = cleanText.toLowerCase();

    // Estructura de resultados
    const data = {
      rawText: cleanText,
      normalizedText: normalizedText,
      mass: { value: 100, unit: 'kg', raw: null, converted: 100 },
      angle: { value: 0, unit: 'deg', raw: null, converted: 0, isPercentage: false },
      velocity: { value: 10, unit: 'm/s', raw: null, converted: 10, isConstant: true },
      acceleration: { value: 0, unit: 'm/s²', raw: null, converted: 0 },
      frictionType: 'mu', // 'mu' o 'force'
      mu: { value: 0.2, raw: null },
      frictionForce: { value: null, unit: 'N', raw: null },
      appliedForce: { value: null, unit: 'N', raw: null },
      direction: 'up', // 'up', 'down', 'horizontal'
      target: 'Ft',
      gravity: 9.8,
      matchesFound: []
    };

    // 1. Detección de Masa (kg, g, ton, lb)
    const massRegex = /(?:masa(?:\s+de)?|objeto(?:\s+de)?|bloque(?:\s+de)?|camión(?:\s+de)?|coche(?:\s+de)?|automóvil(?:\s+de)?|caja(?:\s+de)?|contenedor(?:\s+de)?|m\s*=)\s*(\d+(?:[.,]\d+)?)\s*(kg|kilos?|kilogramos?|g|gramos?|ton(?:eladas?)?|lb|libras?)\b/i;
    const directMassRegex = /(\d+(?:[.,]\d+)?)\s*(kg|kilos?|kilogramos?|ton(?:eladas?)?|lb|libras?)\b/i;
    
    let match = lower.match(massRegex) || lower.match(directMassRegex);
    if (match) {
      const num = parseFloat(match[1].replace(',', '.'));
      const unit = match[2].toLowerCase();
      data.mass.raw = match[0];
      data.mass.originalValue = num;
      data.mass.originalUnit = unit;

      if (unit.startsWith('kg') || unit.startsWith('kilo')) {
        data.mass.converted = num;
        data.mass.unit = 'kg';
      } else if (unit.startsWith('g') && !unit.startsWith('kg')) {
        data.mass.converted = num / 1000;
        data.mass.unit = 'kg';
      } else if (unit.startsWith('ton')) {
        data.mass.converted = num * 1000;
        data.mass.unit = 'kg';
      } else if (unit.startsWith('lb') || unit.startsWith('libra')) {
        data.mass.converted = +(num * 0.453592).toFixed(2);
        data.mass.unit = 'kg';
      }
      data.mass.value = data.mass.converted;
      data.matchesFound.push({ type: 'Masa', text: match[0], value: `${data.mass.value} kg` });
    } else {
      // Detección de Peso en Newtons como Masa equivalente (W = m·g => m = W / 9.8)
      const weightRegex = /(?:peso(?:\s+de)?|caja(?:\s+de)?|carga(?:\s+de)?)\s*(\d+(?:[.,]\d+)?)\s*(?:N|newtons?)\b/i;
      const wMatch = lower.match(weightRegex);
      if (wMatch) {
        const wVal = parseFloat(wMatch[1].replace(',', '.'));
        const equivMass = +(wVal / 9.8).toFixed(2);
        data.mass.raw = `${wMatch[0]} (W = ${wVal} N)`;
        data.mass.originalValue = wVal;
        data.mass.originalUnit = 'N';
        data.mass.converted = equivMass;
        data.mass.value = equivMass;
        data.mass.unit = 'kg';
        data.matchesFound.push({ type: 'Masa (derivada de Peso W)', text: wMatch[0], value: `${equivMass} kg (de ${wVal} N)` });
      }
    }

    // 2. Detección de Ángulo o Inclinación (Prioridad a grados explícitos, luego %, luego horizontal)
    const percentRegex = /(?:pendiente|cuesta|inclinaci[oó]n)(?:\s+del?)?\s*(\d+(?:[.,]\d+)?)\s*%/i;
    const angleExplicitRegex = /(?:pendiente(?:\s+inclinada)?|inclinad[oa]|ángulo(?:\s+de)?|rampa(?:\s+inclinada)?|cuesta(?:\s+de)?|θ\s*=|theta\s*=)?\s*(\d+(?:[.,]\d+)?)\s*(?:°|º|\bgrados?\b)/i;
    
    const explicitAngleMatch = lower.match(angleExplicitRegex);
    const percentMatch = lower.match(percentRegex);

    if (explicitAngleMatch) {
      const num = parseFloat(explicitAngleMatch[1].replace(',', '.'));
      data.angle.value = num;
      data.angle.converted = num;
      data.angle.raw = explicitAngleMatch[0];
      data.matchesFound.push({ type: 'Ángulo de Inclinación', text: explicitAngleMatch[0], value: `${num}°` });
    } else if (percentMatch) {
      const pct = parseFloat(percentMatch[1].replace(',', '.'));
      const deg = +(Math.atan(pct / 100) * (180 / Math.PI)).toFixed(2);
      data.angle.value = deg;
      data.angle.converted = deg;
      data.angle.raw = percentMatch[0];
      data.angle.isPercentage = true;
      data.angle.percentageValue = pct;
      data.matchesFound.push({ type: 'Ángulo (pendiente %)', text: percentMatch[0], value: `${deg}° (de ${pct}%)` });
    } else if (lower.includes('plano horizontal') || lower.includes('piso horizontal') || lower.includes('superficie horizontal')) {
      data.angle.value = 0;
      data.angle.converted = 0;
      data.angle.raw = 'horizontal (0°)';
      data.direction = 'horizontal';
      data.matchesFound.push({ type: 'Ángulo', text: 'horizontal', value: '0°' });
    }

    // 3. Detección de Sentido del Movimiento
    if (lower.includes('asciende') || lower.includes('sube') || lower.includes('hacia arriba') || lower.includes('remolcado hacia arriba') || lower.includes('tirado hacia arriba')) {
      data.direction = 'up';
    } else if (lower.includes('desciende') || lower.includes('baja') || lower.includes('hacia abajo') || lower.includes('cae') || lower.includes('deslizándose hacia abajo')) {
      data.direction = 'down';
    } else if (data.angle.value === 0) {
      data.direction = 'horizontal';
    }

    // 4. Detección de Aceleración PRIMERO (para evitar colisión con m/s)
    const accelRegex = /(?:aceleraci[oó]n(?:\s+constante)?(?:\s+de)?|a\s*=)\s*(\d+(?:[.,]\d+)?)\s*(m\/s[²2]|m\/s\^2)(?!\w)/i;
    const accelMatch = lower.match(accelRegex);
    if (accelMatch) {
      const num = parseFloat(accelMatch[1].replace(',', '.'));
      data.acceleration.value = num;
      data.acceleration.converted = num;
      data.acceleration.raw = accelMatch[0];
      data.velocity.isConstant = false;
      data.matchesFound.push({ type: 'Aceleración', text: accelMatch[0], value: `${num} m/s²` });
    } else if (lower.includes('velocidad constante') || lower.includes('velocidad uniforme') || lower.includes('rapidez constante') || lower.includes('equilibrio')) {
      data.velocity.isConstant = true;
      data.acceleration.value = 0;
      data.acceleration.converted = 0;
      data.acceleration.raw = 'velocidad constante (a = 0)';
    }

    // 5. Detección de Velocidad (m/s que NO sea m/s², o km/h)
    const velRegex = /(?:velocidad(?:\s+constante|\s+uniforme)?(?:\s+de)?|rapidez(?:\s+de)?|v\s*=)\s*(\d+(?:[.,]\d+)?)\s*(m\/s(?![²2\^])|km\/h|kph)\b/i;
    const directVelRegex = /(\d+(?:[.,]\d+)?)\s*(m\/s(?![²2\^])|km\/h|kph)\b/i;
    const velMatch = lower.match(velRegex) || lower.match(directVelRegex);

    if (velMatch) {
      const num = parseFloat(velMatch[1].replace(',', '.'));
      const unit = velMatch[2].toLowerCase();
      data.velocity.raw = velMatch[0];
      data.velocity.originalValue = num;
      data.velocity.originalUnit = unit;

      if (unit === 'km/h' || unit === 'kph') {
        data.velocity.converted = +(num / 3.6).toFixed(3);
        data.velocity.unit = 'm/s';
      } else {
        data.velocity.converted = num;
        data.velocity.unit = 'm/s';
      }
      data.velocity.value = data.velocity.converted;
      data.matchesFound.push({ type: 'Velocidad', text: velMatch[0], value: `${data.velocity.value} m/s (orig: ${num} ${unit})` });
    }

    // 6. Detección de Fricción (Sin fricción vs Fuerza N vs Coeficiente μ)
    if (lower.includes('sin fricci[oó]n') || lower.includes('superficie lisa') || lower.includes('fricci[oó]n despreciable') || lower.includes('sin rozamiento')) {
      data.frictionType = 'mu';
      data.mu.value = 0;
      data.mu.raw = 'superficie lisa (μ = 0)';
      data.matchesFound.push({ type: 'Rozamiento', text: 'sin fricción', value: 'μ = 0' });
    } else {
      // Fuerza directa de resistencia o fricción en Newtons
      const resForceRegex = /(?:fuerza\s+de\s+resistencia|resistencia(?:\s+al\s+movimiento)?|arrastre|fuerza\s+de\s+fricci[oó]n|fuerza\s+de\s+rozamiento|f_?r)[\s\S]{0,60}?(?:es\s+de\s*|de\s*|=\s*)?(\d+(?:[.,]\d+)?)\s*(N|newtons?|kn)\b/i;
      const resMatch = lower.match(resForceRegex);
      if (resMatch) {
        let fVal = parseFloat(resMatch[1].replace(',', '.'));
        const fUnit = resMatch[2].toLowerCase();
        if (fUnit === 'kn') fVal *= 1000;
        data.frictionType = 'force';
        data.frictionForce.value = fVal;
        data.frictionForce.raw = resMatch[0];
        data.matchesFound.push({ type: 'Fuerza de Resistencia / Fricción', text: resMatch[0], value: `${fVal} N` });
      } else {
        // Coeficiente de fricción / rozamiento μ
        const muRegex = /(?:coeficiente\s+de\s+(?:fricci[oó]n|rozamiento)[\s\S]{0,50}?|μ_?[kc]?\s*=|mu\s*=)\s*(?:es\s+de\s*|de\s*|=\s*)?(\d+(?:[.,]\d+)?)\b/i;
        const muMatch = lower.match(muRegex);
        if (muMatch) {
          const muVal = parseFloat(muMatch[1].replace(',', '.'));
          data.frictionType = 'mu';
          data.mu.value = muVal;
          data.mu.raw = muMatch[0];
          data.matchesFound.push({ type: 'Coeficiente de Fricción (μ)', text: muMatch[0], value: `${muVal}` });
        }
      }
    }

    // 7. Detección de Objetivos / Incógnitas solicitadas
    if (lower.includes('potencia') || lower.includes('hp') || lower.includes('caballos')) {
      data.target = 'P';
    } else if (lower.includes('aceleraci') && !accelMatch) {
      data.target = 'a';
    } else if (lower.includes('fuerza de tracci') || lower.includes('fuerza necesaria') || lower.includes('fuerza aplicada')) {
      data.target = 'Ft';
    }

    return data;
  },

  /**
   * Valores predeterminados seguros para el modelo
   */
  getDefaults() {
    return {
      rawText: '',
      mass: { value: 100, unit: 'kg', raw: null, converted: 100 },
      angle: { value: 20, unit: 'deg', raw: null, converted: 20, isPercentage: false },
      velocity: { value: 15, unit: 'm/s', raw: null, converted: 15, isConstant: true },
      acceleration: { value: 0, unit: 'm/s²', raw: null, converted: 0 },
      frictionType: 'mu',
      mu: { value: 0.2, raw: null },
      frictionForce: { value: null, unit: 'N', raw: null },
      appliedForce: { value: null, unit: 'N', raw: null },
      direction: 'up',
      target: 'Ft',
      gravity: 9.8,
      matchesFound: []
    };
  }
};


  /**
 * Motor de Dinámica y Física Newtoniana (DynamicsEngine)
 * Proyecto de Aula - Física Mecánica
 * Autor: Ricardo Jaraba Gallego
 */

const DynamicsEngine = {
  /**
   * Resuelve el modelo físico y calcula todas las magnitudes vectoriales y escalares
   * @param {Object} input - Datos validados de entrada
   * @returns {Object} Solución completa con variables intermedias y paso a paso
   */
  solve(input) {
    const g = input.gravity || 9.8; // m/s²
    const m = Math.max(0.001, Number(input.mass?.value ?? 100)); // kg
    const thetaDeg = Math.max(0, Math.min(89.9, Number(input.angle?.value ?? 0))); // grados
    const thetaRad = (thetaDeg * Math.PI) / 180;
    const v = Math.max(0, Number(input.velocity?.value ?? 0)); // m/s
    const a = Number(input.acceleration?.value ?? 0); // m/s²
    const direction = input.direction || (thetaDeg === 0 ? 'horizontal' : 'up');

    // 1. Cálculo del Peso total
    const W = m * g; // Newtons

    // 2. Descomposición del Peso en ejes rotados (X' paralelo, Y' perpendicular)
    const sinTheta = Math.sin(thetaRad);
    const cosTheta = Math.cos(thetaRad);
    const Wx = W * sinTheta; // N (a lo largo del plano)
    const Wy = W * cosTheta; // N (perpendicular al plano)

    // 3. Ecuación de Equilibrio en el Eje Y' (perpendicular)
    // ΣFy = m * ay = 0 (No hay movimiento ni despegue en la dirección normal)
    // N - Wy = 0  =>  N = Wy = m * g * cos(θ)
    const N = Wy;

    // 4. Determinación de la Fuerza de Rozamiento (fr)
    let fr = 0;
    let mu = 0;
    let frictionMode = input.frictionType || 'mu';

    if (frictionMode === 'force' && input.frictionForce?.value !== null && input.frictionForce?.value !== undefined) {
      fr = Math.max(0, Number(input.frictionForce.value));
      mu = N > 0 ? fr / N : 0;
    } else {
      mu = Math.max(0, Number(input.mu?.value ?? 0));
      fr = mu * N;
    }

    // 5. Ecuación de Movimiento en el Eje X' (paralelo al plano)
    // Convención de Signos y Equilibrio:
    // Para movimiento ascendente (up):
    // ΣFx = m * a
    // Ft - fr - Wx = m * a   =>   Ft = fr + Wx + m * a
    //
    // Para movimiento horizontal (θ = 0):
    // Wx = 0, Wy = W, N = W
    // Ft - fr = m * a   =>   Ft = fr + m * a
    //
    // Para movimiento descendente (down):
    // El peso favorece el descenso (Wx hacia abajo).
    // fr se opone (hacia arriba).
    // Si desciende a velocidad constante: ΣFx = 0 => Wx - fr - F_freno = 0
    let Ft = 0;
    let netForceX = 0;
    let isBrakingNeeded = false;

    if (direction === 'up' || direction === 'horizontal') {
      // Fuerza motriz requerida para sostener el avance y la aceleración
      Ft = fr + Wx + m * a;
      netForceX = m * a;
    } else if (direction === 'down') {
      // Descenso
      // Eje X' positivo hacia abajo de la rampa:
      // ΣFx = Wx - fr + F_aplicada = m * a
      const naturalNetForce = Wx - fr;
      if (a === 0) {
        // Velocidad constante
        if (naturalNetForce > 0) {
          // El peso supera a la fricción: requiere fuerza de retención/freno hacia arriba
          Ft = naturalNetForce; // Magnitud de la fuerza de retención
          isBrakingNeeded = true;
        } else {
          // La fricción frena al objeto: requiere empuje hacia abajo
          Ft = fr - Wx;
          isBrakingNeeded = false;
        }
      } else {
        // Aceleración deseada
        // Wx - fr + Ft = m * a  =>  Ft = m * a - (Wx - fr)
        Ft = (m * a) - naturalNetForce;
        if (Ft < 0) {
          isBrakingNeeded = true;
          Ft = Math.abs(Ft);
        }
      }
    }

    // Asegurar valor no negativo para la magnitud motriz
    Ft = Math.max(0, Ft);

    // 6. Balance de Potencia Mecánica
    // P = Ft * v (producto escalar donde la fuerza motriz va en la dirección de la velocidad)
    const powerWatts = Ft * v;
    const powerKW = powerWatts / 1000;
    const powerHP = powerWatts / 745.7; // Factor de conversión estándar HP métrico/mecánico (1 HP ≈ 745.7 W)

    // 7. Aceleración natural sin tracción (en caso de análisis libre)
    const naturalAcceleration = direction === 'up' ? -(Wx + fr) / m : (Wx - fr) / m;

    return {
      inputs: {
        m,
        g,
        thetaDeg,
        thetaRad,
        sinTheta,
        cosTheta,
        v,
        a,
        mu,
        frictionMode,
        direction,
        isBrakingNeeded
      },
      results: {
        W: Number(W.toFixed(3)),
        Wx: Number(Wx.toFixed(3)),
        Wy: Number(Wy.toFixed(3)),
        N: Number(N.toFixed(3)),
        fr: Number(fr.toFixed(3)),
        Ft: Number(Ft.toFixed(3)),
        netForceX: Number(netForceX.toFixed(3)),
        powerWatts: Number(powerWatts.toFixed(2)),
        powerKW: Number(powerKW.toFixed(3)),
        powerHP: Number(powerHP.toFixed(3)),
        naturalAcceleration: Number(naturalAcceleration.toFixed(3))
      },
      vectors: {
        // Coordenadas locales para el DCL (origen en centro de masa)
        // Ejes X' (a lo largo de la rampa) e Y' (perpendicular a la rampa)
        normal: { name: 'N', magnitude: N, angleDeg: 90, color: '#10b981', label: 'Fuerza Normal (N)' },
        weight: { name: 'W', magnitude: W, angleDeg: 270 - thetaDeg, color: '#3b82f6', label: 'Peso (W = m·g)' },
        weightX: { name: 'Wx', magnitude: Wx, angleDeg: 180, color: '#6366f1', label: 'Componente Wx = m·g·sen(θ)' },
        weightY: { name: 'Wy', magnitude: Wy, angleDeg: 270, color: '#8b5cf6', label: 'Componente Wy = m·g·cos(θ)' },
        friction: {
          name: 'fr',
          magnitude: fr,
          angleDeg: direction === 'up' || direction === 'horizontal' ? 180 : 0,
          color: '#ef4444',
          label: 'Fuerza de Rozamiento (fr)'
        },
        traction: {
          name: isBrakingNeeded ? 'F_ret' : 'Ft',
          magnitude: Ft,
          angleDeg: isBrakingNeeded ? 180 : 0,
          color: '#f59e0b',
          label: isBrakingNeeded ? 'Fuerza de Retención (F_ret)' : 'Fuerza de Tracción (Ft)'
        }
      }
    };
  }
};


  /**
 * Motor de Renderizado Vectorial 2D (HTML5 Canvas)
 * Proyecto de Aula - Física Mecánica
 * Autor: Ricardo Jaraba Gallego
 */

class DCLCanvas {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    
    // Configuración y opciones de renderizado
    this.options = {
      viewMode: 'contextual', // 'contextual' (rampa + cuerpo) o 'dcl' (ejes aislados)
      showComponents: true,   // Descomposición Wx, Wy
      showValues: true,       // Valores numéricos en Newtons
      showAxes: true,         // Ejes X', Y'
      isAnimating: false,     // Animación de traslación
      animSpeed: 1.0
    };

    // Estado del modelo físico actual
    this.solution = null;

    // Estado de la animación
    this.animProgress = 0.5; // Posición normalizada a lo largo de la rampa (0 a 1)
    this.animDirection = 1;
    this.lastFrameTime = performance.now();
    this.animFrameId = null;

    this.initCanvas();
    window.addEventListener('resize', () => this.resize());
  }

  initCanvas() {
    this.resize();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Tamaño real en píxeles del display
    const width = rect.width || 600;
    const height = rect.height || 420;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.ctx.resetTransform?.();
    this.ctx.scale(dpr, dpr);
    this.displayWidth = width;
    this.displayHeight = height;

    this.render();
  }

  setSolution(solution) {
    this.solution = solution;
    this.render();
  }

  setOption(key, value) {
    this.options[key] = value;
    if (key === 'isAnimating') {
      if (value) {
        this.startAnimation();
      } else {
        this.stopAnimation();
      }
    }
    this.render();
  }

  startAnimation() {
    if (this.animFrameId) return;
    this.lastFrameTime = performance.now();
    const loop = (now) => {
      const dt = (now - this.lastFrameTime) / 1000;
      this.lastFrameTime = now;

      // Actualizar posición
      const v = this.solution?.inputs?.v || 10;
      const speedFactor = 0.15 * (v > 0 ? Math.min(2.0, Math.max(0.5, v / 15)) : 1.0);
      
      this.animProgress += speedFactor * dt;
      if (this.animProgress > 0.85) {
        this.animProgress = 0.15; // Reiniciar ciclo suave
      }

      this.render();
      if (this.options.isAnimating) {
        this.animFrameId = requestAnimationFrame(loop);
      }
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  stopAnimation() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  render() {
    const ctx = this.ctx;
    const w = this.displayWidth;
    const h = this.displayHeight;

    // Limpiar fondo
    ctx.clearRect(0, 0, w, h);

    if (!this.solution) {
      this.drawPlaceholder(ctx, w, h);
      return;
    }

    if (this.options.viewMode === 'dcl') {
      this.renderPureDCL(ctx, w, h);
    } else {
      this.renderContextualView(ctx, w, h);
    }
  }

  drawPlaceholder(ctx, w, h) {
    ctx.save();
    ctx.fillStyle = '#64748b';
    ctx.font = '16px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Ingrese un enunciado o seleccione un ejemplo para generar el DCL', w / 2, h / 2);
    ctx.restore();
  }

  /**
   * Vista 1: Rampa real con bloque inclinado y vectores en el centro de gravedad
   */
  renderContextualView(ctx, w, h) {
    const { thetaDeg, thetaRad, direction, isBrakingNeeded } = this.solution.inputs;
    const { N, W, Wx, Wy, fr, Ft } = this.solution.results;

    ctx.save();

    // 1. Coordenadas de la Rampa
    const margin = 50;
    const rampBaseY = h - margin - 20;
    const rampStartX = margin + 20;
    const rampLength = w - (margin * 2) - 40;
    const rampEndX = rampStartX + rampLength;
    
    // Altura según el ángulo theta (limitada para que quepa en pantalla)
    const maxRampH = h * 0.55;
    const rampH = Math.min(maxRampH, Math.tan(thetaRad) * rampLength);
    const rampTopX = rampEndX;
    const rampTopY = rampBaseY - rampH;

    // 2. Dibujar Plano Inclinado (Cuña triangular)
    ctx.beginPath();
    ctx.moveTo(rampStartX, rampBaseY);
    ctx.lineTo(rampTopX, rampTopY);
    ctx.lineTo(rampEndX, rampBaseY);
    ctx.closePath();

    // Gradiente de la rampa
    const rampGrad = ctx.createLinearGradient(rampStartX, rampTopY, rampEndX, rampBaseY);
    rampGrad.addColorStop(0, '#e2e8f0');
    rampGrad.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = rampGrad;
    ctx.fill();

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#475569';
    ctx.stroke();

    // Piso horizontal de referencia
    ctx.beginPath();
    ctx.moveTo(margin - 10, rampBaseY);
    ctx.lineTo(w - margin + 20, rampBaseY);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Arco de Ángulo Theta en la base
    if (thetaDeg > 1) {
      const arcRadius = Math.min(65, rampLength * 0.25);
      ctx.beginPath();
      ctx.arc(rampStartX, rampBaseY, arcRadius, -thetaRad, 0, false);
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Texto de θ
      ctx.fillStyle = '#0369a1';
      ctx.font = 'bold 14px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillText(`θ = ${thetaDeg.toFixed(1)}°`, rampStartX + arcRadius + 8, rampBaseY - 6);
    }

    // 4. Posición del Bloque en la Hipotenusa
    const t = this.options.isAnimating ? this.animProgress : 0.5;
    const blockX = rampStartX + (rampTopX - rampStartX) * t;
    const blockY = rampBaseY + (rampTopY - rampBaseY) * t;

    // Dimensiones del bloque
    const bw = 70;
    const bh = 48;

    // Transformación para dibujar el bloque y sus vectores
    ctx.save();
    ctx.translate(blockX, blockY);
    ctx.rotate(-thetaRad); // Rotación alineada con la pendiente de la rampa

    // Dibujar el bloque apoyado sobre la superficie
    const blockGrad = ctx.createLinearGradient(-bw / 2, -bh, bw / 2, 0);
    blockGrad.addColorStop(0, '#38bdf8');
    blockGrad.addColorStop(1, '#0284c7');
    ctx.fillStyle = blockGrad;
    ctx.strokeStyle = '#0369a1';
    ctx.lineWidth = 2;

    // Rectángulo del bloque
    ctx.beginPath();
    ctx.roundRect(-bw / 2, -bh, bw, bh, 6);
    ctx.fill();
    ctx.stroke();

    // Etiqueta de masa en el centro del bloque
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`m = ${this.solution.inputs.m} kg`, 0, -bh / 2);

    // Centro de Gravedad (CG) del bloque
    const cgX = 0;
    const cgY = -bh / 2;

    // 5. Dibujar Ejes Coordenados Rotados (X', Y')
    if (this.options.showAxes) {
      ctx.save();
      ctx.translate(cgX, cgY);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([5, 4]);

      // Eje X' (paralelo a la rampa)
      ctx.beginPath();
      ctx.moveTo(-110, 0);
      ctx.lineTo(130, 0);
      ctx.stroke();

      // Eje Y' (perpendicular a la rampa)
      ctx.beginPath();
      ctx.moveTo(0, 110);
      ctx.lineTo(0, -130);
      ctx.stroke();
      ctx.setLineDash([]);

      // Etiquetas de los ejes
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('+X\'', 135, 4);
      ctx.fillText('+Y\'', 4, -135);
      ctx.restore();
    }

    // 6. Indicador de Movimiento / Velocidad
    if (this.solution.inputs.v > 0) {
      this.drawVelocityIndicator(ctx, cgX, cgY - bh * 0.9, direction);
    }

    // 7. VECTORES DE FUERZA (En el sistema del bloque)
    // Escala para el tamaño de las flechas (normalizada con tope visual)
    const maxForce = Math.max(W, N, Ft, fr, 1);
    const scale = Math.min(130 / maxForce, 0.45);
    const minLen = 45;
    const getLen = (val) => Math.max(minLen, Math.min(145, val * scale));

    // Vector Normal N (Hacia +Y' local)
    const lenN = getLen(N);
    this.drawArrow(ctx, cgX, cgY, cgX, cgY - lenN, '#10b981', 'N', this.options.showValues ? `${N.toFixed(1)} N` : null, 'right');

    // Vector Fuerza de Tracción / Retención Ft
    if (Ft > 0) {
      const lenFt = getLen(Ft);
      const isUp = direction === 'up' || direction === 'horizontal';
      const dirFt = (isUp && !isBrakingNeeded) ? 1 : -1;
      const labelFt = isBrakingNeeded ? 'F_ret' : 'Ft';
      this.drawArrow(ctx, cgX, cgY, cgX + dirFt * lenFt, cgY, '#f59e0b', labelFt, this.options.showValues ? `${Ft.toFixed(1)} N` : null, 'top');
    }

    // Vector Fuerza de Rozamiento fr
    if (fr > 0) {
      const lenFr = getLen(fr);
      // La fricción siempre se opone al movimiento relativo
      const dirFr = (direction === 'up' || direction === 'horizontal') ? -1 : 1;
      this.drawArrow(ctx, cgX, cgY, cgX + dirFr * lenFr, cgY, '#ef4444', 'fr', this.options.showValues ? `${fr.toFixed(1)} N` : null, 'bottom');
    }

    // 8. Vector Peso W y sus Componentes Wx, Wy
    // Notar que en este sistema de coordenadas rotado (-thetaRad):
    // La vertical absoluta hacia abajo tiene un ángulo local de +(90° + theta) o respecto a -Y' es un giro de +theta
    const wLen = getLen(W);
    const wxLen = getLen(Wx);
    const wyLen = getLen(Wy);

    // Vector Peso W (vertical hacia abajo en el mundo real)
    // En coordenadas locales rotadas:
    const wLocalX = -wLen * Math.sin(thetaRad);
    const wLocalY = wLen * Math.cos(thetaRad);

    this.drawArrow(ctx, cgX, cgY, cgX + wLocalX, cgY + wLocalY, '#3b82f6', 'W', this.options.showValues ? `${W.toFixed(1)} N` : null, 'bottom');

    // Descomposición del Peso (si está activa)
    if (this.options.showComponents && thetaDeg > 0) {
      // Wy en dirección -Y' local (hacia el fondo de la superficie)
      this.drawDottedVector(ctx, cgX, cgY, cgX, cgY + wyLen, '#8b5cf6', 'Wy', this.options.showValues ? `${Wy.toFixed(1)} N` : null, 'left');

      // Wx en dirección -X' local (hacia abajo de la rampa)
      this.drawDottedVector(ctx, cgX, cgY, cgX - wxLen, cgY, '#6366f1', 'Wx', this.options.showValues ? `${Wx.toFixed(1)} N` : null, 'bottom');

      // Triángulo de cierre punteado (de Wy al extremo de W)
      ctx.save();
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1.3;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(cgX, cgY + wyLen);
      ctx.lineTo(cgX + wLocalX, cgY + wLocalY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cgX - wxLen, cgY);
      ctx.lineTo(cgX + wLocalX, cgY + wLocalY);
      ctx.stroke();
      ctx.restore();

      // Arco de ángulo θ entre el eje -Y' y el vector W
      ctx.save();
      ctx.beginPath();
      const arcR = 30;
      // -Y' es ángulo Math.PI / 2
      ctx.arc(cgX, cgY, arcR, Math.PI / 2, Math.PI / 2 + thetaRad, false);
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#8b5cf6';
      ctx.font = 'bold 11px system-ui';
      ctx.fillText('θ', cgX - 10, cgY + arcR + 10);
      ctx.restore();
    }

    // Punto del Centro de Gravedad
    ctx.beginPath();
    ctx.arc(cgX, cgY, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    ctx.restore(); // Fin del sistema del bloque

    ctx.restore();
  }

  /**
   * Vista 2: DCL Puro Aislado (Sistema Académico Centrado)
   */
  renderPureDCL(ctx, w, h) {
    const { thetaDeg, thetaRad, direction, isBrakingNeeded } = this.solution.inputs;
    const { N, W, Wx, Wy, fr, Ft } = this.solution.results;

    ctx.save();

    const originX = w / 2;
    const originY = h / 2 + 10;

    // Cuadrícula sutil de fondo
    this.drawSubtleGrid(ctx, w, h);

    // Ejes cartesianos principales rotados (X' horizontal en pantalla o rotados)
    // Para mayor claridad didáctica, mostramos el sistema con X' e Y'
    ctx.save();
    ctx.translate(originX, originY);

    // Ejes Coordenados
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    
    // Eje X'
    ctx.beginPath();
    ctx.moveTo(-w * 0.42, 0);
    ctx.lineTo(w * 0.42, 0);
    ctx.stroke();

    // Eje Y'
    ctx.beginPath();
    ctx.moveTo(0, -h * 0.42);
    ctx.lineTo(0, h * 0.42);
    ctx.stroke();

    // Flechas de los ejes
    this.drawAxisArrow(ctx, w * 0.42, 0, 0);
    this.drawAxisArrow(ctx, 0, -h * 0.42, -Math.PI / 2);

    // Nombres de los ejes
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('+X\' (Paralelo)', w * 0.42 - 90, -10);
    ctx.fillText('+Y\' (Normal)', 12, -h * 0.42 + 20);

    // Escala de fuerzas
    const maxForce = Math.max(W, N, Ft, fr, 1);
    const scale = Math.min((h * 0.35) / maxForce, 0.45);
    const minLen = 50;
    const getLen = (val) => Math.max(minLen, Math.min(h * 0.36, val * scale));

    // Vector Normal N (Hacia +Y')
    const lenN = getLen(N);
    this.drawArrow(ctx, 0, 0, 0, -lenN, '#10b981', 'N', this.options.showValues ? `${N.toFixed(1)} N` : null, 'right');

    // Vector Fuerza de Tracción / Motriz Ft
    if (Ft > 0) {
      const lenFt = getLen(Ft);
      const isUp = direction === 'up' || direction === 'horizontal';
      const dirFt = (isUp && !isBrakingNeeded) ? 1 : -1;
      const labelFt = isBrakingNeeded ? 'F_ret' : 'Ft';
      this.drawArrow(ctx, 0, 0, dirFt * lenFt, 0, '#f59e0b', labelFt, this.options.showValues ? `${Ft.toFixed(1)} N` : null, 'top');
    }

    // Vector Fuerza de Rozamiento fr
    if (fr > 0) {
      const lenFr = getLen(fr);
      const dirFr = (direction === 'up' || direction === 'horizontal') ? -1 : 1;
      this.drawArrow(ctx, 0, 0, dirFr * lenFr, 0, '#ef4444', 'fr', this.options.showValues ? `${fr.toFixed(1)} N` : null, 'bottom');
    }

    // Vector Peso W (inclinado respecto a -Y' por el ángulo theta)
    const lenW = getLen(W);
    const wxLen = getLen(Wx);
    const wyLen = getLen(Wy);

    // En ejes donde +X' es paralelo al plano y +Y' es normal:
    // El peso tiene componente -Wx (hacia la izquierda, -X') y -Wy (hacia abajo, -Y')
    const wPosX = -lenW * Math.sin(thetaRad);
    const wPosY = lenW * Math.cos(thetaRad);

    this.drawArrow(ctx, 0, 0, wPosX, wPosY, '#3b82f6', 'W', this.options.showValues ? `${W.toFixed(1)} N` : null, 'bottom');

    // Descomposición
    if (this.options.showComponents && thetaDeg > 0) {
      // Wy hacia abajo (-Y')
      this.drawDottedVector(ctx, 0, 0, 0, wyLen, '#8b5cf6', 'Wy = W·cos(θ)', this.options.showValues ? `${Wy.toFixed(1)} N` : null, 'left');
      
      // Wx hacia la izquierda (-X')
      this.drawDottedVector(ctx, 0, 0, -wxLen, 0, '#6366f1', 'Wx = W·sen(θ)', this.options.showValues ? `${Wx.toFixed(1)} N` : null, 'bottom');

      // Líneas de proyección
      ctx.save();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, wyLen);
      ctx.lineTo(wPosX, wPosY);
      ctx.lineTo(-wxLen, 0);
      ctx.stroke();
      ctx.restore();

      // Arco para ángulo theta
      ctx.beginPath();
      ctx.arc(0, 0, 38, Math.PI / 2, Math.PI / 2 + thetaRad, false);
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.fillStyle = '#8b5cf6';
      ctx.font = 'bold 12px system-ui';
      ctx.fillText(`θ = ${thetaDeg.toFixed(1)}°`, -18, 54);
    }

    // Punto central (Masa puntual del DCL)
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.restore();

    // Título de la vista
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 13px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText('DIAGRAMA DE CUERPO LIBRE (DCL) AISLADO - ORIGEN EN EL CENTRO DE MASA', 20, 30);

    ctx.restore();
  }

  drawSubtleGrid(ctx, w, h) {
    ctx.save();
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    const step = 25;
    for (let x = 0; x < w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawAxisArrow(ctx, x, y, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-10, -5);
    ctx.lineTo(-10, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawVelocityIndicator(ctx, x, y, direction) {
    ctx.save();
    ctx.translate(x, y);
    const dirSign = (direction === 'up' || direction === 'horizontal') ? 1 : -1;
    
    // Flecha de velocidad
    ctx.strokeStyle = '#0284c7';
    ctx.fillStyle = '#0284c7';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(-dirSign * 25, 0);
    ctx.lineTo(dirSign * 25, 0);
    ctx.stroke();

    // Cabeza de flecha
    ctx.beginPath();
    ctx.moveTo(dirSign * 25, 0);
    ctx.lineTo(dirSign * 17, -5);
    ctx.lineTo(dirSign * 17, 5);
    ctx.closePath();
    ctx.fill();

    // Texto
    ctx.font = 'bold 12px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`v = ${this.solution.inputs.v} m/s`, 0, -6);
    ctx.restore();
  }

  drawArrow(ctx, fromX, fromY, toX, toY, color, label, valueText, textPos = 'top') {
    const headLen = 12;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    const length = Math.hypot(dx, dy);

    if (length < 2) return;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3.2;
    ctx.lineCap = 'round';

    // Línea del vector
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    // Cabeza de flecha
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 7), toY - headLen * Math.sin(angle - Math.PI / 7));
    ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 7), toY - headLen * Math.sin(angle + Math.PI / 7));
    ctx.closePath();
    ctx.fill();

    // Etiqueta
    this.drawVectorLabel(ctx, toX, toY, angle, color, label, valueText, textPos);
    ctx.restore();
  }

  drawDottedVector(ctx, fromX, fromY, toX, toY, color, label, valueText, textPos = 'bottom') {
    const headLen = 10;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    const length = Math.hypot(dx, dy);

    if (length < 2) return;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2.2;
    ctx.setLineDash([4, 4]);

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Cabeza de flecha
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 7), toY - headLen * Math.sin(angle - Math.PI / 7));
    ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 7), toY - headLen * Math.sin(angle + Math.PI / 7));
    ctx.closePath();
    ctx.fill();

    this.drawVectorLabel(ctx, toX, toY, angle, color, label, valueText, textPos);
    ctx.restore();
  }

  drawVectorLabel(ctx, x, y, angle, color, label, valueText, textPos) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let offsetDist = 18;
    let lx = x + Math.cos(angle) * offsetDist;
    let ly = y + Math.sin(angle) * offsetDist;

    if (textPos === 'right') lx += 12;
    if (textPos === 'left') lx -= 12;
    if (textPos === 'top') ly -= 12;
    if (textPos === 'bottom') ly += 12;

    const fullText = valueText ? `${label} (${valueText})` : label;

    // Fondo blanco semitransparente para legibilidad
    const metrics = ctx.measureText(fullText);
    const padding = 3;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.fillRect(lx - metrics.width / 2 - padding, ly - 8 - padding, metrics.width + padding * 2, 16 + padding * 2);

    ctx.fillStyle = color;
    ctx.fillText(fullText, lx, ly);
    ctx.restore();
  }
}


  /**
 * Generador de Memoria de Cálculo y Análisis Paso a Paso
 * Metodología Académica de Física Mecánica
 * Autor: Ricardo Jaraba Gallego
 */

const StepRenderer = {
  /**
   * Renderiza una expresión matemática usando KaTeX si está disponible, o fallback HTML
   */
  renderMath(latex, isBlock = false) {
    if (window.katex) {
      try {
        return window.katex.renderToString(latex, {
          displayMode: isBlock,
          throwOnError: false
        });
      } catch (e) {
        console.error('KaTeX error:', e);
      }
    }
    // Fallback simple y limpio
    return `<code class="math-fallback">${latex}</code>`;
  },

  /**
   * Genera el HTML completo de la Memoria de Cálculo estructurada
   */
  generateSolutionHTML(parsedData, solution) {
    const { m, g, thetaDeg, thetaRad, v, a, mu, direction, isBrakingNeeded } = solution.inputs;
    const { W, Wx, Wy, N, fr, Ft, powerWatts, powerKW, powerHP } = solution.results;

    const isConstantVel = a === 0;

    return `
      <!-- Memoria de Cálculo Académica -->
      <article class="academic-report">
        
        <!-- Membrete Académico -->
        <header class="report-header">
          <div class="header-badges">
            <span class="badge badge-primary">Física Mecánica</span>
            <span class="badge badge-secondary">Dinámica Traslacional</span>
            <span class="badge badge-accent">Resolución Paso a Paso</span>
          </div>
          <h2 class="report-title">Memoria de Cálculo y Análisis Simbólico-Numérico</h2>
          <div class="report-metadata">
            <div><strong>Asignatura:</strong> Física Mecánica</div>
            <div><strong>Proyecto:</strong> Dinámica y Diagrama de Cuerpo Libre (DCL)</div>
            <div><strong>Estudiante:</strong> Ricardo Jaraba Gallego</div>
            <div><strong>Docente:</strong> Jeisson Javier Ortiz Arroyave</div>
          </div>
        </header>

        <!-- Cuadro de Resultados Destacados -->
        <section class="results-kpi-grid">
          <div class="kpi-card kpi-normal">
            <span class="kpi-label">Fuerza Normal (N)</span>
            <span class="kpi-value">${N.toFixed(2)} <small>N</small></span>
            <span class="kpi-sub">Eje perpendicular Y'</span>
          </div>
          <div class="kpi-card kpi-friction">
            <span class="kpi-label">Fuerza de Fricción (fr)</span>
            <span class="kpi-value">${fr.toFixed(2)} <small>N</small></span>
            <span class="kpi-sub">${solution.inputs.frictionMode === 'force' ? 'Resistencia impuesta' : `μ = ${mu}`}</span>
          </div>
          <div class="kpi-card kpi-traction">
            <span class="kpi-label">${isBrakingNeeded ? 'Fuerza de Retención' : 'Fuerza de Tracción (Ft)'}</span>
            <span class="kpi-value">${Ft.toFixed(2)} <small>N</small></span>
            <span class="kpi-sub">Eje de avance X'</span>
          </div>
          <div class="kpi-card kpi-power">
            <span class="kpi-label">Potencia Mecánica (P)</span>
            <span class="kpi-value">${powerHP.toFixed(2)} <small>HP</small></span>
            <span class="kpi-sub">${powerKW.toFixed(2)} kW (${powerWatts.toFixed(1)} W)</span>
          </div>
        </section>

        <!-- PASO 1: Extracción de Datos y Conversión -->
        <section class="solution-step">
          <div class="step-badge">Paso 1</div>
          <h3 class="step-title">Extracción de Parámetros y Conversión al Sistema Internacional (SI)</h3>
          <p class="step-description">
            A partir del enunciado del problema, se identifican las variables físicas conocidas, se organizan formalmente y se realiza la conversión dimensional correspondiente a unidades del Sistema Internacional:
          </p>

          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Magnitud Física</th>
                  <th>Símbolo</th>
                  <th>Valor Enunciado</th>
                  <th>Conversión Dimensional</th>
                  <th>Valor en SI</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Masa del cuerpo</strong></td>
                  <td>${this.renderMath('m')}</td>
                  <td>${parsedData.mass.raw || `${m} kg`}</td>
                  <td>${parsedData.mass.originalUnit && parsedData.mass.originalUnit !== 'kg' ? `${parsedData.mass.originalValue} ${parsedData.mass.originalUnit} &rarr; SI` : 'Directo'}</td>
                  <td><strong>${m} kg</strong></td>
                </tr>
                <tr>
                  <td><strong>Ángulo de inclinación</strong></td>
                  <td>${this.renderMath('\\theta')}</td>
                  <td>${parsedData.angle.raw || `${thetaDeg}°`}</td>
                  <td>${parsedData.angle.isPercentage ? `\\arctan(${parsedData.angle.percentageValue}/100) = ${thetaDeg}°` : 'Directo en grados sexagesimales'}</td>
                  <td><strong>${thetaDeg}° (${thetaRad.toFixed(4)} rad)</strong></td>
                </tr>
                <tr>
                  <td><strong>Velocidad lineal</strong></td>
                  <td>${this.renderMath('v')}</td>
                  <td>${parsedData.velocity.raw || `${v} m/s`}</td>
                  <td>${parsedData.velocity.originalUnit === 'km/h' ? `${parsedData.velocity.originalValue} \\times \\frac{1000}{3600} \\text{ m/s}` : 'Directo'}</td>
                  <td><strong>${v} m/s</strong></td>
                </tr>
                <tr>
                  <td><strong>Aceleración</strong></td>
                  <td>${this.renderMath('a')}</td>
                  <td>${parsedData.acceleration.raw || `${a} m/s²`}</td>
                  <td>${isConstantVel ? 'Velocidad constante &implies; a = 0' : 'Aceleración lineal'}</td>
                  <td><strong>${a} m/s²</strong></td>
                </tr>
                <tr>
                  <td><strong>Resistencia / Fricción</strong></td>
                  <td>${solution.inputs.frictionMode === 'force' ? this.renderMath('f_r') : this.renderMath('\\mu')}</td>
                  <td>${solution.inputs.frictionMode === 'force' ? `${fr} N` : `μ = ${mu}`}</td>
                  <td>${solution.inputs.frictionMode === 'force' ? 'Fuerza resistiva total al avance' : 'Coeficiente adimensional'}</td>
                  <td><strong>${solution.inputs.frictionMode === 'force' ? `${fr} N` : `μ = ${mu}`}</strong></td>
                </tr>
                <tr>
                  <td><strong>Aceleración gravitatoria</strong></td>
                  <td>${this.renderMath('g')}</td>
                  <td>Constante estándar</td>
                  <td>Valor adoptado en el curso</td>
                  <td><strong>${g} m/s²</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- PASO 2: Marco de Referencia -->
        <section class="solution-step">
          <div class="step-badge">Paso 2</div>
          <h3 class="step-title">Definición del Sistema de Referencia (SR) Rotado</h3>
          <p class="step-description">
            Siguiendo el estándar de análisis en planos inclinados de la física clásica, se rota el sistema cartesiano tradicional:
          </p>
          <div class="callout callout-info">
            <ul>
              <li><strong>Eje X' (Paralelo a la rampa):</strong> Orientado en la dirección longitudinal del plano inclinado. Se establece positivo en la dirección del movimiento ascendente del móvil.</li>
              <li><strong>Eje Y' (Perpendicular a la rampa):</strong> Orientado de manera normal a la superficie de contacto. Se establece positivo hacia afuera del plano (sentido de la fuerza Normal).</li>
              <li><strong>Ventaja Analítica:</strong> Al alinear los ejes con el plano, la aceleración perpendicular se anula estrictamente: ${this.renderMath('a_y = 0')}, reduciendo el estudio de la aceleración a una única ecuación escalar en ${this.renderMath('X\'')}.</li>
            </ul>
          </div>
        </section>

        <!-- PASO 3: Descomposición Vectorial del Peso -->
        <section class="solution-step">
          <div class="step-badge">Paso 3</div>
          <h3 class="step-title">Cálculo del Peso y Descomposición Trigonométrica</h3>
          <p class="step-description">
            La fuerza de gravedad siempre actúa verticalmente hacia el centro de la Tierra. Al proyectar el vector peso ${this.renderMath('\\vec{W}')} sobre los ejes rotados ${this.renderMath('(X\', Y\')')}, el ángulo ${this.renderMath('\\theta')} de la rampa se reproduce exactamente entre el vector peso y el eje ${this.renderMath('-Y\'')} (por el teorema de ángulos con lados respectivamente perpendiculares):
          </p>

          <div class="math-box">
            <div class="math-row">
              <span class="math-name">1. Magnitud del Peso Total:</span>
              <div class="math-eq">${this.renderMath(`W = m \\cdot g = (${m}\\text{ kg}) \\cdot (${g}\\text{ m/s}^2) = ${W.toFixed(2)}\\text{ N}`, true)}</div>
            </div>
            
            <div class="math-row">
              <span class="math-name">2. Componente Perpendicular a la Rampa (Eje Y'):</span>
              <div class="math-eq">${this.renderMath(`W_y = W \\cdot \\cos(\\theta) = m \\cdot g \\cdot \\cos(\\theta)`, true)}</div>
              <div class="math-eq">${this.renderMath(`W_y = (${W.toFixed(2)}) \\cdot \\cos(${thetaDeg}^\\circ) = (${W.toFixed(2)}) \\cdot (${Math.cos(thetaRad).toFixed(4)}) = ${Wy.toFixed(2)}\\text{ N}`, true)}</div>
            </div>

            <div class="math-row">
              <span class="math-name">3. Componente Paralela a la Rampa (Eje X'):</span>
              <div class="math-eq">${this.renderMath(`W_x = W \\cdot \\sin(\\theta) = m \\cdot g \\cdot \\sin(\\theta)`, true)}</div>
              <div class="math-eq">${this.renderMath(`W_x = (${W.toFixed(2)}) \\cdot \\sin(${thetaDeg}^\\circ) = (${W.toFixed(2)}) \\cdot (${Math.sin(thetaRad).toFixed(4)}) = ${Wx.toFixed(2)}\\text{ N}`, true)}</div>
            </div>
          </div>
        </section>

        <!-- PASO 4: Equilibrio en Y' -->
        <section class="solution-step">
          <div class="step-badge">Paso 4</div>
          <h3 class="step-title">Primera Condición de Equilibrio en el Eje Perpendicular (ΣFy = 0)</h3>
          <p class="step-description">
            Dado que el cuerpo no se despega de la rampa ni penetra en ella, no existe aceleración en la dirección perpendicular ${this.renderMath('(a_y = 0)')}. Por consiguiente, se aplica la Primera Ley de Newton:
          </p>

          <div class="math-box">
            <div class="math-eq">${this.renderMath('\\sum F_y = m \\cdot a_y = 0', true)}</div>
            <div class="math-eq">${this.renderMath(`N - W_y = 0 \\implies N = W_y = m \\cdot g \\cdot \\cos(\\theta)`, true)}</div>
            <div class="math-eq">${this.renderMath(`N = ${Wy.toFixed(2)}\\text{ N}`, true)}</div>
          </div>
          <p class="step-note">
            <em>Nota didáctica:</em> La fuerza normal representa la reacción elástica que ejerce la superficie sobre el objeto para sostenerlo contra la componente perpendicular del peso.
          </p>
        </section>

        <!-- PASO 5: Fuerza de Rozamiento -->
        <section class="solution-step">
          <div class="step-badge">Paso 5</div>
          <h3 class="step-title">Evaluación de la Fuerza de Fricción Dinámica (fr)</h3>
          <p class="step-description">
            La fuerza de rozamiento cinético actúa en la interfaz de contacto siempre en sentido opuesto al vector velocidad relativa instantánea:
          </p>

          <div class="math-box">
            ${solution.inputs.frictionMode === 'force' 
              ? `<div class="math-eq">${this.renderMath(`f_r = ${fr.toFixed(2)}\\text{ N} \\quad \\text{(Fuerza resistiva total especificada)}`, true)}</div>
                 <div class="math-eq">${this.renderMath(`\\mu_{\\text{equivalente}} = \\frac{f_r}{N} = \\frac{${fr.toFixed(2)}}{${N.toFixed(2)}} = ${mu.toFixed(4)}`, true)}</div>`
              : `<div class="math-eq">${this.renderMath(`f_r = \\mu_k \\cdot N = (${mu}) \\cdot (${N.toFixed(2)}\\text{ N}) = ${fr.toFixed(2)}\\text{ N}`, true)}</div>`
            }
          </div>
        </section>

        <!-- PASO 6: Segunda Ley de Newton en X' -->
        <section class="solution-step">
          <div class="step-badge">Paso 6</div>
          <h3 class="step-title">Segunda Ley de Newton en el Eje Paralelo (ΣFx = m·a)</h3>
          <p class="step-description">
            Analizando las fuerzas a lo largo del eje longitudinal ${this.renderMath('X\'')}, se tienen:
          </p>
          <ul class="step-list">
            <li><strong>${this.renderMath('F_t')}:</strong> Fuerza de tracción o motriz ejercida (hacia arriba del plano).</li>
            <li><strong>${this.renderMath('f_r')}:</strong> Fuerza de fricción y resistencia (opuesta al avance, hacia abajo).</li>
            <li><strong>${this.renderMath('W_x')}:</strong> Componente del peso a lo largo de la pendiente (actúa hacia abajo).</li>
          </ul>

          <div class="math-box">
            <div class="math-row">
              <span class="math-name">Planteamiento de la sumatoria:</span>
              <div class="math-eq">${this.renderMath(`\\sum F_x = m \\cdot a`, true)}</div>
              <div class="math-eq">${this.renderMath(`F_t - f_r - W_x = m \\cdot a`, true)}</div>
            </div>

            ${isConstantVel ? `
              <div class="math-row">
                <span class="math-name">Condición de Velocidad Constante (a = 0):</span>
                <p>Al ser un movimiento uniforme, la aceleración es nula:</p>
                <div class="math-eq">${this.renderMath(`F_t - f_r - W_x = 0`, true)}</div>
                <div class="math-eq">${this.renderMath(`F_t = f_r + W_x = f_r + m \\cdot g \\cdot \\sin(\\theta)`, true)}</div>
              </div>
            ` : `
              <div class="math-row">
                <span class="math-name">Despeje de la Fuerza de Tracción para ${this.renderMath(`a = ${a}\\text{ m/s}^2`)}:</span>
                <div class="math-eq">${this.renderMath(`F_t = f_r + W_x + m \\cdot a`, true)}</div>
              </div>
            `}

            <div class="math-row">
              <span class="math-name">Sustitución Numérica Paso a Paso:</span>
              <div class="math-eq">${this.renderMath(`F_t = (${fr.toFixed(2)}) + (${Wx.toFixed(2)}) ${!isConstantVel ? `+ [(${m}) \\cdot (${a})]` : ''}`, true)}</div>
              <div class="math-eq highlighted-eq">${this.renderMath(`F_t = ${Ft.toFixed(2)}\\text{ N}`, true)}</div>
            </div>
          </div>
        </section>

        <!-- PASO 7: Potencia Mecánica -->
        <section class="solution-step">
          <div class="step-badge">Paso 7</div>
          <h3 class="step-title">Balance Energético y Cálculo de la Potencia Mecánica (Watts, kW, HP)</h3>
          <p class="step-description">
            La potencia mecánica desarrollada para sostener el régimen cinemático se calcula a través del producto escalar de la fuerza motriz y el vector velocidad lineal ${this.renderMath('(P = \\vec{F}_t \\cdot \\vec{v} = F_t \\cdot v)')}:
          </p>

          <div class="math-box">
            <div class="math-row">
              <span class="math-name">1. Potencia en el Sistema Internacional (Watts):</span>
              <div class="math-eq">${this.renderMath(`P = F_t \\cdot v = (${Ft.toFixed(2)}\\text{ N}) \\cdot (${v}\\text{ m/s}) = ${powerWatts.toFixed(2)}\\text{ Watts [W]}`, true)}</div>
            </div>

            <div class="math-row">
              <span class="math-name">2. Equivalencia en Kilovatios (kW):</span>
              <div class="math-eq">${this.renderMath(`P_{\\text{kW}} = \\frac{P}{1000} = \\frac{${powerWatts.toFixed(2)}}{1000} = ${powerKW.toFixed(3)}\\text{ kW}`, true)}</div>
            </div>

            <div class="math-row">
              <span class="math-name">3. Equivalencia en Caballos de Potencia (Horsepower - HP):</span>
              <p>Considerando la relación de conversión estándar (${this.renderMath('1\\text{ HP} \\approx 745.7\\text{ W}')}):</p>
              <div class="math-eq highlighted-eq">${this.renderMath(`P_{\\text{HP}} = \\frac{P}{745.7} = \\frac{${powerWatts.toFixed(2)}}{745.7} = ${powerHP.toFixed(3)}\\text{ HP}`, true)}</div>
            </div>
          </div>
        </section>

        <!-- Conclusiones y Validación Física -->
        <section class="solution-step">
          <div class="step-badge">Síntesis</div>
          <h3 class="step-title">Conclusiones Físicas y Validación del Modelo</h3>
          <div class="callout callout-success">
            <ul>
              <li><strong>Efecto de la Pendiente:</strong> La componente del peso paralela a la rampa ${this.renderMath(`W_x = ${Wx.toFixed(2)}\\text{ N}`)} representa el <strong>${((Wx / (Ft || 1)) * 100).toFixed(1)}%</strong> del esfuerzo motriz total requerido.</li>
              <li><strong>Efecto de la Fricción:</strong> Las pérdidas resistivas ${this.renderMath(`f_r = ${fr.toFixed(2)}\\text{ N}`)} representan el <strong>${((fr / (Ft || 1)) * 100).toFixed(1)}%</strong> del esfuerzo motriz restante.</li>
              <li><strong>Régimen de Operación:</strong> ${isConstantVel ? 'El sistema se encuentra en equilibrio traslacional dinámico uniforme (velocidad constante).' : `El sistema experimenta una fuerza neta positiva de ${solution.results.netForceX.toFixed(2)} N que produce una aceleración de ${a} m/s².`}</li>
              <li><strong>Potencia Demanda:</strong> Se requiere un grupo motopropulsor con una potencia neta efectiva mínima en el eje de <strong>${powerHP.toFixed(2)} HP (${powerKW.toFixed(2)} kW)</strong>.</li>
            </ul>
          </div>
        </section>

        <footer class="report-footer">
          <p>Documento generado computacionalmente para la cátedra de Física Mecánica.</p>
        </footer>

      </article>
    `;
  }
};


  /**
 * Controlador Principal de la Aplicación
 * Proyecto de Aula - Física Mecánica
 * Autor: Ricardo Jaraba Gallego
 */


class AppController {
  constructor() {
    this.canvasEngine = null;
    this.currentParsedData = null;
    this.currentSolution = null;

    // Estado editable sincronizado
    this.state = {
      mass: 1200,
      angle: 15,
      velocity: 20,
      acceleration: 0,
      frictionMode: 'force', // 'force' o 'mu'
      frictionForce: 450,
      mu: 0.2,
      direction: 'up',
      gravity: 9.8
    };

    this.init();
  }

  init() {
    // 1. Inicializar Canvas 2D
    const canvasElement = document.getElementById('dcl-canvas');
    if (canvasElement) {
      this.canvasEngine = new DCLCanvas(canvasElement);
    }

    // 2. Renderizar lista de presets de problemas
    this.populatePresets();

    // 3. Vincular eventos de la interfaz
    this.bindEvents();

    // 4. Cargar problema inicial predeterminado (Camión en rampa)
    this.loadPreset('camion-pendiente-potencia');
  }

  populatePresets() {
    const presetSelect = document.getElementById('preset-select');
    if (!presetSelect) return;

    presetSelect.innerHTML = '<option value="">-- Seleccionar Ejercicio Típico de Examen / Taller --</option>';
    ProblemParser.presets.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = `[${p.category}] ${p.title}`;
      presetSelect.appendChild(opt);
    });
  }

  bindEvents() {
    // Botón de análisis de texto
    const parseBtn = document.getElementById('btn-parse');
    const problemInput = document.getElementById('problem-input');
    const presetSelect = document.getElementById('preset-select');

    if (parseBtn) {
      parseBtn.addEventListener('click', () => {
        this.parseAndSolve(problemInput.value);
      });
    }

    // Botón para normalizar y limpiar sintaxis LaTeX ($ y \text{})
    const cleanBtn = document.getElementById('btn-clean-latex');
    if (cleanBtn && problemInput) {
      cleanBtn.addEventListener('click', () => {
        const cleaned = ProblemParser.cleanLaTeX(problemInput.value);
        problemInput.value = cleaned;
      });
    }

    // Auto-limpieza inteligente al pegar texto copiado con formato LaTeX
    if (problemInput) {
      problemInput.addEventListener('paste', (e) => {
        const pasteData = (e.clipboardData || window.clipboardData)?.getData('text');
        if (pasteData && (pasteData.includes('$') || pasteData.includes('\\text') || pasteData.includes('\\circ') || pasteData.includes('\\mathrm'))) {
          e.preventDefault();
          const cleanedPaste = ProblemParser.cleanLaTeX(pasteData);
          const start = problemInput.selectionStart;
          const end = problemInput.selectionEnd;
          const currentVal = problemInput.value;
          problemInput.value = currentVal.substring(0, start) + cleanedPaste + currentVal.substring(end);
          problemInput.selectionStart = problemInput.selectionEnd = start + cleanedPaste.length;
        }
      });
    }

    if (presetSelect) {
      presetSelect.addEventListener('change', (e) => {
        if (e.target.value) {
          this.loadPreset(e.target.value);
        }
      });
    }

    // Sincronización en vivo con Sliders y Campos Numéricos
    this.bindControl('input-mass', 'slider-mass', 'mass');
    this.bindControl('input-angle', 'slider-angle', 'angle');
    this.bindControl('input-velocity', 'slider-velocity', 'velocity');
    this.bindControl('input-accel', 'slider-accel', 'acceleration');

    // Fricción
    const frictionModeSelect = document.getElementById('select-friction-mode');
    const groupMu = document.getElementById('group-mu');
    const groupFr = document.getElementById('group-fr');

    if (frictionModeSelect) {
      frictionModeSelect.addEventListener('change', (e) => {
        this.state.frictionMode = e.target.value;
        if (this.state.frictionMode === 'mu') {
          groupMu.classList.remove('hidden');
          groupFr.classList.add('hidden');
        } else {
          groupMu.classList.add('hidden');
          groupFr.classList.remove('hidden');
        }
        this.recalculateFromState();
      });
    }

    this.bindControl('input-mu', 'slider-mu', 'mu');
    this.bindControl('input-fr', 'slider-fr', 'frictionForce');

    // Sentido de movimiento
    const dirSelect = document.getElementById('select-direction');
    if (dirSelect) {
      dirSelect.addEventListener('change', (e) => {
        this.state.direction = e.target.value;
        this.recalculateFromState();
      });
    }

    // Gravedad
    const gravitySelect = document.getElementById('select-gravity');
    if (gravitySelect) {
      gravitySelect.addEventListener('change', (e) => {
        this.state.gravity = parseFloat(e.target.value) || 9.8;
        this.recalculateFromState();
      });
    }

    // Botones del Canvas DCL
    const btnToggleView = document.getElementById('btn-toggle-view');
    if (btnToggleView) {
      btnToggleView.addEventListener('click', () => {
        const current = this.canvasEngine.options.viewMode;
        const next = current === 'contextual' ? 'dcl' : 'contextual';
        this.canvasEngine.setOption('viewMode', next);
        btnToggleView.classList.toggle('active', next === 'dcl');
        btnToggleView.querySelector('.btn-text').textContent = next === 'dcl' ? 'Vista: DCL Aislado' : 'Vista: Rampa Real';
      });
    }

    const checkComponents = document.getElementById('check-components');
    if (checkComponents) {
      checkComponents.addEventListener('change', (e) => {
        this.canvasEngine.setOption('showComponents', e.target.checked);
      });
    }

    const checkValues = document.getElementById('check-values');
    if (checkValues) {
      checkValues.addEventListener('change', (e) => {
        this.canvasEngine.setOption('showValues', e.target.checked);
      });
    }

    const checkAxes = document.getElementById('check-axes');
    if (checkAxes) {
      checkAxes.addEventListener('change', (e) => {
        this.canvasEngine.setOption('showAxes', e.target.checked);
      });
    }

    const btnAnim = document.getElementById('btn-anim');
    if (btnAnim) {
      btnAnim.addEventListener('click', () => {
        const isRunning = !this.canvasEngine.options.isAnimating;
        this.canvasEngine.setOption('isAnimating', isRunning);
        btnAnim.classList.toggle('active', isRunning);
        btnAnim.querySelector('.btn-text').textContent = isRunning ? 'Pausar Simulación' : 'Animar Movimiento';
      });
    }

    // Botón Imprimir / PDF
    const btnPrint = document.getElementById('btn-print');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        window.print();
      });
    }
  }

  bindControl(inputId, sliderId, stateKey) {
    const numInput = document.getElementById(inputId);
    const slider = document.getElementById(sliderId);

    if (numInput && slider) {
      numInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 0;
        slider.value = val;
        this.state[stateKey] = val;
        this.recalculateFromState();
      });

      slider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        numInput.value = val;
        this.state[stateKey] = val;
        this.recalculateFromState();
      });
    }
  }

  loadPreset(presetId) {
    const preset = ProblemParser.presets.find(p => p.id === presetId);
    if (!preset) return;

    const textarea = document.getElementById('problem-input');
    if (textarea) {
      textarea.value = preset.text;
    }

    const presetSelect = document.getElementById('preset-select');
    if (presetSelect) {
      presetSelect.value = presetId;
    }

    this.parseAndSolve(preset.text);
  }

  parseAndSolve(text) {
    // 1. Extraer datos con NLP / RegEx (con limpieza automática de LaTeX)
    const parsed = ProblemParser.parse(text);
    this.currentParsedData = parsed;

    // Actualizar el campo de texto con la tipografía normal limpia si contenía LaTeX
    const inputArea = document.getElementById('problem-input');
    if (inputArea && parsed.normalizedText && inputArea.value !== parsed.normalizedText) {
      inputArea.value = parsed.normalizedText;
    }

    // 2. Sincronizar estado editable
    this.state.mass = parsed.mass.value;
    this.state.angle = parsed.angle.value;
    this.state.velocity = parsed.velocity.value;
    this.state.acceleration = parsed.acceleration.value;
    this.state.frictionMode = parsed.frictionType;
    if (parsed.frictionType === 'force') {
      this.state.frictionForce = parsed.frictionForce.value || 0;
    } else {
      this.state.mu = parsed.mu.value;
    }
    this.state.direction = parsed.direction;

    // 3. Reflejar en controles de UI
    this.updateControlsUI();

    // 4. Renderizar chips de entidades extraídas
    this.renderEntityBadges(parsed);

    // 5. Resolver físicamente y renderizar
    this.recalculate();
  }

  updateControlsUI() {
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    };

    setVal('input-mass', this.state.mass);
    setVal('slider-mass', this.state.mass);

    setVal('input-angle', this.state.angle);
    setVal('slider-angle', this.state.angle);

    setVal('input-velocity', this.state.velocity);
    setVal('slider-velocity', this.state.velocity);

    setVal('input-accel', this.state.acceleration);
    setVal('slider-accel', this.state.acceleration);

    setVal('select-friction-mode', this.state.frictionMode);
    setVal('input-mu', this.state.mu);
    setVal('slider-mu', this.state.mu);
    setVal('input-fr', this.state.frictionForce);
    setVal('slider-fr', this.state.frictionForce);

    setVal('select-direction', this.state.direction);

    // Visibilidad de grupo de fricción
    const groupMu = document.getElementById('group-mu');
    const groupFr = document.getElementById('group-fr');
    if (groupMu && groupFr) {
      if (this.state.frictionMode === 'mu') {
        groupMu.classList.remove('hidden');
        groupFr.classList.add('hidden');
      } else {
        groupMu.classList.add('hidden');
        groupFr.classList.remove('hidden');
      }
    }
  }

  renderEntityBadges(parsed) {
    const container = document.getElementById('extracted-badges');
    if (!container) return;

    if (!parsed.matchesFound || parsed.matchesFound.length === 0) {
      container.innerHTML = '<span class="badge-empty">Parámetros predeterminados activos</span>';
      return;
    }

    container.innerHTML = parsed.matchesFound
      .map(m => `
        <span class="entity-badge">
          <span class="entity-type">${m.type}:</span>
          <span class="entity-val">${m.value}</span>
        </span>
      `)
      .join('');
  }

  recalculateFromState() {
    // Si el usuario movió un slider, sincronizamos la entrada sintética
    this.currentParsedData = {
      rawText: 'Parámetros ajustados interactivamente por el usuario',
      mass: { value: this.state.mass, unit: 'kg', raw: `${this.state.mass} kg` },
      angle: { value: this.state.angle, unit: 'deg', raw: `${this.state.angle}°`, isPercentage: false },
      velocity: { value: this.state.velocity, unit: 'm/s', raw: `${this.state.velocity} m/s` },
      acceleration: { value: this.state.acceleration, unit: 'm/s²', raw: `${this.state.acceleration} m/s²` },
      frictionType: this.state.frictionMode,
      mu: { value: this.state.mu },
      frictionForce: { value: this.state.frictionForce },
      direction: this.state.direction,
      gravity: this.state.gravity,
      matchesFound: []
    };

    this.recalculate();
  }

  recalculate() {
    const inputForEngine = {
      mass: { value: this.state.mass },
      angle: { value: this.state.angle },
      velocity: { value: this.state.velocity },
      acceleration: { value: this.state.acceleration },
      frictionType: this.state.frictionMode,
      mu: { value: this.state.mu },
      frictionForce: { value: this.state.frictionForce },
      direction: this.state.direction,
      gravity: this.state.gravity
    };

    // 1. Resolver motor analítico
    const solution = DynamicsEngine.solve(inputForEngine);
    this.currentSolution = solution;

    // 2. Actualizar DCL Canvas
    if (this.canvasEngine) {
      this.canvasEngine.setSolution(solution);
    }

    // 3. Generar Memoria de Cálculo Paso a Paso
    const solutionContainer = document.getElementById('solution-container');
    if (solutionContainer) {
      solutionContainer.innerHTML = StepRenderer.generateSolutionHTML(this.currentParsedData, solution);
    }
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AppController();
});

})();
