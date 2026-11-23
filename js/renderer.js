/**
 * Generador de Memoria de Cálculo y Análisis Paso a Paso
 * Metodología Académica de Física Mecánica
 * Autor: Ricardo Jaraba Gallego
 */

export const StepRenderer = {
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
