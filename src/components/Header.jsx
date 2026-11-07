import { Icon } from './Icons.jsx';
import ThemeToggle from './ThemeToggle.jsx';

export default function Header() {
  return <header className="header wrap">
    <a className="wordmark" href="#inicio" aria-label="FUL Y VALE APP, inicio"><img className="wordmark-logo" src="/images/S05.webp" alt="" width="42" height="42" /><span>FUL Y VALE<span>APP / BÁSQUET</span></span></a>
    <nav aria-label="Navegación principal"><a href="#r3">01 · Inscripción</a><a href="#r4">02 · Pago</a></nav>
    <div className="header-actions"><ThemeToggle /><span className="team-label"><Icon name="users" size={16} />AACMP</span></div>
  </header>;
}
