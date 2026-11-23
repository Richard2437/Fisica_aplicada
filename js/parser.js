/**
 * Módulo de Extracción de Datos y Procesamiento de Lenguaje Natural (NLP / RegEx)
 * Proyecto de Aula - Física Mecánica
 * Corporación Universitaria Lasallista
 * Autor: Ricardo Jaraba Gallego
 */

export const ProblemParser = {
  /**
   * Colección de problemas de ejemplo clásicos de Física Mecánica
   */
  presets: [
    {
      id: 'camion-pendiente-potencia',
      title: 'Camión en pendiente con resistencia (Cálculo de Potencia en HP)',
      category: 'Equilibrio Dinámico & Potencia',
      description: 'Problema rector de la propuesta de aula Lasallista.',
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
