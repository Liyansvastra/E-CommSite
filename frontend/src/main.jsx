import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const brand = "LIYAN'S VASTRA";
const assetPath = (path) => `${import.meta.env.BASE_URL}${path}`;
const logo = assetPath('logo.png');
const background = assetPath('background.jpg');
const lifestyleImage = assetPath('background.jpg');
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const navItems = ['Home', 'About', 'Services', 'Contact'];
const phoneNumber = '+917871357999';
const displayPhone = '+91 7871357999';
const emailAddress = 'liyansvastra@gmail.com';
const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent("Hello LIYAN'S VASTRA, I would like to enquire about logo T-shirt styles.")}`;
const shirtFrontImage = assetPath('t-shirt-model/sample_frontside.png');
const shirtBackImage = assetPath('t-shirt-model/sample_backside.png');
const shirtFrontImage2 = assetPath('t-shirt-model/sample_frontside2.png');
const shirtBackImage2 = assetPath('t-shirt-model/sample_backside2.png');
const personImage1 = assetPath('t-shirt-model/sample_person1.png');
const personImage2 = assetPath('t-shirt-model/sample_person2.png');

const serviceCategories = [
  {
    id: 'logo-shirts',
    title: 'Logo T-shirt Styles',
    text: 'Premium logo placement samples for teams, brands, events, and daily apparel enquiries.',
    badge: 'Logo Style',
    count: '18 styles',
    rate: 'From Rs. 499',
    frontImage: shirtFrontImage2,
    backImage: shirtBackImage2,
    items: ['Chest Logo Tee', 'Pocket Logo Tee', 'Event Logo Tee'],
  },
  {
    id: 'premium-cotton',
    title: 'Premium Cotton Range',
    text: 'Soft cotton T-shirt styles with refined stitching, clean fit, and premium everyday finish.',
    badge: 'Cotton Range',
    count: '12 styles',
    rate: 'From Rs. 599',
    frontImage: personImage1,
    backImage: personImage2,
    visualType: 'person-pair',
    items: ['220 GSM Tee', 'Classic Crew Neck', 'Minimal Plain Tee'],
  },
  {
    id: 'custom-models',
    title: 'Custom Model Showcase',
    text: 'Model, color, and layout directions for custom apparel before final client images are supplied.',
    badge: 'Custom Model',
    count: '9 styles',
    rate: 'Quote Based',
    frontImage: shirtFrontImage,
    backImage: shirtBackImage,
    items: ['Brand Uniform Tee', 'Team Style Set', 'Custom Color Set'],
  },
];

const findServiceCategory = (categoryId) => (
  serviceCategories.find((category) => category.id === categoryId) || serviceCategories[0]
);

const serviceHeroSlides = [
  ['Logo Placement', 'Chest logo sample for teams and brands'],
  ['Premium Cotton', 'Clean 220 GSM everyday T-shirt finish'],
  ['Corporate Style', 'Uniform-ready apparel direction'],
  ['Event Series', 'Bulk event and campaign T-shirt sample'],
  ['Custom Model', 'Color and model showcase placeholder'],
];

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

function useRevealOnScroll(activePage) {
  useEffect(() => {
    const items = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
    );

    items.forEach((item, index) => {
      item.style.setProperty('--reveal-delay', `${Math.min(index * 55, 330)}ms`);
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, [activePage]);
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
    <div className="section-title" data-reveal>
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
    <div className="stat" data-reveal>
      <strong>{value}</strong>
      <small>{label}</small>
    </div>
  );
}

function FeatureCard({ title, text, icon, centered = false }) {
  return (
    <article className={centered ? 'feature-card centered' : 'feature-card'} data-reveal>
      <GoldIcon>{icon}</GoldIcon>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function ProductCard({ category, onSelect }) {
  const handleSelect = () => {
    onSelect(category.id);
  };

  const handleKeyDown = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    handleSelect();
  };

  return (
    <article
      className="product-card shirt-card"
      data-reveal
      onClick={handleSelect}
      tabIndex="0"
      onKeyDown={handleKeyDown}
    >
      <div className={category.visualType === 'person-pair' ? 'shirt-visual person-visual' : 'shirt-visual'} aria-hidden="true">
        <img className="shirt-image back" src={category.backImage} alt="" loading="lazy" decoding="async" />
        <img className="shirt-image front" src={category.frontImage} alt="" loading="lazy" decoding="async" />
        <div className="shirt-caption" aria-hidden="true">
          <strong>{category.title}</strong>
          <span>LIYAN'S VASTRA</span>
        </div>
      </div>
      <div className="shirt-details">
        <strong>{category.badge}</strong>
        <h3>{category.title}</h3>
        <p>{category.text}</p>
        <div className="shirt-meta">
          <span>{category.count}</span>
          <span>{category.rate}</span>
        </div>
      </div>
    </article>
  );
}

function GroupStyleCard({ style, index }) {
  return (
    <article className="group-style-card" data-reveal>
      <div className="group-style-media">
        <div className={style.visualType === 'person-pair' ? 'group-style-image person-group-image' : 'group-style-image'}>
          <img className="group-shirt back" src={style.backImage} alt="" loading="lazy" decoding="async" />
          <img className="group-shirt front" src={style.frontImage} alt={`${style.title} T-shirt style`} loading="lazy" decoding="async" />
          <div className="shirt-caption group-caption">
            <strong>{style.title}</strong>
            <span>LIYAN'S VASTRA</span>
          </div>
        </div>
      </div>
      <div className="group-style-details">
        <span>{style.badge} / Style {index + 1}</span>
        <h3>{style.title}</h3>
        <p>{style.text}</p>
        <div className="group-style-specs">
          <strong>Cloth Style</strong><small>{style.clothStyle}</small>
          <strong>Fabric</strong><small>{style.fabric}</small>
          <strong>Fit</strong><small>{style.fit}</small>
          <strong>Rating</strong><small>{style.rating}</small>
          <strong>Rate</strong><small>{style.rate}</small>
        </div>
      </div>
    </article>
  );
}

function ServicesHeroShowcase() {
  const slides = [...serviceHeroSlides, ...serviceHeroSlides];

  return (
    <div className="services-royal-showcase" data-reveal>
      <div className="showcase-copy">
        <span>Royal T-shirt Gallery</span>
        <h2>Sample Style Movement</h2>
        <p>Auto-moving sample display for logo T-shirts, premium cotton, and custom apparel categories.</p>
      </div>
      <div className="showcase-track-wrap" aria-hidden="true">
        <div className="showcase-track">
          {slides.map(([title, text], index) => (
            <article className="showcase-slide" key={`${title}-${index}`}>
              <div className="showcase-shirt-stage">
                <img className="showcase-shirt back" src={shirtBackImage} alt="" loading="lazy" decoding="async" />
                <img className="showcase-shirt front" src={shirtFrontImage} alt="" loading="lazy" decoding="async" />
                <div className="shirt-caption showcase-caption">
                  <strong>{title}</strong>
                  <span>LIYAN'S VASTRA</span>
                </div>
              </div>
              <div>
                <small>{text}</small>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeaturedProducts({ setActivePage, setServiceFocus }) {
  const openCategory = (categoryId) => {
    setServiceFocus(categoryId);
    setActivePage('Services');
  };

  const openServicesTop = () => {
    setServiceFocus('');
    setActivePage('Services');
    goTop();
  };

  return (
    <section className="section-block compact-section">
      <div className="container">
        <SectionTitle
          eyebrow="Style Samples"
          title="T-shirt Style Showcase"
          subtitle="Sample T-shirt, logo, style, and model directions while final client images are pending."
        />
        <div className="product-grid">
          {serviceCategories.map((category) => <ProductCard key={category.id} category={category} onSelect={openCategory} />)}
        </div>
        <div className="section-action" data-reveal>
          <button className="gold-button" onClick={openServicesTop}>View Styles</button>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const reviews = [
    ['Premium finish', 'The cotton feels rich, comfortable, and made for daily use.'],
    ['Fast support', 'Quick response, clear updates, and smooth delivery experience.'],
    ['Great quality', 'The fabric weight and stitching made the product feel premium.'],
  ];

  return (
    <section className="section-block compact-section">
      <div className="container">
        <SectionTitle eyebrow="Customer Trust" title="What Customers Say" />
        <div className="testimonial-grid">
          {reviews.map(([title, text]) => (
            <article className="testimonial-card" key={title} data-reveal>
              <div className="stars" aria-hidden="true">*****</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomePage({ setActivePage, setServiceFocus }) {
  const openServicesTop = () => {
    setServiceFocus('');
    setActivePage('Services');
    goTop();
  };

  return (
    <>
      <section className="home-hero page-enter">
        <div className="container hero-grid">
          <div className="hero-copy" data-reveal>
            <h1><span>{brand}</span> Elevated Elegance in Every Thread</h1>
            <p>
              We craft premium apparel for the discerning individual. From meticulously sourced
              fabrics to innovative designs, every piece reflects our commitment to excellence.
            </p>
            <div className="button-row">
              <button className="gold-button" onClick={openServicesTop}>View Styles</button>
              <button className="gold-button" onClick={() => setActivePage('About')}>Our Story</button>
              <button className="dark-button" onClick={() => setActivePage('Contact')}>Get In Touch</button>
            </div>
            <div className="hero-stats">
              <Stat value="100%" label="Premium Fabrics" />
              <Stat value="Ethical" label="Sourcing" />
              <Stat value="10+" label="Years Heritage" />
            </div>
          </div>
          <div className="hero-logo-orbit" aria-hidden="true" data-reveal>
            <div><img src={logo} alt="" /></div>
          </div>
        </div>
        <div className="scroll-mark">Scroll</div>
      </section>

      <section className="container story-showcase">
        <img className="story-bg-image" src={lifestyleImage} alt="" loading="lazy" decoding="async" />
        <div className="story-copy" data-reveal>
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

      <FeaturedProducts setActivePage={setActivePage} setServiceFocus={setServiceFocus} />
      <WhyChoose />
      <Testimonials />
    </>
  );
}

function WhyChoose() {
  const cards = [
    ['Premium Fabric Quality', '100% premium cotton with superior GSM for lasting comfort and durability.', 'PF'],
    ['Comfortable Fit', 'Thoughtfully designed cuts that support clean everyday T-shirt styling.', 'CF'],
    ['Unisex Designs', 'Versatile styles crafted for logo apparel, teams, and brand enquiries.', 'UD'],
    ['Logo Customization', 'Logo placement and styling support for brand and team apparel enquiries.', 'LC'],
    ['Easy Enquiry', 'Quick WhatsApp and email communication for custom T-shirt requirements.', 'EQ'],
    ['Pan India Support', 'Delivery and support discussion available for customers across India.', 'PI'],
  ];

  return (
    <section className="section-block">
      <div className="container">
        <SectionTitle
          eyebrow="Our Promise"
          title={`Why Choose ${brand}?`}
          subtitle="We help customers explore premium T-shirt styles, logo apparel, and custom enquiries with clear communication."
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
    <section className="page-hero page-enter" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.72), rgba(0,0,0,.84)), url(${background})` }}>
      <div className="container page-hero-inner" data-reveal>
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
          <div className="journey-copy" data-reveal>
            <p>{brand} was born from a simple belief: everyone deserves to wear clothing that makes them feel their best.</p>
            <p>Every product is carefully crafted using premium cotton fabrics with superior GSM weights.</p>
            <p>As a GST-registered proprietorship, we operate with full transparency and commitment to our customers.</p>
          </div>
          <div className="divider" data-reveal />
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
      <section className="work-together" data-reveal>
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
  const renderValue = (label, value) => {
    if (label === 'Phone:') return <a href={`tel:${phoneNumber}`}>{value}</a>;
    if (label === 'Email:') return <a href={`mailto:${emailAddress}`}>{value}</a>;
    return <span>{value}</span>;
  };

  return (
    <section className="section-block business-section">
      <div className="container">
        <SectionTitle eyebrow="Registered Details" title="Business Information" subtitle="Registered business details for your trust and transparency." />
        <div className="business-card" data-reveal>
          <img src={logo} alt="" />
          {businessInfo.map(([label, value]) => (
            <div className="business-row" key={label}><strong>{label}</strong>{renderValue(label, value)}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesPage({ serviceFocus, setServiceFocus, setActivePage }) {
  useEffect(() => {
    if (!serviceFocus) return;
    window.setTimeout(() => {
      document.getElementById(serviceFocus)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  }, [serviceFocus]);

  const jumpToCategory = (categoryId) => {
    setServiceFocus(categoryId);
    document.getElementById(categoryId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openCategoryPage = (categoryId) => {
    setServiceFocus(categoryId);
    setActivePage('ServiceDetail');
    goTop();
  };

  return (
    <section className="section-block services-page page-enter">
      <div className="container">
        <ServicesHeroShowcase />
        <SectionTitle eyebrow="What We Offer" title="Our Services" subtitle="Explore T-shirt style categories, sample groups, and enquiry-ready apparel directions." />
        <div className="service-jump-grid">
          {serviceCategories.map((category, index) => (
            <button className="service-jump-card" key={category.id} onClick={() => jumpToCategory(category.id)} data-reveal>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{category.title}</strong>
              <small>{category.count} / {category.rate}</small>
            </button>
          ))}
        </div>
        {serviceCategories.map((category, index) => (
          <section className="service-category-panel" id={category.id} key={category.id} data-reveal>
            <div className="service-category-heading">
              <span>Part {index + 1}</span>
              <h3>{category.title}</h3>
              <p>{category.text}</p>
            </div>
            <div className="service-shirt-grid">
              {category.items.map((item) => (
                <ProductCard
                  key={item}
                  category={{ ...category, title: item, text: category.text }}
                  onSelect={() => openCategoryPage(category.id)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

function ServiceDetailPage({ serviceFocus, setActivePage, setServiceFocus }) {
  const category = findServiceCategory(serviceFocus);
  const groupStyles = category.items.map((item, index) => ({
    ...category,
    id: `${category.id}-${index}`,
    title: item,
    text: `${category.text} This group sample can be replaced with the final client image set later.`,
    count: `${index + 1} sample`,
    clothStyle: ['Round Neck', 'Logo Placement', 'Custom Color'][index] || 'Premium Tee',
    fabric: index === 1 ? '220 GSM Cotton' : 'Premium Cotton',
    fit: index === 2 ? 'Custom Fit' : 'Regular Comfort Fit',
    rating: ['4.8 / 5', '4.7 / 5', '4.9 / 5'][index] || '4.8 / 5',
  }));

  const backToServices = () => {
    setServiceFocus(category.id);
    setActivePage('Services');
  };

  return (
    <section className="section-block service-detail-page page-enter">
      <div className="container">
        <button className="dark-button back-service-button" onClick={backToServices}>Back To Services</button>
        <SectionTitle eyebrow={category.badge} title={category.title} subtitle="Grouped T-shirt style images with the same front and back animation style." />
        <div className="service-detail-hero" data-reveal>
          <div>
            <span>{category.count}</span>
            <h3>{category.rate}</h3>
            <p>{category.text}</p>
          </div>
        </div>
        <div className="service-detail-grid">
          {groupStyles.map((style, index) => (
            <GroupStyleCard
              key={style.id}
              style={style}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contacts = [
    ['Our Address', "LIYAN'S VASTRA\nNo 53 G1 Sudha Madhuri Homes\nNalluruhalli Main Road\nOpp. HP Petrol Pump, DNA Anantha Layout\nBengaluru - 560066, Karnataka", 'AD'],
    ['Phone', `${displayPhone}\nMon - Sat: 10 AM - 6 PM IST`, 'PH'],
    ['Email', `${emailAddress}\nWe reply within 24 hours`, 'EM'],
    ['Business Hours', 'Monday - Saturday\n10:00 AM - 6:00 PM IST', 'HR'],
  ];
  const renderContactText = (title, text) => {
    if (title === 'Phone') {
      return <p><a href={`tel:${phoneNumber}`}>{displayPhone}</a><br />Mon - Sat: 10 AM - 6 PM IST</p>;
    }
    if (title === 'Email') {
      return <p><a href={`mailto:${emailAddress}`}>{emailAddress}</a><br />We reply within 24 hours</p>;
    }
    return <p>{text}</p>;
  };

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormStatus({ type: '', message: '' });

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setFormStatus({ type: 'error', message: 'Please fill all required fields.' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setFormStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    if (formData.message.trim().length < 10) {
      setFormStatus({ type: 'error', message: 'Please enter a message with at least 10 characters.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/contact/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) {
        throw new Error(result?.message || 'Unable to send message.');
      }
      setFormStatus({ type: 'success', message: result.message || 'Message sent successfully.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: 'Email service is not available right now. Please use WhatsApp or try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-block contact-page page-enter">
      <div className="container contact-grid">
        <div data-reveal>
          <h2 className="contact-heading">Contact Information</h2>
          <div className="contact-list">
            {contacts.map(([title, text, icon]) => (
              <article className="contact-card" key={title}><GoldIcon>{icon}</GoldIcon><div><h3>{title}</h3>{renderContactText(title, text)}</div></article>
            ))}
          </div>
        </div>
        <form className="message-card" data-reveal onSubmit={handleSubmit}>
          <h2>Send Us a Message</h2>
          <div className="form-two">
            <label>Your Name *<input required placeholder="Full name" value={formData.name} onChange={(event) => updateField('name', event.target.value)} /></label>
            <label>Email Address *<input required type="email" placeholder="your@email.com" value={formData.email} onChange={(event) => updateField('email', event.target.value)} /></label>
          </div>
          <label>Subject *<input required placeholder="What is your query about?" value={formData.subject} onChange={(event) => updateField('subject', event.target.value)} /></label>
          <label>Message *<textarea required rows="7" placeholder="Write your message here..." value={formData.message} onChange={(event) => updateField('message', event.target.value)} /></label>
          {formStatus.message && <p className={`form-status ${formStatus.type}`}>{formStatus.message}</p>}
          <div className="form-actions">
            <button className="gold-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Send Message'}</button>
            <a className="dark-button inline-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer">Enquire on WhatsApp</a>
          </div>
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
    <footer className="footer" data-reveal>
      <div className="container footer-inner">
        <div className="footer-brand">
          <p>Premium quality textiles crafted for everyday elegance. Where comfort meets style in every thread.</p>
          <div className="footer-contact">
            <p><b>{brand}</b><span>Proprietor: Kishoreraaj Robert</span></p>
            <p><b>Address</b><span>No 53 G1 Sudha Madhuri Homes, Bengaluru - 560066, Karnataka</span></p>
            <p><b>Phone</b><a href={`tel:${phoneNumber}`}>{displayPhone}</a></p>
            <p><b>Email</b><a href={`mailto:${emailAddress}`}>{emailAddress}</a></p>
            <p><b>GST</b><span>29AXTPK6839P1Z5</span></p>
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

function FloatingActions() {
  return (
    <div className="floating-actions" aria-label="Quick actions">
      <a className="whatsapp-float" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
        <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
          <path d="M16.02 3.2A12.68 12.68 0 0 0 5.27 22.6L4 29l6.56-1.22A12.7 12.7 0 1 0 16.02 3.2Zm0 22.9a10.3 10.3 0 0 1-5.24-1.44l-.38-.23-3.88.72.74-3.78-.25-.39a10.29 10.29 0 1 1 9.01 5.12Zm5.64-7.72c-.31-.16-1.83-.9-2.11-1-.28-.1-.49-.16-.7.16-.2.31-.8 1-.98 1.2-.18.2-.36.23-.67.08-.31-.16-1.31-.48-2.5-1.54-.92-.82-1.55-1.84-1.73-2.15-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.54.16-.18.2-.31.31-.52.1-.2.05-.39-.03-.54-.08-.16-.7-1.68-.96-2.3-.25-.6-.51-.52-.7-.53h-.59c-.2 0-.54.08-.82.39-.28.31-1.08 1.05-1.08 2.57 0 1.52 1.1 2.98 1.26 3.19.16.2 2.17 3.31 5.25 4.64.73.32 1.3.5 1.75.64.74.23 1.41.2 1.94.12.59-.09 1.83-.75 2.09-1.47.26-.72.26-1.34.18-1.47-.08-.13-.28-.2-.59-.36Z" />
        </svg>
      </a>
      <button className="top-float" type="button" onClick={goTop} aria-label="Back to top">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 4.75 4.9 11.85l1.55 1.55 4.45-4.45V20h2.2V8.95l4.45 4.45 1.55-1.55L12 4.75Z" />
        </svg>
      </button>
    </div>
  );
}

function App() {
  const [activePage, setActivePage] = useState('Home');
  const [serviceFocus, setServiceFocus] = useState('');
  const CurrentPage = useMemo(() => ({ Home: HomePage, About: AboutPage, Services: ServicesPage, ServiceDetail: ServiceDetailPage, Contact: ContactPage })[activePage], [activePage]);
  const navActivePage = activePage === 'ServiceDetail' ? 'Services' : activePage;
  useRevealOnScroll(activePage);

  return (
    <>
      <div
        className="site-background"
        style={{ backgroundImage: `url(${background})` }}
        aria-hidden="true"
      />
      <Header activePage={navActivePage} setActivePage={setActivePage} />
      <main key={activePage}>
        <CurrentPage setActivePage={setActivePage} serviceFocus={serviceFocus} setServiceFocus={setServiceFocus} />
      </main>
      <Footer setActivePage={setActivePage} />
      <FloatingActions />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
