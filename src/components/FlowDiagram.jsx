import { flows } from '../data/flows.js';
import '../styles/flow-diagram.css';

const TYPE_LABELS = { start: 'INICIO', data: 'DATOS DE ENTRADA', query: 'CONSULTA', decision: 'DECISIÓN', action: 'ACCIÓN', human: 'PERSONA', result: 'RESULTADO' };
const LINE_HEIGHT = 16;
const KICKER_HEIGHT = 14;

const nodeText = node => node.lines.join(' ');

function kicker(node, rule) {
  if (node.type === 'data') return TYPE_LABELS.data;
  return `${TYPE_LABELS[node.type]} · ${node.origin === 'aacmp' ? 'AACMP' : rule}`;
}

function NodeShape({ node }) {
  const { type, cx, cy, w, h } = node;
  const x = cx - w / 2;
  const y = cy - h / 2;
  if (type === 'decision') return <polygon className="flow-shape" points={`${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`} />;
  if (type === 'data') {
    const slant = 14;
    return <polygon className="flow-shape" points={`${x + slant},${y} ${x + w},${y} ${x + w - slant},${y + h} ${x},${y + h}`} />;
  }
  if (type === 'start' || type === 'result') return <rect className="flow-shape" x={x} y={y} width={w} height={h} rx={Math.min(h / 2, 30)} />;
  if (type === 'query') return <><rect className="flow-shape" x={x} y={y} width={w} height={h} rx="3" /><rect className="flow-band" x={x} y={y} width="7" height={h} /></>;
  if (type === 'human') return <>
    <rect className="flow-shape" x={x} y={y} width={w} height={h} rx="3" />
    <rect className="flow-inner" x={x + 4} y={y + 4} width={w - 8} height={h - 8} rx="2" />
    <circle className="flow-icon" cx={x + 18} cy={y + 15} r="3.5" />
    <path className="flow-icon" d={`M${x + 12} ${y + 27}a6 6 0 0 1 12 0z`} />
  </>;
  return <rect className="flow-shape" x={x} y={y} width={w} height={h} rx="3" />;
}

function FlowNode({ node, rule }) {
  const textX = node.type === 'query' ? node.cx + 3 : node.cx;
  const top = node.cy - (KICKER_HEIGHT + node.lines.length * LINE_HEIGHT) / 2;
  return <g className={`flow-node flow-${node.type} flow-${node.origin}`}>
    <NodeShape node={node} />
    <text className="flow-kicker" x={textX} y={top + 9} textAnchor="middle">{kicker(node, rule)}</text>
    {node.lines.map((line, index) => <text className="flow-line" key={line} x={textX} y={top + KICKER_HEIGHT + 12 + index * LINE_HEIGHT} textAnchor="middle">{line}</text>)}
  </g>;
}

function FlowNote({ note }) {
  const top = note.y - (KICKER_HEIGHT + note.lines.length * LINE_HEIGHT) / 2;
  return <g className="flow-note">
    <text className="flow-kicker" x={note.x} y={top + 9} textAnchor="middle">NOTA · AACMP</text>
    {note.lines.map((line, index) => <text className="flow-line" key={line} x={note.x} y={top + KICKER_HEIGHT + 12 + index * LINE_HEIGHT} textAnchor="middle">{line}</text>)}
  </g>;
}

function EdgeLabel({ edge }) {
  const [x, y] = edge.labelAt;
  const width = edge.label.length * 6.6 + 8;
  return <g>
    <rect className="flow-label-bg" x={x - width / 2} y={y - 9} width={width} height="18" />
    <text className="flow-label" x={x} y={y + 4} textAnchor="middle">{edge.label}</text>
  </g>;
}

