import { Icon } from './Icons.jsx';
import '../styles/flow-summary.css';

const FLOWS = {
  r3: {
    title: 'Recorrido R3 · Inscripción',
    nodes: [
      { type: 'start',    label: 'Inicio', sub: 'Llega solicitud de inscripción de un usuario a un partido' },
      { type: 'process',  label: 'Consulta agéntica', sub: 'El agente obtiene: requisitos del partido, inscripciones existentes y cupos disponibles' },
      { type: 'decision', label: '¿Cumple requisitos Y solicita inscribirse Y sin inscripción previa Y hay cupo?' },
      { type: 'branch',   yes: '¡Todas las condiciones se cumplen!', no: 'Alguna condición no se cumple' },
      {
        type: 'fork',
        yes: [
          { type: 'process', label: 'Reservar cupo · Iniciar inscripción pendiente', sub: 'R3' },
          { type: 'decision', label: '¿El partido es arancelado?' },
          {
            type: 'fork',
            yes: [{ type: 'end', label: 'Mostrar pago pendiente', sub: 'R3 · Inscripción en espera de acreditación' }],
            no:  [{ type: 'end', label: 'Inscripción pendiente', sub: 'R3 · Aclaración AACMP: la sentencia no confirma la inscripción en partidos gratuitos' }],
            yesLabel: 'SÍ · Arancelado', noLabel: 'NO · Gratuito',
          },
        ],
        no: [
          { type: 'process', label: 'Informar el impedimento', sub: 'El agente informa qué condición falta (requisitos, inscripción previa o cupo) · AACMP' },
          { type: 'end',     label: 'Fin · Sin reserva ni inscripción nueva', sub: 'R3 no se aplica' },
        ],
        yesLabel: 'SÍ', noLabel: 'NO',
      },
    ],
  },
  r4: {
    title: 'Recorrido R4 · Control de pago',
    nodes: [
      { type: 'start',    label: 'Inicio', sub: 'Solicitud de revisión del estado de una inscripción · AACMP' },
      { type: 'process',  label: 'Consulta agéntica', sub: 'El agente obtiene: inscripción, modalidad del partido y estado del pago vinculado' },
      { type: 'decision', label: '¿Existe inscripción pendiente Y el partido es arancelado Y el pago NO fue confirmado?' },
      { type: 'branch',   yes: 'Las tres condiciones se cumplen', no: 'Alguna condición no se cumple' },
      {
        type: 'fork',
        yes: [
          { type: 'process', label: 'Mantener inscripción pendiente · No confirmar', sub: 'R4 · Sin confirmación automática' },
          { type: 'decision', label: '¿El usuario pide aclaración, por ejemplo con un comprobante? · AACMP' },
          {
            type: 'fork',
            yes: [
              { type: 'human', label: 'Ofrecer revisión humana', sub: 'Caso límite · AACMP · Un comprobante no reemplaza la confirmación del pago' },
              { type: 'end',   label: 'Fin · Sigue pendiente, revisión ofrecida', sub: 'AACMP' },
            ],
            no:  [{ type: 'end', label: 'Fin · Inscripción pendiente, sin confirmar', sub: 'R4 · Se comunica el estado al usuario' }],
            yesLabel: 'SÍ · Pide aclaración', noLabel: 'NO',
          },
        ],
        no: [
          { type: 'process', label: 'R4 no determina el siguiente paso', sub: 'El agente no confirma ni cancela la inscripción · AACMP' },
          { type: 'end',     label: 'Fin · Estado sin modificación', sub: 'AACMP · Fuera del alcance de R4' },
        ],
        yesLabel: 'SÍ · Se cumple R4', noLabel: 'NO',
      },
    ],
  },
};

function StartNode({ label, sub }) {
  return (
    <div className="fd-node fd-start">
      <strong>{label}</strong>
      {sub && <span>{sub}</span>}
    </div>
  );
}

function ProcessNode({ label, sub, badge }) {
  return (
    <div className="fd-node fd-process">
      <strong>{label}</strong>
      {badge && <span className="fd-badge">{badge}</span>}
      {sub && <span>{sub}</span>}
    </div>
  );
}

function DecisionNode({ label }) {
  return (
    <div className="fd-node fd-decision">
      <span className="fd-diamond" aria-hidden="true">◆</span>
      <strong>{label}</strong>
    </div>
  );
}

