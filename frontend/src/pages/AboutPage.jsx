import { brand, background, businessInfo, defaultSiteContent, goTop, visibleCards, Eyebrow, Stat, SectionTitle, FeatureCard } from '../pageLibrary.jsx';



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

function AboutPage({ content, setActivePage, setServiceFocus }) {
  const aboutJourney = Array.isArray(content.site.aboutJourney) ? content.site.aboutJourney : defaultSiteContent.aboutJourney;

  return (
    <>
      <PageHero eyebrow="Our Story" title={`About ${brand}`} subtitle={content.site.aboutSubtitle} />
      <section className="section-block journey-section">
        <div className="container narrow">
          <SectionTitle eyebrow="Who We Are" title="Our Journey" />
          <div className="journey-copy" data-reveal>
            {aboutJourney.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
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
      <Values content={content} setActivePage={setActivePage} setServiceFocus={setServiceFocus} />
      <BusinessInformation />
      <section className="work-together" id="lets-work-together" data-reveal>
        <h2>Let's Work Together</h2>
        <p>Partner with us for premium apparel solutions tailored to your needs.</p>
        <button className="gold-button" onClick={() => setActivePage('Contact')}>Get In Touch</button>
      </section>
    </>
  );
}

function Values({ content, setActivePage, setServiceFocus }) {
  const values = visibleCards(content.site.valueCards || defaultSiteContent.valueCards);

  const openValue = (target) => {
    if (target === 'contact') {
      setActivePage('Contact');
      goTop();
      return;
    }
    if (target === 'business-information') {
      document.getElementById('business-information')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    setServiceFocus(target);
    setActivePage('Services');
  };

  return (
    <section className="section-block values-section">
      <div className="container">
        <SectionTitle eyebrow="What We Stand For" title="Our Values" subtitle={`The principles that guide everything we do at ${brand}.`} />
        <div className="value-grid">
          {values.map(({ title, text, icon, target, actionLabel }) => (
            <FeatureCard
              key={title}
              title={title}
              text={text}
              icon={icon}
              actionLabel={actionLabel}
              onSelect={() => openValue(target)}
              centered
            />
          ))}
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
    <section className="section-block business-section" id="business-information">
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



export default AboutPage;
export { AboutPage };

