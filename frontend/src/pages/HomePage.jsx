import { brand, logo, lifestyleImage, defaultSiteContent, goTop, normalizeStyleItem, visibleCards, Eyebrow, Stat, SectionTitle, FeatureCard, ProductCard, ScrollArrowRow } from '../pageLibrary.jsx';



function FeaturedProducts({ categories, setActivePage, setServiceFocus }) {
  const openCategory = (categoryId) => {
    setServiceFocus(categoryId);
    setActivePage('Services');
  };

  const openServicesTop = () => {
    setServiceFocus('');
    setActivePage('Services');
    goTop();
  };

  const homeCards = categories.flatMap((category) => {
    if (category.showOnServices === false) return [];
    const categoryCard = category.showOnHome !== false ? [category] : [];
    const itemCards = category.items
      .map((item, itemIndex) => normalizeStyleItem(item, category, itemIndex))
      .filter((style) => style.showOnHome === true)
      .map((style) => ({ ...category, ...style, id: `${category.id}-${style.id}`, badge: category.badge, count: category.count, parentCategoryId: category.id }));
    return [...categoryCard, ...itemCards];
  });

  return (
    <section className="section-block compact-section">
      <div className="container">
        <SectionTitle
          eyebrow="Style Samples"
          title="T-shirt Style Showcase"
          subtitle="Sample T-shirt, logo, style, and model directions while final client images are pending."
        />
        <ScrollArrowRow className="product-grid">
          {homeCards.map((category) => <ProductCard key={category.id} category={category} onSelect={() => openCategory(category.parentCategoryId || category.id)} />)}
        </ScrollArrowRow>
        <div className="section-action" data-reveal>
          <button className="gold-button" onClick={openServicesTop}>View Styles</button>
        </div>
      </div>
    </section>
  );
}

function Testimonials({ content }) {
  const reviews = visibleCards(content.site.testimonials || defaultSiteContent.testimonials);
  return (
    <section className="section-block compact-section">
      <div className="container">
        <SectionTitle eyebrow="Customer Trust" title="What Customers Say" />
        <div className="testimonial-grid">
          {reviews.map(({ title, text }) => (
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

function HomePage({ content, categories, setActivePage, setServiceFocus }) {
  const storyParagraphs = Array.isArray(content.site.storyParagraphs) ? content.site.storyParagraphs : defaultSiteContent.storyParagraphs;

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
            <h1><span>{brand}</span> {content.site.heroTitle}</h1>
            <p>{content.site.heroText}</p>
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
          <h2>{content.site.storyTitle}</h2>
          {storyParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="mini-stat-grid">
            <Stat value="220 GSM" label="Premium Weight Fabric" />
            <Stat value="100%" label="Pure Cotton" />
            <Stat value="GST" label="Registered" />
            <Stat value="Pan India" label="Delivery" />
          </div>
        </div>
      </section>

      <FeaturedProducts categories={categories} setActivePage={setActivePage} setServiceFocus={setServiceFocus} />
      <WhyChoose content={content} setActivePage={setActivePage} setServiceFocus={setServiceFocus} />
      <Testimonials content={content} />
    </>
  );
}

function WhyChoose({ content, setActivePage, setServiceFocus }) {
  const cards = visibleCards(content.site.whyChooseCards || defaultSiteContent.whyChooseCards);

  const openCard = (target) => {
    if (target === 'contact') {
      setActivePage('Contact');
      goTop();
      return;
    }
    setServiceFocus(target);
    setActivePage('Services');
  };

  return (
    <section className="section-block">
      <div className="container">
        <SectionTitle
          eyebrow="Our Promise"
          title={`Why Choose ${brand}?`}
          subtitle="We help customers explore premium T-shirt styles, logo apparel, and custom enquiries with clear communication."
        />
        <div className="card-grid">
          {cards.map(({ title, text, icon, target, actionLabel }) => (
            <FeatureCard
              key={title}
              title={title}
              text={text}
              icon={icon}
              actionLabel={actionLabel}
              onSelect={() => openCard(target)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}



export default HomePage;
export { HomePage };