function HumanNode({ label, sub }) {
  return (
    <div className="fd-node fd-human">
      <span className="fd-human-icon" aria-hidden="true"><Icon name="users" size={20} /></span>
      <div>
        <strong>{label}</strong>
        {sub && <span>{sub}</span>}
      </div>
    </div>
  );
}

function EndNode({ label, sub }) {
  return (
    <div className="fd-node fd-end">
      <strong>{label}</strong>
      {sub && <span>{sub}</span>}
    </div>
  );
}

function Arrow({ label } = {}) {
  return (
    <div className="fd-arrow">
      {label && <span className="fd-arrow-label">{label}</span>}
      <span className="fd-arrow-line" aria-hidden="true">↓</span>
    </div>
  );
}

function renderNode(node, idx) {
  const key = idx;
  if (node.type === 'start')    return <StartNode    key={key} {...node} />;
  if (node.type === 'process')  return <ProcessNode  key={key} {...node} />;
  if (node.type === 'decision') return <DecisionNode key={key} {...node} />;
  if (node.type === 'human')    return <HumanNode    key={key} {...node} />;
  if (node.type === 'end')      return <EndNode      key={key} {...node} />;
  if (node.type === 'fork' || node.type === 'subfork') {
    return <SubFork key={key} {...node} />;
  }
  return null;
}

function SubFork({ yes, no, yesLabel, noLabel }) {
  return (
    <div className="fd-subfork">
      <div className="fd-subfork-branch fd-subfork-yes">
        <Arrow label={yesLabel} />
        {yes.map((n, i) => (
          <span key={i}>
            {renderNode(n, i)}
            {i < yes.length - 1 && <Arrow />}
          </span>
        ))}
      </div>
      <div className="fd-subfork-branch fd-subfork-no">
        <Arrow label={noLabel} />
        {no.map((n, i) => (
          <span key={i}>
            {renderNode(n, i)}
            {i < no.length - 1 && <Arrow />}
          </span>
        ))}
      </div>
    </div>
  );
}

function Fork({ yes, no, yesLabel, noLabel }) {
  return (
    <div className="fd-fork">
      <div className="fd-fork-branch fd-fork-yes">
        <Arrow label={yesLabel} />
        {yes.map((n, i) => {
          const next = yes[i + 1];
          const needsArrow = i < yes.length - 1 && next?.type !== 'fork' && next?.type !== 'subfork';
          return (
            <span key={i}>
              {renderNode(n, i)}
              {needsArrow && <Arrow />}
            </span>
          );
        })}
      </div>
      <div className="fd-fork-branch fd-fork-no">
        <Arrow label={noLabel} />
        {no.map((n, i) => {
          const next = no[i + 1];
          const needsArrow = i < no.length - 1 && next?.type !== 'fork' && next?.type !== 'subfork';
          return (
            <span key={i}>
              {renderNode(n, i)}
              {needsArrow && <Arrow />}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function renderFlow(nodes) {
  return nodes.map((node, idx) => {
    if (node.type === 'branch') return null; // labels handled inside fork
    if (node.type === 'fork') {
      return (
        <span key={idx}>
          <Fork yes={node.yes} no={node.no} yesLabel={node.yesLabel} noLabel={node.noLabel} />
        </span>
      );
    }
    const isLast = idx === nodes.length - 1;
    const next = nodes[idx + 1];
    const needsArrow = !isLast && next?.type !== 'branch' && next?.type !== 'fork';
    return (
      <span key={idx}>
        {renderNode(node, idx)}
        {needsArrow && <Arrow />}
        {next?.type === 'fork' && <Arrow label={nodes[idx + 1 - 1]?.yes ? undefined : undefined} />}
      </span>
    );
  });
}

export default function FlowSummary({ proposal }) {
  const flow = FLOWS[proposal.id];
  if (!flow) return null;

  return (
    <figure className="fd-figure" aria-labelledby={`${proposal.id}-diagram-title`}>
      <figcaption>
        <h3 id={`${proposal.id}-diagram-title`}>{flow.title}</h3>
        <p className="fd-caption-note">
          Las acciones marcadas como <strong>AACMP</strong> son decisiones de diseño del grupo; las marcadas con la regla (<strong>{proposal.rule}</strong>) se derivan directamente de la sentencia original.
        </p>
      </figcaption>
      <div className="fd-flow" role="img" aria-label={`Diagrama de flujo: ${flow.title}`}>
        {renderFlow(flow.nodes)}
      </div>
    </figure>
  );
}
