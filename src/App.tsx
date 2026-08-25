import { useEffect, useRef, useState, type PointerEvent } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import markLogo from './logo.png'
import fullLogo from './logo-smartlink-cuadrado.jpg'
import homeScreen from './smartlink-home.webp'
import sensorsScreen from './smartlink-sensors.webp'
import wellsScreen from './smartlink-wells.webp'
import faultsScreen from './smartlink-faults.webp'
import simulatorScreen from './smartlink-simulator.webp'
import heroOilfield from './hero-oilfield.webp'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

const features = [
  ['01', 'Supervisión SCADA', 'Smart Link recibe desde la RTU presión, temperatura, carga, caudal, vibración, desplazamiento, gas y RPM en tiempo real.'],
  ['02', 'Diagnóstico de fallas', 'Lee cartas dinagráficas reales y compara la curva de superficie con el comportamiento de fondo para reconocer firmas anormales.'],
  ['03', 'Control y respuesta', 'Genera alarmas, conserva el historial y permite encender, apagar o ajustar la velocidad del equipo desde un mismo entorno.'],
]
const productScreens = [
  { label: 'Inicio', kicker: 'Visión general', description: 'Producción, estado del campo e indicadores operativos disponibles desde el acceso principal.', image: homeScreen, hotspots: [[54, 28, 'Estado del campo'], [78, 73, 'Producción en vivo']] },
  { label: 'Sensores', kicker: 'Telemetría del pozo', description: 'Variables del pozo y carta dinagráfica recibidas por Smart Link en una vista sincronizada.', image: sensorsScreen, hotspots: [[69, 30, 'Lectura de sensores'], [63, 72, 'Carta recibida']] },
  { label: 'Pozos', kicker: 'Gestión de activos', description: 'Inventario de pozos, producción, ubicación y acceso directo al detalle de sus sensores.', image: wellsScreen, hotspots: [[42, 37, 'Estado operativo'], [75, 62, 'Acceso al pozo']] },
  { label: 'Diagnóstico', kicker: 'Catálogo de fallas', description: 'Firmas dinagráficas documentadas para identificar condiciones y emitir alarmas accionables.', image: faultsScreen, hotspots: [[44, 32, 'Firma dinagráfica'], [72, 65, 'Falla identificada']] },
  { label: 'Ground truth', kicker: 'Simulador de campo', description: 'Gemelos digitales para reproducir fallas, validar respuestas y contrastar superficie contra fondo.', image: simulatorScreen, hotspots: [[39, 33, 'Variables simuladas'], [72, 69, 'Ground truth']] },
]
const brochurePages = [
  ['CONNECTED OILFIELD', 'Control que llega más profundo.'],
  ['SCADA CENTRALIZADO', 'Un sistema para supervisar todos los pozos.'],
  ['TELEMETRÍA', 'Cada sensor conectado a una lectura confiable.'],
  ['OPERACIÓN EN VIVO', 'Estado, tendencias y producción en tiempo real.'],
  ['CARTAS DINAGRÁFICAS', 'La firma real del sistema de levantamiento.'],
  ['DETECCIÓN DE FALLAS', 'El comportamiento anormal se convierte en diagnóstico.'],
  ['ALARMAS', 'Cada condición crítica llega a quien debe actuar.'],
  ['CONTROL REMOTO', 'Encender, apagar y regular desde Smart Link.'],
  ['GEMELO DIGITAL', 'Una réplica funcional para explorar el comportamiento.'],
  ['SIMULACIÓN', 'Presión, carga, temperatura, caudal y fallas eléctricas.'],
  ['GROUND TRUTH', 'Superficie y fondo comparados sobre una misma curva.'],
  ['TRAZABILIDAD', 'Eventos e historial para decisiones verificables.'],
  ['SMART LINK CONTROL', 'Monitorear, comprender, anticipar y controlar.'],
]

