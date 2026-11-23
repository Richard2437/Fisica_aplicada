/**
 * Motor de Renderizado Vectorial 2D (HTML5 Canvas)
 * Proyecto de Aula - Física Mecánica
 * Corporación Universitaria Lasallista
 * Autor: Ricardo Jaraba Gallego
 */

export class DCLCanvas {
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
