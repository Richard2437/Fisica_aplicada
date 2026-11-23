# Herramienta Computacional para la Resolución Simbólica y Gráfica de Dinámica Newtoniana y DCL

**Asignatura:** Física Mecánica  
**Estudiante:** Ricardo Jaraba Gallego  
**Docente:** Jeisson Javier Ortiz Arroyave  

---

## 1. Introducción y Justificación

El aprendizaje formal de la física mecánica, y en particular de la dinámica traslacional, exige una comprensión rigurosa de las interacciones vectoriales a través del **Diagrama de Cuerpo Libre (DCL)**. En la práctica académica habitual, uno de los principales obstáculos radica en la transición conceptual desde el enunciado del problema hasta el correcto planteamiento de las ecuaciones de movimiento, especialmente al trabajar sobre sistemas de referencia rotados como los planos inclinados con presencia de fuerzas resistivas o tracciones motrices.

Esta herramienta computacional interactiva automatiza el modelado físico, el dibujo paramétrico del DCL y la generación de una memoria de cálculo analítica paso a paso, emulando la estructura lógica y ordenada con la que se resuelven estos problemas en los cuadernos de trabajo universitario.

---

## 2. Características Principales

1. **Extracción Inteligente de Datos (NLP / RegEx):**
   - Reconoce enunciados en texto libre en español.
   - Identifica y extrae automáticamente parámetros iniciales con sus unidades originales y conversiones al Sistema Internacional (SI):
     - Masa ($m$ en kg, g, lb, toneladas).
     - Ángulo de inclinación ($\theta$ en grados sexagesimales, radianes o pendiente porcentual $\%$, así como planos horizontales $\theta = 0^\circ$).
     - Velocidad lineal ($v$ en m/s o km/h, identificando regímenes a velocidad constante $a = 0$).
     - Aceleración ($a$ en m/s²).
     - Fricción dinámica (por coeficiente $\mu$ o fuerza resistiva directa $f_r$ en Newtons).
     - Sentido del movimiento (ascendente, descendente o plano horizontal).

2. **Diagrama de Cuerpo Libre (DCL) Vectorial Interactivo (HTML5 Canvas 2D):**
   - Renderizado en alta resolución (High-DPI / Retina).
   - **Vista Contextual:** Muestra la rampa real, el bloque apoyado y los vectores actuando desde su centro de masa.
   - **Vista DCL Pura:** Proyecta el sistema cartesiano rotado $(X', Y')$ con origen en la masa puntual, idéntico al formato exigido en exámenes.
   - Vectores codificados por color con flechas proporcionales y etiquetas con magnitudes en Newtons:
     - Normal $\vec{N}$ (Verde esmeralda).
     - Peso $\vec{W}$ (Azul).
     - Componentes del peso $W_x$ y $W_y$ con líneas de proyección y arco del ángulo $\theta$ (Púrpura e Índigo).
     - Fuerza de rozamiento $\vec{f}_r$ (Rojo).
     - Fuerza de tracción o retención $\vec{F}_t$ (Ámbar / Naranja).
   - Simulación y animación suave de movimiento a lo largo del plano.
   - Toggles interactivos para activar/desactivar componentes, valores numéricos y ejes.

3. **Memoria de Cálculo Paso a Paso (Metodología de Clase):**
   - **Paso 1:** Extracción y tabla formal de conversión dimensional al SI.
   - **Paso 2:** Definición analítica del Sistema de Referencia rotado y convención de signos.
   - **Paso 3:** Demostración geométrica y cálculo de componentes del peso ($W_x = mg\sin\theta$, $W_y = mg\cos\theta$).
   - **Paso 4:** Ecuación de equilibrio perpendicular ($\sum F_y = 0 \implies N = W_y$).
   - **Paso 5:** Modelo de fricción dinámica ($f_r = \mu N$).
   - **Paso 6:** Ecuación de movimiento en el eje paralelo ($\sum F_x = ma \implies F_t = f_r + W_x + ma$).
   - **Paso 7:** Balance de potencia mecánica instantánea ($P = F_t \cdot v$) con conversiones a Watts, Kilovatios (kW) y Caballos de Fuerza (HP).
   - **Paso 8:** Síntesis y cuadro resumen de magnitudes clave.

4. **Sincronización Bidireccional:**
   - Sliders y controles numéricos en tiempo real que actualizan inmediatamente el DCL y la memoria de cálculo al manipular cualquier parámetro.

5. **Exportación e Impresión Académica:**
   - Hoja de estilos optimizada (`@media print`) para imprimir la memoria de cálculo o guardarla como PDF con membrete institucional.

---

## 3. Formulación Física y Ecuaciones

### Marco de Referencia Rotado
- Eje $X'$: Paralelo a la superficie del plano inclinado (positivo en la dirección de ascenso).
- Eje $Y'$: Perpendicular a la superficie (positivo hacia afuera del plano).
- Al no haber movimiento en la dirección normal: $a_y = 0$.

