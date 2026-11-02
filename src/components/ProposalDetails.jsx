function Items({ items }) { return <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>; }

export default function ProposalDetails({ proposal }) {
  return <div className="details-list">
    <details><summary>Datos, condición y resultado <span aria-hidden="true">+</span></summary><div className="detail-content"><h3>Datos necesarios</h3><Items items={proposal.inputs} /><h3>Condición original</h3><p>{proposal.condition}</p><h3>Consecuencia original</h3><p>{proposal.consequence}</p><h3>Objetivo de la propuesta</h3><p>{proposal.objective}</p></div></details>
    <details><summary>Recorrido propuesto <span aria-hidden="true">+</span></summary><div className="detail-content"><p className="design-label">Las alternativas agregadas se identifican como AACMP.</p><ol>{proposal.steps.map(step => <li key={step}>{step}</li>)}</ol></div></details>
    <details><summary>Herramientas, excepciones y revisión humana <span aria-hidden="true">+</span></summary><div className="detail-content"><span className="badge badge-design">DECISIONES AACMP</span><h3>Herramientas hipotéticas</h3><Items items={proposal.tools} /><h3>Excepciones e intervención humana</h3><Items items={proposal.exceptions} /><p>La revisión humana no autoriza una confirmación automática. Estas herramientas se describen y no se conectan.</p></div></details>
    <details><summary>Casos de revisión y criterios de aceptación <span aria-hidden="true">+</span></summary><div className="detail-content">{proposal.cases.map(example => <div className="example" key={example.name}><h3>{example.name}</h3><p>{example.input}</p><p><strong>Resultado:</strong> {example.result}</p></div>)}<h3>Criterios verificables</h3><Items items={proposal.acceptance} /></div></details>
    <details><summary>Qué establece la regla y qué agrega AACMP <span aria-hidden="true">+</span></summary><div className="detail-content"><h3>Requisito original</h3><p>{proposal.consequence}</p><h3 className="design-label">Decisiones AACMP</h3><Items items={proposal.additions} /><p><strong>Límite de interpretación:</strong> {proposal.limit}</p></div></details>
  </div>;
}