function App() {
  const [page, setPage] = useState(1)
  const [activeScreen, setActiveScreen] = useState(0)
  const [screenDirection, setScreenDirection] = useState<'next' | 'prev'>('next')
  const [screenExpanded, setScreenExpanded] = useState(false)
  const [bookPaused, setBookPaused] = useState(false)
  const [bookHover, setBookHover] = useState(false)
  const [bookInView, setBookInView] = useState(false)
  const [bookDirection, setBookDirection] = useState<'next' | 'prev'>('next')
  const brochureRef = useRef<HTMLElement>(null)
  const swipeStart = useRef<number | null>(null)
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
    const syncScroll = () => ScrollTrigger.update()
    lenis.on('scroll', syncScroll)
    let rafId = 0
    const raf = (time: number) => { lenis.raf(time); rafId = requestAnimationFrame(raf) }
    rafId = requestAnimationFrame(raf)
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => gsap.from(element, { y: 46, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 84%' } }))
      gsap.to('.story-line span', { height: '100%', ease: 'none', scrollTrigger: { trigger: '.story-section', start: 'top 70%', end: 'bottom 65%', scrub: true } })
    })
    return () => { cancelAnimationFrame(rafId); lenis.off('scroll', syncScroll); lenis.destroy(); ctx.revert() }
  }, [])

  useEffect(() => {
    const section = brochureRef.current
    if (!section) return
    const observer = new IntersectionObserver(([entry]) => setBookInView(entry.isIntersecting), { threshold: 0.45 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (bookPaused || bookHover || !bookInView || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => {
      setBookDirection('next')
      setPage((current) => current === brochurePages.length ? 1 : current + 1)
    }, 4200)
    return () => window.clearInterval(timer)
  }, [bookPaused, bookHover, bookInView])

  useEffect(() => {
    if (!screenExpanded) return
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setScreenExpanded(false) }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', closeOnEscape) }
  }, [screenExpanded])

  const changeScreen = (nextScreen: number, direction?: 'next' | 'prev') => {
    const normalized = (nextScreen + productScreens.length) % productScreens.length
    setScreenDirection(direction ?? (normalized < activeScreen ? 'prev' : 'next'))
    setActiveScreen(normalized)
  }

  const finishSwipe = (clientX: number) => {
    if (swipeStart.current === null) return
    const distance = clientX - swipeStart.current
    swipeStart.current = null
    if (Math.abs(distance) < 45) return
    changeScreen(activeScreen + (distance < 0 ? 1 : -1), distance < 0 ? 'next' : 'prev')
  }

  const changePage = (nextPage: number) => {
    const normalized = Math.min(brochurePages.length, Math.max(1, nextPage))
    setBookDirection(normalized < page ? 'prev' : 'next')
    setPage(normalized)
  }

  const moveBook = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -7
    event.currentTarget.style.setProperty('--book-rotate-y', `${x}deg`)
    event.currentTarget.style.setProperty('--book-rotate-x', `${y}deg`)
  }

  const resetBook = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--book-rotate-y', '0deg')
    event.currentTarget.style.setProperty('--book-rotate-x', '0deg')
  }

  return <main>
    <nav className="nav-shell">
      <a className="brand" href="#top" aria-label="Smart Link Control — inicio"><img className="brand-logo" src={markLogo} alt="" /><span>SMART LINK <b>CONTROL</b><small>by Lift Energy Group</small></span></a>
      <div className="nav-links"><a href="#system">Sistema</a><a href="#twin">Gemelo digital</a><a href="#platform">Plataforma</a><a href="#brochure">Brochure</a></div>
      <div className="nav-actions"><a className="nav-doc" href="/smart-link-control-presentacion.pdf" target="_blank" rel="noreferrer">Diapositivas <span>↗</span></a><a className="status-pill" href="https://smartlink.lift.energy/home" target="_blank" rel="noreferrer"><span /> Plataforma en vivo ↗</a></div>
    </nav>

    <section className="hero-section" id="top">
      <div className="hero-photo" aria-hidden="true"><img src={heroOilfield} alt="" fetchPriority="high" /></div>
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-copy"><p className="eyebrow">SMART LINK CONTROL · LIFT ENERGY GROUP</p><h1>Control inteligente<br />para <em>pozos petroleros.</em></h1><p className="hero-intro">Sistema SCADA e IoT para monitorear la operación en tiempo real, interpretar cartas dinagráficas, detectar fallas, gestionar alarmas y controlar cada pozo desde una sola plataforma.</p><div className="hero-capabilities"><span>SCADA</span><span>DinAI</span><span>Gemelo digital</span></div><div className="hero-actions"><a className="button button-primary" href="#system">Conocer el sistema <span>↘</span></a><a className="hero-secondary" href="/smart-link-control-brochure.pdf" target="_blank" rel="noreferrer">Ver brochure ↗</a></div></div>
      <div className="scroll-note"><span /> SCROLL TO DESCEND</div>
    </section>

    <section className="story-section" id="system"><div className="story-line"><span /></div><p className="eyebrow" data-reveal>01 / DEL SENSOR A LA DECISIÓN</p><div className="story-statement" data-reveal><h2>El control empieza<br />por <em>comprender.</em></h2><p>Smart Link Control integra adquisición SCADA, análisis dinagráfico, alarmas y mando remoto. No se limita a mostrar datos: convierte el comportamiento del pozo en información para actuar antes de una parada.</p></div><div className="feature-track">{features.map(([n, title, copy]) => <article key={n} data-reveal><b>{n}</b><div className="feature-icon"><i /><i /><i /></div><h3>{title}</h3><p>{copy}</p></article>)}</div></section>

    <section className="twin-section" id="twin">
      <div className="twin-copy" data-reveal><p className="eyebrow eyebrow-light">02 / CARTAS + GEMELO DIGITAL</p><h2>La falla deja<br />una <em>firma.</em></h2><p>Smart Link lee cartas dinagráficas reales, compara la señal de superficie enviada por la RTU con el ground truth de fondo y relaciona cada forma con condiciones conocidas del sistema de bombeo.</p><div className="twin-metrics"><div><b>24/7</b><span>lectura operacional</span></div><div><b>2×</b><span>superficie + fondo</span></div></div></div>
      <div className="chart-card" data-reveal><div className="chart-toolbar"><div><span className="live-dot" /> CARTA RECIBIDA</div><span>POZO_04 / RTU</span><button aria-label="Expandir gráfica">⌗</button></div><div className="chart-title"><div><small>ANÁLISIS DINAGRÁFICO</small><strong>Comparación de superficie y fondo</strong></div><span>Diagnóstico activo</span></div><div className="chart-wrap"><svg viewBox="0 0 720 420" role="img" aria-label="Curvas dinagráficas de superficie y ground truth"><defs><linearGradient id="fillGreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#68b938" stopOpacity=".18"/><stop offset="1" stopColor="#68b938" stopOpacity="0"/></linearGradient></defs><path className="grid-lines" d="M55 25H695M55 95H695M55 165H695M55 235H695M55 305H695M55 375H695M55 25V375M183 25V375M311 25V375M439 25V375M567 25V375M695 25V375" /><path className="curve-fill" d="M60 311C110 291 117 169 191 120S348 96 421 131s98 125 155 148 79 29 114 18V376H60Z" /><path className="curve curve-green" d="M60 311C110 291 117 169 191 120S348 96 421 131s98 125 155 148 79 29 114 18" /><path className="curve curve-white" d="M60 331C111 312 126 184 197 139s148-25 220 9 104 125 161 146 77 24 112 16" /><circle cx="421" cy="131" r="6" fill="#68b938"/><circle cx="421" cy="131" r="12" fill="none" stroke="#68b938" opacity=".4"/></svg><span className="axis axis-y">CARGA / LBF</span><span className="axis axis-x">POSICIÓN / IN</span></div><div className="chart-legend"><span><i className="legend-green" /> Fondo · ground truth</span><span><i className="legend-white" /> Superficie · RTU</span><strong>FIRMA COMPARADA</strong></div></div>
      <div className="twin-proof" data-reveal><div className="twin-proof-copy"><p className="eyebrow eyebrow-light">GEMELO DESARROLLADO EN SMART LINK</p><h3>Probar la falla<br />antes de vivirla.</h3><p>El gemelo digital reproduce el comportamiento del balancín y permite inyectar escenarios controlados: caudal bajo, sobrepresión, temperatura alta, variaciones de carga, inclinación, corriente, voltaje, frecuencia, llenado de bomba e interferencia de gas.</p><div className="fault-tags"><span>Sobrepresión</span><span>Carga alta/baja</span><span>Temperatura</span><span>Interferencia de gas</span><span>Fallas eléctricas</span></div></div><div className="twin-proof-image"><div className="proof-bar"><span><i /> SIMULADOR BALANCÍN</span><b>GROUND TRUTH · EN LÍNEA</b></div><img src={simulatorScreen} alt="Gemelo digital real de Smart Link simulando pozos, variables y cartas dinagráficas" /></div></div>
    </section>

    <section className="platform-section" id="platform">
      <div className="platform-heading" data-reveal><div><p className="eyebrow">03 / SUPERVISIÓN Y CONTROL</p><h2>Todo el campo.<br /><em>Una interfaz.</em></h2></div><p>Desde Smart Link se consultan los pozos y sus sensores, se reciben alarmas, se revisa el historial y se envían comandos de encendido, apagado y velocidad al equipo.</p></div>
      <div className="product-stage" data-reveal>
        <div className="screen-tabs" role="tablist" aria-label="Vistas de Smart Link Control">{productScreens.map((screen, index) => <button key={screen.label} className={index === activeScreen ? 'active' : ''} onClick={() => changeScreen(index)} role="tab" aria-selected={index === activeScreen}><small>0{index + 1}</small><span>{screen.label}</span></button>)}</div>
        <div className="screen-progress" aria-hidden="true"><i style={{ width: `${((activeScreen + 1) / productScreens.length) * 100}%` }} /></div>
        <div className="screen-window" onPointerDown={(event) => { if (event.pointerType === 'touch') swipeStart.current = event.clientX }} onPointerUp={(event) => { if (event.pointerType === 'touch') finishSwipe(event.clientX) }} onPointerCancel={() => { swipeStart.current = null }}><div className="browser-bar"><i/><i/><i/><span>smartlink.lift.energy / {productScreens[activeScreen].label.toLowerCase()}</span><b>LIVE</b></div><div className="screen-viewport"><button className="screen-image-button" onClick={() => setScreenExpanded(true)} aria-label={`Ampliar vista ${productScreens[activeScreen].label}`}><img className={`screen-image screen-${screenDirection}`} key={productScreens[activeScreen].image} src={productScreens[activeScreen].image} alt={`Smart Link Control — ${productScreens[activeScreen].kicker}`} /></button><div className={`screen-hotspots screen-${screenDirection}`} key={`hotspots-${activeScreen}`}>{productScreens[activeScreen].hotspots.map(([x, y, label]) => <button key={label} style={{ left: `${x}%`, top: `${y}%` }} onClick={() => setScreenExpanded(true)} aria-label={`${label}. Ampliar imagen`}><i /><span>{label}</span></button>)}</div><span className="swipe-hint">DESLIZA PARA EXPLORAR</span></div></div>
        <div className="screen-caption"><span>{productScreens[activeScreen].kicker}</span><p>{productScreens[activeScreen].description}</p><b>{String(activeScreen + 1).padStart(2, '0')} / {String(productScreens.length).padStart(2, '0')}</b></div>
      </div>
    </section>

    {screenExpanded && <div className="screen-lightbox" role="dialog" aria-modal="true" aria-label={`Vista ampliada de ${productScreens[activeScreen].label}`} onClick={() => setScreenExpanded(false)}><div onClick={(event) => event.stopPropagation()}><header><span>{String(activeScreen + 1).padStart(2, '0')} / {String(productScreens.length).padStart(2, '0')} · {productScreens[activeScreen].kicker}</span><button onClick={() => setScreenExpanded(false)} aria-label="Cerrar imagen ampliada">×</button></header><img src={productScreens[activeScreen].image} alt={`Vista ampliada de Smart Link Control — ${productScreens[activeScreen].kicker}`} /><nav><button onClick={() => changeScreen(activeScreen - 1, 'prev')} aria-label="Vista anterior">←</button><strong>{productScreens[activeScreen].label}</strong><button onClick={() => changeScreen(activeScreen + 1, 'next')} aria-label="Vista siguiente">→</button></nav></div></div>}

    <section className="brochure-section" id="brochure" ref={brochureRef}>
      <div className="brochure-signal" aria-hidden="true"><i /><span /></div>
      <div className="brochure-copy" data-reveal>
        <p className="eyebrow eyebrow-light">04 / CAPACIDADES DEL SISTEMA</p>
        <h2>Una operación.<br />Todas sus capas.</h2>
        <p>Trece capítulos sintetizan cómo Smart Link conecta el monitoreo SCADA con diagnóstico, alarmas, control remoto y simulación.</p>
        <div className="chapter-now"><small>CAPÍTULO ACTIVO</small><strong>{brochurePages[page - 1][0]}</strong></div>
        <div className="page-controls">
          <button onClick={() => changePage(page === 1 ? brochurePages.length : page - 1)} aria-label="Página anterior">←</button>
          <span><b>{String(page).padStart(2, '0')}</b> / {brochurePages.length}</span>
          <button className="play-control" onClick={() => setBookPaused((paused) => !paused)} aria-label={bookPaused ? 'Reanudar avance automático' : 'Pausar avance automático'}>{bookPaused ? '▶' : 'Ⅱ'}</button>
          <button onClick={() => changePage(page === brochurePages.length ? 1 : page + 1)} aria-label="Página siguiente">→</button>
        </div>
        <div className="chapter-rail" aria-label="Seleccionar capítulo">{brochurePages.map((chapter, index) => <button key={chapter[0]} className={page === index + 1 ? 'active' : ''} onClick={() => changePage(index + 1)} aria-label={`Capítulo ${index + 1}: ${chapter[0]}`}><i /></button>)}</div>
        <div className={`autoplay-meter ${bookPaused || bookHover ? 'paused' : ''}`}><i key={page} /></div>
      </div>
      <div className="book-scene" data-reveal onPointerEnter={() => setBookHover(true)} onPointerMove={moveBook} onPointerLeave={(event) => { resetBook(event); setBookHover(false) }}>
        <div className="book-halo" aria-hidden="true"><i /><i /><i /></div>
        <div className="book">
          <div className="book-page page-back" /><div className="book-page page-middle" />
          <div className={`book-page page-front turn-${bookDirection}`} key={page}>
            <div className="page-top"><span>SMART LINK CONTROL</span><b>{String(page).padStart(2, '0')}</b></div>
            <div className="page-graphic"><i /><i /><i />{page === 1 ? <img src={fullLogo} alt="Smart Link Control by Lift Energy Group" /> : <img className="page-mark" src={markLogo} alt="" />}</div>
            <div className="page-copy"><small>{brochurePages[page - 1][0]}</small><strong>{brochurePages[page - 1][1]}</strong></div>
            <div className="page-scan" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>

    <section className="closing-section"><p data-reveal>Monitorear · detectar · simular · controlar</p><h2 data-reveal>El pozo ya está<br /><em>hablando.</em></h2><a className="round-link" href="https://smartlink.lift.energy/home" target="_blank" rel="noreferrer">Ver Smart Link <span>↗</span></a></section>
    <footer id="contact">
      <div className="footer-orbit" aria-hidden="true"><i /><i /><span>ϟ</span></div>
      <div className="footer-cta" data-reveal>
        <p className="eyebrow eyebrow-light">SMART LINK CONTROL / OPERACIÓN CONECTADA</p>
        <h2>Conecta el pozo.<br /><em>Controla la operación.</em></h2>
        <div className="footer-actions">
          <a className="footer-button footer-button-green" href="https://smartlink.lift.energy/home" target="_blank" rel="noreferrer"><span>Entrar a Smart Link</span><b>↗</b></a>
          <a className="footer-button footer-button-outline" href="/smart-link-control-brochure.pdf" target="_blank" rel="noreferrer"><span>Ver brochure<small>PDF · 7 PÁGINAS</small></span><b>↗</b></a>
          <a className="footer-button footer-button-outline" href="/smart-link-control-presentacion.pdf" target="_blank" rel="noreferrer"><span>Ver diapositivas<small>PDF · 13 PÁGINAS</small></span><b>↗</b></a>
        </div>
      </div>
      <div className="footer-directory">
        <div className="footer-brand"><img className="brand-logo" src={markLogo} alt="" /><span>SMART LINK <b>CONTROL</b><small>by Lift Energy Group</small></span></div>
        <div className="footer-links">
          <div><small>EXPLORAR</small><a href="#system">Sistema</a><a href="#twin">Gemelo digital</a><a href="#platform">Plataforma</a></div>
          <div><small>DOCUMENTACIÓN</small><a href="/smart-link-control-brochure.pdf" target="_blank" rel="noreferrer">Brochure PDF ↗</a><a href="/smart-link-control-presentacion.pdf" target="_blank" rel="noreferrer">Diapositivas PDF ↗</a><a href="#brochure">Capacidades</a></div>
          <div><small>CONTACTO</small><a href="https://lift.energy/" target="_blank" rel="noreferrer">www.lift.energy ↗</a><a href="tel:+584246061052">0424-6061052</a></div>
        </div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} LIFT ENERGY GROUP</span><span>SCADA · DINAI · DIGITAL TWIN</span><span>OILFIELD INTELLIGENCE / CONNECTED</span></div>
    </footer>
  </main>
}

export default App