function Legend() {
  return <ul className="flow-legend">
    <li><svg viewBox="0 0 30 18" aria-hidden="true"><rect className="flow-swatch-dark" x="1" y="2" width="28" height="14" rx="7" /></svg><svg viewBox="0 0 30 18" aria-hidden="true"><rect className="flow-swatch-green" x="1" y="2" width="28" height="14" rx="7" /></svg>Inicio / Resultado</li>
    <li><svg viewBox="0 0 30 18" aria-hidden="true"><polygon className="flow-swatch" points="6,2 29,2 24,16 1,16" /></svg>Datos</li>
    <li><svg viewBox="0 0 30 18" aria-hidden="true"><rect className="flow-swatch" x="1" y="2" width="28" height="14" /><rect className="flow-swatch-band" x="1" y="2" width="5" height="14" /></svg>Consulta</li>
    <li><svg viewBox="0 0 30 18" aria-hidden="true"><polygon className="flow-swatch" points="15,1 29,9 15,17 1,9" /></svg>Decisión</li>
    <li><svg viewBox="0 0 30 18" aria-hidden="true"><rect className="flow-swatch-action" x="1" y="2" width="28" height="14" /></svg>Acción</li>
    <li><svg viewBox="0 0 30 18" aria-hidden="true"><rect className="flow-swatch-human" x="1" y="1" width="28" height="16" /><rect className="flow-swatch-human" x="4" y="4" width="22" height="10" /></svg>Persona (siempre AACMP)</li>
    <li><svg viewBox="0 0 30 18" aria-hidden="true"><line className="flow-swatch-rule" x1="1" y1="9" x2="29" y2="9" /></svg>Naranja o negro, rótulo R3/R4: regla original</li>
    <li><svg viewBox="0 0 30 18" aria-hidden="true"><line className="flow-swatch-aacmp" x1="1" y1="9" x2="29" y2="9" /></svg>Verde o rótulo AACMP: agregado del equipo</li>
  </ul>;
}

function TextVersion({ flow, rule }) {
  const byId = Object.fromEntries(flow.nodes.map(node => [node.id, node]));
  return <details className="flow-text">
    <summary>Leer el recorrido como texto <span aria-hidden="true">+</span></summary>
    <div className="detail-content"><ol>{flow.nodes.map(node => {
      const exits = flow.edges.filter(edge => edge.from === node.id);
      return <li key={node.id}>
        <strong>{kicker(node, rule)}:</strong> {nodeText(node)}
        {exits.length > 0 && <ul>{exits.map(edge => <li key={edge.to}>{edge.label ?? 'Sigue en'} → {nodeText(byId[edge.to])}</li>)}</ul>}
      </li>;
    })}</ol>
    {flow.notes?.map(note => <p key={nodeText(note)}><strong>Nota AACMP:</strong> {nodeText(note)}</p>)}
    </div>
  </details>;
}

export default function FlowDiagram({ proposal }) {
  const { id, rule } = proposal;
  const flow = flows[id];
  const limitCase = proposal.cases[2];
  const headingId = `${id}-diagram-title`;
  const svgTitleId = `${id}-diagram-svg-title`;
  const svgDescId = `${id}-diagram-svg-desc`;
  const arrowId = `${id}-diagram-arrow`;

  return <figure className="flow" aria-labelledby={headingId}>
    <h3 id={headingId} className="flow-title">Diagrama {rule} · {flow.title}</h3>
    <Legend />
    <div className="flow-canvas" tabIndex="0" role="region" aria-label={`Diagrama de flujo de ${rule}, desplazable en pantallas angostas`}>
      <svg className="flow-svg" viewBox={`0 0 1180 ${flow.height}`} role="img" aria-labelledby={svgTitleId} aria-describedby={svgDescId}>
        <title id={svgTitleId}>{`Diagrama de flujo de ${rule}: ${flow.title}`}</title>
        <desc id={svgDescId}>{flow.description}</desc>
        <defs>
          <marker id={arrowId} markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path className="flow-arrow-head" d="M0 0 10 5 0 10z" /></marker>
        </defs>
        {flow.edges.map(edge => <polyline className="flow-edge" key={`${edge.from}-${edge.to}`} points={edge.points.map(point => point.join(',')).join(' ')} markerEnd={`url(#${arrowId})`} />)}
        {flow.nodes.map(node => <FlowNode key={node.id} node={node} rule={rule} />)}
        {flow.notes?.map(note => <FlowNote key={nodeText(note)} note={note} />)}
        {flow.edges.filter(edge => edge.label).map(edge => <EdgeLabel key={`${edge.from}-${edge.to}`} edge={edge} />)}
      </svg>
    </div>
    <figcaption className="flow-caption">
      <div className="flow-notes">
        <div><h4>Caso límite</h4><p>{limitCase.input}</p><p><strong>Resultado:</strong> {limitCase.result}</p><p><strong>Límite de interpretación:</strong> {proposal.limit}</p></div>
        <div><h4>Excepción resuelta</h4><p>{proposal.exceptions[flow.exceptionIndex]}</p></div>
      </div>
      <p className="flow-assumptions"><strong>Supuestos AACMP:</strong> todo lo marcado en verde o como AACMP lo agrega el equipo; la sentencia no lo define.</p>
      <ul className="flow-assumption-list">{flow.assumptions.map(assumption => <li key={assumption}>{assumption}</li>)}</ul>
      <TextVersion flow={flow} rule={rule} />
    </figcaption>
  </figure>;
}
