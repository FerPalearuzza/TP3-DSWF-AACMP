# FUL Y VALE APP · TP3 · AACMP

Landing del grupo 04 para Desarrollo de Sistemas Web Frontend, IFTS 29 (2026).  
Presenta dos propuestas agénticas del bloque **S05-B: Inscripción y pago** (R3 y R4).  
Startup original del IFTS 16.

# Alcance y estado

Etapa 2: estructura, contenido aprobado, navegación por anclas y desplegables nativos. Los diagramas tienen un componente provisional; su representación definitiva se realizará en la siguiente etapa. No hay backend, APIs, agentes funcionales ni procesamiento de pagos.

Las sentencias originales se conservan en `src/data/proposals.js`. Las alternativas y herramientas agregadas se identifican como decisiones AACMP. Un partido gratuito no se confirma automáticamente por R3; un pago confirmado no confirma automáticamente una inscripción por R4.

El logo original se copió desde el recurso proporcionado `S05.webp`, sin recrearlo ni modificar el archivo de imagen.

# Ejecutar

Requiere una versión de Node.js compatible con Vite; recomendado Node.js 22.12 o posterior. El desarrollo inicial se verificó con Node.js 26.13.0.


# Asignación docente

- Startup: FUL Y VALE APP · S05 · Deportes y encuentros recreativos
- Bloque: S05-B · Inscripción y pago
- Origen: Startup creada por estudiantes del IFTS 16

# Sentencias asignadas

R3 — Inscripción
> Si un usuario cumple los requisitos del partido, solicita inscribirse, aún no tiene una inscripción y hay cupo libre, el sistema reserva un cupo e inicia una inscripción pendiente; si el partido es arancelado, muestra el pago pendiente.

R4 — Control de pago
> Si existe una inscripción pendiente en un partido arancelado y su pago todavía no fue confirmado, el sistema mantiene esa inscripción pendiente y no la confirma.


# Alcance del proyecto

Esta landing explica y representa dos flujos agénticos de forma conceptual. **No integra IA, no ejecuta agentes, no conecta APIs y no procesa pagos ni inscripciones reales.**

Las sentencias originales se conservan sin cambios en `src/data/proposals.js`. Las alternativas y herramientas agregadas se identifican explícitamente como decisiones AACMP:

- Un partido gratuito no se confirma automáticamente por R3.
- Un pago confirmado no confirma automáticamente una inscripción por R4.

El logo original se copió desde el recurso proporcionado (`S05.webp`) sin recrearlo ni modificar el archivo de imagen.

---

# Ejecutar en local

Requiere Node.js 22.12 o posterior (verificado con Node.js 24.16.0).

```sh
npm install
npm run dev
```

En PowerShell, si la política del sistema bloquea `npm.ps1`, usar `npm.cmd run dev`.

```sh
npm run build
npm run preview
```

Deploy en Vercel: comando `npm run build`, directorio de salida `dist`. No requiere variables de entorno ni configuración de rutas SPA (la navegación usa anclas).

# Arquitectura

- React 19 + Vite + JavaScript; CSS sin bibliotecas adicionales.
- `src/App.jsx` — composición de la página.
- `src/components/Header.jsx` — identidad y navegación por anclas.
- `src/components/StartupIntro.jsx` — presentación y logo original.
- `src/components/ProposalSection.jsx` — sección reutilizable para R3 y R4.
- `src/components/FlowDiagram.jsx` — diagramas de flujo agénticos (nodos HTML/CSS tipados, bifurcaciones SÍ/NO).
- `src/components/ProposalDetails.jsx` — desplegables con datos, recorrido, excepciones y casos.
- `src/components/Footer.jsx` — equipo y atribuciones.
- `src/data/proposals.js` — fuente de contenido de ambas propuestas.
- `src/styles/index.css` — identidad visual, diagramas, estados de foco y responsive.
- `public/images/S05.webp` — logo original.

# Publicación prevista

Compatible con un proyecto Vite estático en Vercel: comando `npm run build`, directorio de salida `dist`. No necesita variables de entorno ni configuración de rutas SPA: la navegación usa anclas de la misma página. Todavía no se publicó.

# Contenido y lógica

- Startup identificada con logo original legible.
- Las dos sentencias (R3 y R4) están presentes y sin modificar.
- Cada diagrama de flujo corresponde a su sentencia.
- Los diagramas distinguen condiciones de la regla vs. decisiones AACMP.
- Se recorrió un caso positivo, uno negativo y uno límite para cada flujo.

# Participación y construcción agéntica
# Diseño y funcionamiento (verificar en desktop)
- El logo se ve completo y nítido
- Ambos diagramas son legibles, sin desbordes horizontales.
- Los desplegables se abren con clic, Tab, Enter y Espacio.
- La página se puede leer y recorrer sin desbordes en desktop.
- Otra persona puede explicar las propuestas después de recorrerla.

El agente genera y modifica el código; AACMP dirige, revisa la lógica y verifica el resultado. Integrantes y aportes individuales: pendientes de completar con datos del equipo; no se inventan nombres.

Aplicación utilizada: Codex. Modelo: no informado en el registro del equipo; completar con el nombre visible en la interfaz si está disponible.

Iteraciones: arquitectura propuesta y aprobada; especificación funcional R3/R4 revisada y aprobada; implementación de la estructura solicitada. Se preservaron las restricciones sobre confirmación automática y la distinción entre reglas originales y decisiones AACMP.

# Revisión del equipo

Verificación técnica de etapa 2: build de producción correcto con React 19.3.1 y Vite 8.3.5; render de React comprobado con dos propuestas, diez desplegables, sentencias presentes, tres casos por propuesta, IDs únicos y anclas resueltas. Logo copiado con hash SHA-256 idéntico al original. Instalación sin vulnerabilidades reportadas. La revisión visual y la interacción real por teclado en navegador siguen pendientes; el render estático no las sustituye.

- Recorrer navegación y desplegables con clic, Tab, Enter y Espacio.
- Verificar logo completo, lectura desktop y ausencia de desbordes en móvil.
- Contrastar las sentencias con el PDF y recorrer casos positivos, negativos y límite.
- Los criterios relativos al diagrama definitivo quedan pendientes de la etapa siguiente.
- Antes de la entrega, registrar integrantes, modelos, revisión cruzada y comprobar enlaces públicos sin sesión.

