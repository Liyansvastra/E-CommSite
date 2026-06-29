import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const brand = "LIYAN'S VASTRA";
const assetPath = (path) => `${import.meta.env.BASE_URL}${path}`;
const logo = assetPath('logo.png');
const background = assetPath('images/background.jpg');
const lifestyleImage = assetPath('images/background.jpg');

const navItems = ['Home', 'About', 'Services', 'Contact'];

const businessInfo = [
  ['Business Name:', "LIYAN'S VASTRA"],
  ['Business Type:', 'Proprietorship'],
  ['Proprietor:', 'Kishoreraaj Robert'],
  ['Address:', 'No 53 G1 Sudha Madhuri Homes, Nalluruhalli Main Road, Opp. HP Petrol Pump, DNA Anantha Layout'],
  ['City:', 'Bengaluru'],
  ['PIN Code:', '560066'],
  ['State:', 'Karnataka'],
  ['Phone:', '+91 7871357999'],
  ['Email:', 'liyansvastra@gmail.com'],
  ['GST Number:', '29AXTPK6839P1Z5'],
];

function goTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function Header({ activePage, setActivePage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const changePage = (page) => {
    setActivePage(page);
    setMenuOpen(false);
    goTop();
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="logo-button" onClick={() => changePage('Home')} aria-label="Open home page">
          <img src={logo} alt={brand} />
        </button>
        <button
          className={menuOpen ? 'menu-toggle is-open' : 'menu-toggle'}
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav
          id="primary-navigation"
          className={menuOpen ? 'main-nav is-open' : 'main-nav'}
          aria-label="Primary navigation"
        >
          {navItems.map((item) => (
            <button
              key={item}
              className={activePage === item ? 'active' : ''}
              onClick={() => changePage(item)}
            >
              {item}
            </button>
          ))}
          <button className="mobile-nav-cta" onClick={() => changePage('Contact')}>Get In Touch</button>
        </nav>
        <button className="outline-cta" onClick={() => changePage('Contact')}>Get In Touch</button>
      </div>
    </header>
  );
}

function Eyebrow({ children }) {
  return (
    <div className="eyebrow">
      <span />
      <strong>{children}</strong>
      <span />
    </div>
  );
}

function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="section-title">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

function GoldIcon({ children }) {
  return <div className="gold-icon">{children}</div>;
}

function Stat({ value, label }) {
  return (
    <div className="stat">
      <strong>{value}</strong>
      <small>{label}</small>
    </div>
  );
}

function FeatureCard({ title, text, icon, centered = false }) {
  return (
    <article className={centered ? 'feature-card centered' : 'feature-card'}>
      <GoldIcon>{icon}</GoldIcon>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function HomePage({ setActivePage }) {
  return (
    <>
      <section className="home-hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <h1><span>{brand}</span><i /> Elevated Elegance in Every Thread</h1>
            <p>
              We craft premium apparel for the discerning individual. From meticulously sourced
              fabrics to innovative designs, every piece reflects our commitment to excellence.
            </p>
            <div className="button-row">
              <button className="gold-button" onClick={() => setActivePage('About')}>Our Story</button>
              <button className="dark-button" onClick={() => setActivePage('Contact')}>Get In Touch</button>
            </div>
            <div className="hero-stats">
              <Stat value="100%" label="Premium Fabrics" />
              <Stat value="Ethical" label="Sourcing" />
              <Stat value="10+" label="Years Heritage" />
            </div>
          </div>
          <div className="hero-logo-orbit" aria-hidden="true">
            <div><img src={logo} alt="" /></div>
          </div>
        </div>
        <div className="scroll-mark">Scroll</div>
      </section>

      <section className="container split-story">
        <div className="story-image">
          <img src={lifestyleImage} alt="Family apparel lifestyle" />
          <div className="mini-logo"><img src={logo} alt="" /></div>
        </div>
        <div className="story-copy">
          <Eyebrow>Our Story</Eyebrow>
          <h2>About {brand}</h2>
          <p>
            {brand} is a premium textile and apparel brand born from a passion for quality
            craftsmanship and timeless style.
          </p>
          <p>
            Founded as a proprietorship, we take pride in our hands-on approach to quality. Every
            product is carefully sourced and crafted using premium cotton fabrics.
          </p>
          <p>Our tagline, <b>"Elevated Elegance"</b>, reflects our commitment to everyday premium fashion.</p>
          <div className="mini-stat-grid">
            <Stat value="220 GSM" label="Premium Weight Fabric" />
            <Stat value="100%" label="Pure Cotton" />
            <Stat value="GST" label="Registered" />
            <Stat value="Pan India" label="Delivery" />
          </div>
        </div>
      </section>

      <WhyChoose />
    </>
  );
}

function WhyChoose() {
  const cards = [
    ['Premium Fabric Quality', '100% premium cotton with superior GSM for lasting comfort and durability.', '☆'],
    ['Comfortable Fit', 'Thoughtfully designed cuts that flatter all body types with ease.', '◎'],
    ['Unisex Designs', 'Versatile styles crafted to look great on everyone.', '◇'],
    ['Secure Payments', 'Safe checkout with multiple payment options.', '▭'],
    ['Easy Returns', 'Hassle-free returns and exchanges within 7 days of delivery.', '↻'],
    ['Fast Shipping', 'Delivered to your doorstep across India within 3-7 business days.', '▱'],
  ];

  return (
    <section className="section-block">
      <div className="container">
        <SectionTitle
          eyebrow="Our Promise"
          title={`Why Choose ${brand}?`}
          subtitle="We are committed to delivering excellence in every stitch, every thread, and every experience."
        />
        <div className="card-grid">
          {cards.map(([title, text, icon]) => <FeatureCard key={title} title={title} text={text} icon={icon} />)}
        </div>
      </div>
    </section>
  );
}

function PageHero({ eyebrow, title, subtitle }) {
  return (
    <section className="page-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.72), rgba(0,0,0,.84)), url(${background})` }}>
      <div className="container page-hero-inner">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <div className="ghost-title">{title}</div>
      </div>
    </section>
  );
}

function AboutPage({ setActivePage }) {
  return (
    <>
      <PageHero eyebrow="Our Story" title={`About ${brand}`} subtitle="A premium textile brand born from passion for quality and timeless style." />
      <section className="section-block journey-section">
        <div className="container narrow">
          <SectionTitle eyebrow="Who We Are" title="Our Journey" />
          <div className="journey-copy">
            <p>{brand} was born from a simple belief: everyone deserves to wear clothing that makes them feel their best.</p>
            <p>Every product is carefully crafted using premium cotton fabrics with superior GSM weights.</p>
            <p>As a GST-registered proprietorship, we operate with full transparency and commitment to our customers.</p>
          </div>
          <div className="divider" />
          <div className="metric-row">
            <Stat value="100%" label="Premium Cotton" />
            <Stat value="220 GSM" label="Fabric Weight" />
            <Stat value="Pan India" label="Delivery" />
            <Stat value="GST" label="Registered" />
          </div>
        </div>
      </section>
      <Values />
      <BusinessInformation />
      <section className="work-together">
        <h2>Let's Work Together</h2>
        <p>Partner with us for premium apparel solutions tailored to your needs.</p>
        <button className="gold-button" onClick={() => setActivePage('Contact')}>Get In Touch</button>
      </section>
    </>
  );
}

function Values() {
  const values = [
    ['Quality First', 'Premium fabrics and superior craftsmanship in every product we create.', '♙'],
    ['Customer Care', 'Your satisfaction is our priority from purchase to delivery and beyond.', '♡'],
    ['Transparency', 'Honest pricing, clear policies, and open communication at every step.', '◇'],
    ['Inclusivity', 'Unisex designs crafted to flatter and fit people of all body types.', '◎'],
  ];
  return (
    <section className="section-block values-section">
      <div className="container">
        <SectionTitle eyebrow="What We Stand For" title="Our Values" subtitle={`The principles that guide everything we do at ${brand}.`} />
        <div className="value-grid">
          {values.map(([title, text, icon]) => <FeatureCard key={title} title={title} text={text} icon={icon} centered />)}
        </div>
      </div>
    </section>
  );
}

function BusinessInformation() {
  return (
    <section className="section-block business-section">
      <div className="container">
        <SectionTitle eyebrow="Registered Details" title="Business Information" subtitle="Registered business details for your trust and transparency." />
        <div className="business-card">
          <img src={logo} alt="" />
          {businessInfo.map(([label, value]) => (
            <div className="business-row" key={label}><strong>{label}</strong><span>{value}</span></div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesPage() {
  const services = [
    ['Custom Design', 'Tailored apparel solutions for corporate clients and individuals.', '♧'],
    ['Sustainable', 'Eco-conscious production using ethical manufacturing practices.', '♢'],
    ['Expert Team', 'Dedicated professionals with decades of textile expertise.', '◎'],
    ['Quality First', 'Rigorous quality control at every stage of production.', '♙'],
    ['Fast Delivery', 'Efficient turnaround without compromising on quality.', '↯'],
    ['Customer Care', 'Exceptional support from inquiry through delivery.', '♡'],
  ];
  return (
    <section className="section-block services-page">
      <div className="container">
        <SectionTitle eyebrow="What We Offer" title="Our Services" subtitle="Comprehensive apparel solutions designed to meet your needs" />
        <div className="card-grid">
          {services.map(([title, text, icon]) => <FeatureCard key={title} title={title} text={text} icon={icon} />)}
        </div>
      </div>
    </section>
  );
}

function ContactPage() {
  const contacts = [
    ['Our Address', "LIYAN'S VASTRA\nNo 53 G1 Sudha Madhuri Homes\nNalluruhalli Main Road\nOpp. HP Petrol Pump, DNA Anantha Layout\nBengaluru - 560066, Karnataka", '⌖'],
    ['Phone', '+91 7871357999\nMon - Sat: 10 AM - 6 PM IST', '☏'],
    ['Email', 'liyansvastra@gmail.com\nWe reply within 24 hours', '✉'],
    ['Business Hours', 'Monday - Saturday\n10:00 AM - 6:00 PM IST', '◷'],
  ];
  return (
    <section className="section-block contact-page">
      <div className="container contact-grid">
        <div>
          <h2 className="contact-heading">Contact Information</h2>
          <div className="contact-list">
            {contacts.map(([title, text, icon]) => (
              <article className="contact-card" key={title}><GoldIcon>{icon}</GoldIcon><div><h3>{title}</h3><p>{text}</p></div></article>
            ))}
          </div>
        </div>
        <form className="message-card" onSubmit={(event) => event.preventDefault()}>
          <h2>Send Us a Message</h2>
          <div className="form-two">
            <label>Your Name *<input required placeholder="Full name" /></label>
            <label>Email Address *<input required type="email" placeholder="your@email.com" /></label>
          </div>
          <label>Subject<input placeholder="What is your query about?" /></label>
          <label>Message *<textarea required rows="7" placeholder="Write your message here..." /></label>
          <button className="gold-button" type="submit">Send Message</button>
        </form>
      </div>
    </section>
  );
}

function Footer({ setActivePage }) {
  const linkClick = (page) => {
    setActivePage(page);
    goTop();
  };
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <img src={logo} alt={brand} />
          <p>Premium quality textiles crafted for everyday elegance. Where comfort meets style in every thread.</p>
          <div className="footer-contact">
            <p><b>{brand}</b><br />Proprietor: Kishoreraaj Robert<br />No 53 G1 Sudha Madhuri Homes<br />Bengaluru - 560066, Karnataka</p>
            <p>+91 7871357999</p>
            <p>liyansvastra@gmail.com</p>
            <p>GST: 29AXTPK6839P1Z5</p>
          </div>
        </div>
        <div className="footer-column">
          <h3>Company</h3>
          <button onClick={() => linkClick('About')}>About Us</button>
          <button onClick={() => linkClick('Contact')}>Contact Us</button>
          <button onClick={() => linkClick('Services')}>Services</button>
        </div>
        <div className="footer-column">
          <h3>Legal</h3>
          <span>Privacy Policy</span><span>Terms & Conditions</span><span>Shipping Policy</span><span>Return & Refund Policy</span>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 {brand}. All rights reserved. A Proprietorship Business.</span>
        <span>Designed with care in India</span>
      </div>
    </footer>
  );
}

function App() {
  const [activePage, setActivePage] = useState('Home');
  const CurrentPage = useMemo(() => ({ Home: HomePage, About: AboutPage, Services: ServicesPage, Contact: ContactPage })[activePage], [activePage]);
  return (
    <>
      <Header activePage={activePage} setActivePage={setActivePage} />
      <main><CurrentPage setActivePage={setActivePage} /></main>
      <Footer setActivePage={setActivePage} />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
