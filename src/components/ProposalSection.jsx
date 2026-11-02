import FlowDiagram from './FlowDiagram.jsx';
import ProposalDetails from './ProposalDetails.jsx';

export default function ProposalSection({ proposal }) {
  return <section id={proposal.id} className="proposal wrap" aria-labelledby={`${proposal.id}-title`}>
    <div className="proposal-heading"><span className="proposal-number">{proposal.number}</span><div><p className="eyebrow">PROPUESTA {proposal.rule} / {proposal.category}</p><h2 id={`${proposal.id}-title`}>{proposal.title}</h2><p>{proposal.benefit}</p></div></div>
    <div className="original-rule"><span className="badge">REGLA ORIGINAL · {proposal.rule}</span><blockquote>{proposal.original}</blockquote></div>
    <FlowDiagram proposal={proposal} />
    <ProposalDetails proposal={proposal} />
  </section>;
}