### Ecuaciones Fundamentales

1. **Magnitud del Peso:**
   $$W = m \cdot g$$

2. **Componentes Ortogonales del Peso:**
   $$W_x = m \cdot g \cdot \sin(\theta)$$
   $$W_y = m \cdot g \cdot \cos(\theta)$$

3. **Equilibrio en el Eje $Y'$:**
   $$\sum F_y = 0 \implies N - W_y = 0 \implies N = m \cdot g \cdot \cos(\theta)$$

4. **Fuerza de Rozamiento Dinámico:**
   $$f_r = \mu \cdot N$$

5. **Dinámica en el Eje $X'$ (Segunda Ley de Newton):**
   $$\sum F_x = m \cdot a_x$$
   $$F_t - f_r - W_x = m \cdot a$$
   $$F_t = f_r + W_x + m \cdot a$$

   *Para velocidad constante ($a = 0$):*
   $$F_t = f_r + W_x = f_r + m \cdot g \cdot \sin(\theta)$$

6. **Potencia Mecánica:**
   $$P_{\text{Watts}} = F_t \cdot v$$
   $$P_{\text{kW}} = \frac{P_{\text{Watts}}}{1000}$$
   $$P_{\text{HP}} = \frac{P_{\text{Watts}}}{745.7}$$

---

## 4. Estructura del Proyecto

```
fisica_mec_aplication/
├── css/
│   └── styles.css          # Estilos modernos, layout responsivo y reglas de impresión
├── js/
│   ├── app.js              # Controlador de UI y sincronización de eventos
│   ├── canvas.js           # Motor de renderizado vectorial 2D en HTML5 Canvas
│   ├── parser.js           # Parser de lenguaje natural y presets de examen
│   ├── physics.js          # DynamicsEngine con resolución newtoniana y potencias
│   ├── renderer.js         # Generador de la memoria de cálculo académica
│   └── bundle.js           # Bundle unificado para ejecución universal offline
├── test/
│   ├── verify.mjs          # Prueba del problema rector del camión
│   └── verify_all.mjs      # Suite completa de verificación de los 6 presets
├── vendor/
│   └── katex/              # Motor KaTeX local para renderizado matemático offline
├── build.js                # Script de compilación del bundle
├── index.html              # Interfaz de usuario interactiva
├── package.json            # Configuración de dependencias y scripts
├── README.md               # Documentación académica del proyecto
└── server.js               # Servidor web local ligero en Node.js
```

---

## 5. Instrucciones de Instalación y Ejecución

La herramienta fue desarrollada para ser 100% portable y accesible sin requerir configuraciones complejas.

### Opción 1: Ejecución Directa en el Navegador (Sin servidor)
1. Localice el archivo `index.html` en la carpeta del proyecto.
2. Haga doble clic sobre él o ábralo con Google Chrome, Mozilla Firefox, Microsoft Edge o Safari.
3. El aplicativo cargará inmediatamente con todos los estilos, renderizado matemático y gráficos vectoriales funcionales de manera local.

### Opción 2: Servidor Local con Node.js
Si dispone de Node.js instalado:
```bash
npm start
```
Abra en su navegador la URL:
```
http://localhost:3000
```

### Opción 3: Servidor Local con Python
Si dispone de Python instalado:
```bash
python -m http.server 3000
```
Y acceda a `http://localhost:3000`.

---

## 6. Ejecución de Pruebas de Validación

El proyecto incluye una suite de pruebas automatizadas que valida la extracción y los cálculos físicos de todos los casos de estudio:

```bash
npm test
```
o ejecutando:
```bash
node test/verify_all.mjs
```

---

## 7. Banco de Ejercicios Preconfigurados

El sistema incluye 6 problemas tipo examen listos para cargar con un clic desde el selector de la interfaz:
1. **Camión en pendiente con resistencia (Cálculo de Potencia en HP):** Problema clásico de dinámica y potencia ($m = 1200\text{ kg}$, $\theta = 15^\circ$, $v = 72\text{ km/h}$, $f_r = 450\text{ N}$).
2. **Bloque acelerado hacia arriba con fricción dinámica:** Análisis bajo aceleración neta positiva ($a = 1.8\text{ m/s}^2$).
3. **Caja descendiendo por una rampa a velocidad constante:** Análisis del régimen de descenso y retención.
4. **Objeto arrastrado en superficie horizontal con fricción:** Caso límite canónico con ángulo nulo ($\theta = 0^\circ$).
5. **Automóvil subiendo una cuesta con pendiente porcentual:** Conversión de pendiente vial ($12\%$) a grados trigonométricos.
6. **Bloque en rampa ideal sin rozamiento:** Demostración pura del efecto gravitacional ($\mu = 0$).

---

**Física Mecánica — 2026**
