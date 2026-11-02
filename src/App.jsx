import Header from './components/Header.jsx';
import StartupIntro from './components/StartupIntro.jsx';
import ProposalSection from './components/ProposalSection.jsx';
import Footer from './components/Footer.jsx';
import { proposals } from './data/proposals.js';

export default function App() {
  return <>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <Header />
    <main id="contenido">
      <StartupIntro />
      <div className="section-heading wrap"><p className="eyebrow">EL PLAN DE JUEGO</p><h2>Dos reglas. Dos recorridos claros.</h2><p>De la solicitud al estado pendiente: qué se verifica, qué se decide y cuándo interviene una persona.</p></div>
      {proposals.map(proposal => <ProposalSection key={proposal.id} proposal={proposal} />)}
      <aside className="scope wrap"><span className="eyebrow">LÍMITES DE LA PROPUESTA</span><h2>Reservar, pagar y confirmar son pasos distintos.</h2><p>R3 no confirma automáticamente los partidos gratuitos. R4 tampoco confirma una inscripción por tener el pago confirmado. Estas reglas no definen vencimientos, cancelaciones, devoluciones ni liberación de cupos.</p></aside>
    </main>
    <Footer />
  </>;
}
