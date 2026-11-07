import { useState } from 'react';
import FlowDiagram from './FlowDiagram.jsx';
import FlowSummary from './FlowSummary.jsx';
import ProposalDetails from './ProposalDetails.jsx';
import { Icon } from './Icons.jsx';

// La vista detallada (Mariano) es la predeterminada: lleva la leyenda, el caso límite y los supuestos.
// La resumida (Dani) muestra el mismo recorrido en una sola columna, para una lectura rápida.
function ViewSwitch({ rule, view, onChange }) {
  return <div className="view-switch" role="group" aria-label={`Vista del diagrama ${rule}`}>
    <button type="button" aria-pressed={view === 'detallada'} onClick={() => onChange('detallada')}>Vista detallada</button>
    <button type="button" aria-pressed={view === 'resumida'} onClick={() => onChange('resumida')}>Vista resumida</button>
  </div>;
}

export default function ProposalSection({ proposal }) {
  const [view, setView] = useState('detallada');
  return <section id={proposal.id} className="proposal wrap" aria-labelledby={`${proposal.id}-title`}>
    <div className="proposal-heading"><span className="proposal-number">{proposal.number}</span><div><p className="eyebrow">PROPUESTA {proposal.rule} / {proposal.category}</p><h2 id={`${proposal.id}-title`}>{proposal.title}</h2><p>{proposal.benefit}</p></div></div>
    <div className="original-rule"><span className="badge"><Icon name="rule" size={15} />REGLA ORIGINAL · {proposal.rule}</span><blockquote>{proposal.original}</blockquote></div>
    <ViewSwitch rule={proposal.rule} view={view} onChange={setView} />
    {view === 'detallada' ? <FlowDiagram proposal={proposal} /> : <FlowSummary proposal={proposal} />}
    <ProposalDetails proposal={proposal} />
  </section>;
}
