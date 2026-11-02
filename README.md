# FUL Y VALE APP · TP3 · AACMP

Landing del grupo 04 AACMP para Desarrollo de Sistemas Web Frontend, IFTS 29 (2026). Presenta dos propuestas agénticas del bloque **S05-B: Inscripción y pago**, correspondientes a R3 y R4. Startup original del IFTS 16.

## Alcance y estado

Etapa 3 (rama `marianoa`): estructura, contenido aprobado, navegación por anclas, desplegables nativos y dos diagramas de flujo SVG, uno para R3 y otro para R4. No hay backend, APIs, agentes funcionales ni procesamiento de pagos.

Las sentencias originales se conservan en `src/data/proposals.js`. Las alternativas y herramientas agregadas se identifican como decisiones AACMP. Un partido gratuito no se confirma automáticamente por R3; un pago confirmado no confirma automáticamente una inscripción por R4.

El logo original se copió desde el recurso proporcionado `S05.webp`, sin recrearlo ni modificar el archivo de imagen.

## Ejecutar

Requiere una versión de Node.js compatible con Vite; recomendado Node.js 22.12 o posterior. El desarrollo inicial se verificó con Node.js 26.13.0.

```sh
npm install
npm run dev
```

En PowerShell, si la política del sistema bloquea `npm.ps1`, utilizar `npm.cmd` en lugar de `npm`.

```sh
npm run build
npm run preview
```

`build` genera `dist/`. Para una instalación reproducible con el lockfile: `npm ci`.

## Arquitectura

- React 19 + Vite + JavaScript; CSS sin bibliotecas adicionales.
- `src/App.jsx`: composición de la página.
- `src/components/Header.jsx`: identidad y navegación por anclas.
- `src/components/StartupIntro.jsx`: presentación y logo original.
- `src/components/ProposalSection.jsx`: sección reutilizable para R3 y R4.
- `src/components/FlowDiagram.jsx`: renderer SVG genérico de los diagramas, con leyenda, caso límite, supuestos y versión textual generada desde el mismo grafo.
- `src/data/flows.js`: nodos, conexiones y supuestos de cada recorrido.
- `src/styles/flow-diagram.css`: estilos de los diagramas.
- `src/components/ProposalDetails.jsx`: datos, recorrido, excepciones, casos y criterios mediante `details` y `summary`.
- `src/components/Footer.jsx`: equipo y atribuciones.
- `src/data/proposals.js`: fuente de contenido de ambas propuestas.
- `src/styles/index.css`: identidad visual, estados de foco y adaptación de tamaños.
- `public/images/S05.webp`: logo original.

## Publicación prevista

Compatible con un proyecto Vite estático en Vercel: comando `npm run build`, directorio de salida `dist`. No necesita variables de entorno ni configuración de rutas SPA: la navegación usa anclas de la misma página. Todavía no se publicó.

- Repositorio: https://github.com/FerPalearuzza/TP3-DSWF-AACMP (acceso sin sesión pendiente de comprobar).
- Landing publicada: pendiente.

## Participación y construcción agéntica

El agente genera y modifica el código; AACMP dirige, revisa la lógica y verifica el resultado. Integrantes y aportes individuales: pendientes de completar con datos del equipo; no se inventan nombres.

Aplicación utilizada: Codex. Modelo: no informado en el registro del equipo; completar con el nombre visible en la interfaz si está disponible.

Iteraciones: arquitectura propuesta y aprobada; especificación funcional R3/R4 revisada y aprobada; implementación de la estructura solicitada. Se preservaron las restricciones sobre confirmación automática y la distinción entre reglas originales y decisiones AACMP.

### Etapa 3: diagramas R3 y R4 (rama `marianoa`)

Integrante que dirigió esta sesión: Mariano Arenas. Redactó el encargo (alcance, reglas de trabajo, cuidados sobre la lógica de R3 y R4, fases y pruebas pedidas). La revisión humana del resultado sigue pendiente; ver «Revisión del equipo».

