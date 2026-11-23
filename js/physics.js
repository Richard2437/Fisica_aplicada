/**
 * Motor de Dinámica y Física Newtoniana (DynamicsEngine)
 * Proyecto de Aula - Física Mecánica
 * Corporación Universitaria Lasallista
 * Autor: Ricardo Jaraba Gallego
 */

export const DynamicsEngine = {
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
    // Convención Lasallista:
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
