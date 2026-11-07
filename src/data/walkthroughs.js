// Recorridos guiados de los casos de proposals.js sobre el grafo de flows.js.
// Solo se guarda qué salida toma cada decisión: la ruta se calcula con las aristas reales,
// así que no puede existir un camino que no esté en el grafo.
//
// caseIndex: posición del caso en proposal.cases (positivo, negativo, límite).
// answers:   salida de cada decisión ('SÍ' o 'NO').
// assumed:   decisiones que el caso no define; la página las muestra como «Supuesto AACMP».
// end:       resultado esperado del caso.
export const walkthroughs = {
  r3: [
    { caseIndex: 0, end: 'e3', answers: { d1: 'SÍ', d2: 'SÍ', d3: 'SÍ', d4: 'SÍ', d5: 'SÍ' }, assumed: ['d1', 'd3', 'd4'] },
    { caseIndex: 1, end: 'e4', answers: { d1: 'SÍ', d2: 'NO' }, assumed: ['d1'] },
    { caseIndex: 2, end: 'e3', answers: { d1: 'SÍ', d2: 'SÍ', d3: 'SÍ', d4: 'SÍ', d5: 'NO' }, assumed: ['d1', 'd3', 'd4'] },
  ],
  r4: [
    { caseIndex: 0, end: 'e3', answers: { d1: 'SÍ', d2: 'SÍ', d3: 'SÍ', d4: 'NO' }, assumed: ['d1', 'd4'] },
    { caseIndex: 1, end: 'e4', answers: { d1: 'SÍ', d2: 'SÍ', d3: 'NO' }, assumed: ['d1'] },
    { caseIndex: 2, end: 'e2', answers: { d1: 'SÍ', d2: 'SÍ', d3: 'SÍ', d4: 'SÍ' }, assumed: ['d1', 'd4'] },
  ],
};

// Recorre el grafo desde el inicio. Devuelve los pasos con la arista por la que sale cada uno.
export function buildRoute(flow, walkthrough) {
  const byId = Object.fromEntries(flow.nodes.map(node => [node.id, node]));
  const steps = [];
  let node = flow.nodes.find(item => item.type === 'start');
  while (node) {
    const exits = flow.edges.filter(edge => edge.from === node.id);
    const answer = walkthrough.answers[node.id];
    const exit = node.type === 'decision' ? exits.find(edge => edge.label?.startsWith(answer)) : exits[0];
    if (node.type === 'decision' && !exit) throw new Error(`El recorrido no define una salida válida para ${node.id}`);
    steps.push({ node, exit: exit ?? null, assumed: walkthrough.assumed.includes(node.id) });
    node = exit ? byId[exit.to] : null;
  }
  if (steps.at(-1).node.id !== walkthrough.end) throw new Error(`El recorrido termina en ${steps.at(-1).node.id}, no en ${walkthrough.end}`);
  return steps;
}