Aplicación: Claude Code, ejecutado dentro del gestor de terminales Herdr 0.9.5. Modelo: Claude Opus 5.5 (`claude-opus-5-5`), tanto en la sesión principal como en los subagentes.

| Rol | Quién | Uso |
|---|---|---|
| Coordinación | Sesión principal de Claude Code | Auditoría del repositorio, lectura de la consigna, validación lógica, especificación de los diagramas, pruebas en navegador y este registro. |
| Programación | Subagente de Claude Code | Crea `flows.js` y `flow-diagram.css`, reemplaza `FlowDiagram.jsx` y aplica las correcciones. |
| Revisión | Subagente de Claude Code, independiente y de solo lectura | Comprueba el grafo, recorre casos y excepciones, y contrasta con la consigna. |

No se delegó en otros agentes de Herdr: pertenecen a otros proyectos.

Evidencia de iteración:

- **Instrucción inicial:** reemplazar el placeholder por dos diagramas, sin simplificar las condiciones y sin presentar como obligatorias acciones que la sentencia no establece.
- **Problemas detectados por la revisión:**
  - El resultado de R3 decía «sin confirmación automática» bajo el rótulo R3, aunque la sentencia no lo dice.
  - La decisión final de R4 derivaba a una persona por presentar un comprobante, mientras que `proposals.js` lo hace solo si el usuario solicita aclaración.
  - Algunas excepciones de R4 dependían de una lectura implícita de «datos consistentes».
  - La leyenda describía mal el trazo de los nodos AACMP.
  - Algunos resultados decían «en revisión» cuando la revisión solo se proponía.
- **Pedido de mejora y cambios:**
  - El resultado de R3 quedó en «inscripción pendiente», y la aclaración pasó a una nota AACMP.
  - La decisión de R4 quedó alineada con el caso límite.
  - «Pago vinculado a la inscripción» pasó a ser explícito, y los supuestos se listan debajo de cada diagrama.
  - Se corrigieron la leyenda, los textos de los resultados y el nombre accesible del SVG.

## Revisión del equipo

Verificación técnica de etapa 2: build de producción correcto con React 19.3.1 y Vite 8.3.5; render de React comprobado con dos propuestas, diez desplegables, sentencias presentes, tres casos por propuesta, IDs únicos y anclas resueltas. Logo copiado con hash SHA-256 idéntico al original. Instalación sin vulnerabilidades reportadas. La revisión visual y la interacción real por teclado en navegador siguen pendientes; el render estático no las sustituye.

Verificación automatizada de etapa 3, ejecutada por agentes sobre el build de producción en Chrome headless:

- **Build:** `npm run build` correcto.
- **Sentencias:** R3 y R4 son idénticas al texto de la página 15 del PDF, y `proposals.js` no se modificó.
- **Grafo:** todos los nodos son alcanzables, todos los caminos terminan en un resultado, no hay ciclos y cada decisión tiene una salida SÍ y una NO. Ningún camino confirma una inscripción.
- **Casos:** se recorrieron sobre el grafo los casos positivo, negativo y límite de ambos flujos, cada condición de R3 falsa por separado y las excepciones de `proposals.js`.
- **Desplegables:** los 12 abren y cierran con Enter, Espacio y clic.
- **Accesibilidad:** ids únicos, anclas resueltas, SVG con nombre y descripción accesibles, y contenedor del diagrama alcanzable con Tab.
- **Diseño:** sin desborde horizontal de la página a 1920, 1366, 1024 y 390 px de ancho. A 1024 y 390 px el diagrama se desplaza dentro de su contenedor.
- **Consola:** el único error es un 404 de `/favicon.ico`, porque el proyecto no define favicon.

Pendiente de revisión humana (las pruebas anteriores no la sustituyen):

- Recorrer la página en un navegador real con clic, Tab, Enter y Espacio.
- Confirmar el logo y la lectura de los diagramas en desktop.
- Recorrer un caso que cumpla la condición y otro que no, en cada flujo, y poder explicarlos.
- Antes de la entrega, registrar integrantes, aportes, revisión cruzada y comprobar los enlaces públicos sin sesión.
