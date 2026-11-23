/**
 * Controlador Principal de la Aplicación
 * Proyecto de Aula - Física Mecánica
 * Corporación Universitaria Lasallista
 * Autor: Ricardo Jaraba Gallego
 */

import { ProblemParser } from './parser.js';
import { DynamicsEngine } from './physics.js';
import { DCLCanvas } from './canvas.js';
import { StepRenderer } from './renderer.js';

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

    // 4. Cargar problema inicial predeterminado (Camión en rampa de la propuesta Lasallista)
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
