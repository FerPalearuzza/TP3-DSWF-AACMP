// Textos y vecindad derivados del grafo de flows.js. No agregan contenido ni rutas.
const TYPE_LABELS = { start: 'INICIO', data: 'DATOS DE ENTRADA', query: 'CONSULTA', decision: 'DECISIÓN', action: 'ACCIÓN', human: 'PERSONA', result: 'RESULTADO' };

export const nodeText = node => node.lines.join(' ');

export function kicker(node, rule) {
  if (node.type === 'data') return TYPE_LABELS.data;
  return `${TYPE_LABELS[node.type]} · ${node.origin === 'aacmp' ? 'AACMP' : rule}`;
}

export const originLabel = (node, rule) => node.origin === 'aacmp' ? 'Agregado por AACMP' : `Regla original ${rule}`;

// Un nodo con sus conexiones directas. No implica un camino: un nodo puede tener varias entradas.
export function sceneAround(flow, id) {
  if (!id) return null;
  const edges = flow.edges.filter(edge => edge.from === id || edge.to === id);
  return { active: id, lit: new Set(edges.flatMap(edge => [edge.from, edge.to])), edges: new Set(edges), steps: null, drawing: null };
}
