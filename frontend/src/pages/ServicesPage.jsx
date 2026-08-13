import React, { useEffect } from 'react';
import { defaultGradient, findServiceCategory, goTop, normalizeStyleItem, serviceHeroSlides, shirtBackImage, shirtFrontImage, getCaptionTextStyles, getVisualStyleVars, SectionTitle, GoldIcon, ProductCard, ScrollArrowRow } from '../pageLibrary.jsx';



function GroupStyleCard({ style, index }) {
  const hasBackImage = Boolean(style.backImage);
  const animationType = style.animationType || (hasBackImage ? 'front-back-display' : 'royal-zoom-right');
  const captionStyles = getCaptionTextStyles(style);
  const visualClass = [
    'group-style-image',
    !hasBackImage ? 'single-group-image' : '',
    animationType === 'hover-right-pair' || style.visualType === 'person-pair' ? 'person-group-image pair-hover-group' : '',
    animationType === 'royal-float' ? 'royal-float-group' : '',
    animationType,
  ].filter(Boolean).join(' ');

  return (
    <article className="group-style-card" data-reveal>
      <div className="group-style-media">
        <div className={visualClass} style={getVisualStyleVars(style)}>
          {hasBackImage && <img className="group-shirt back" src={style.backImage} alt="" loading="lazy" decoding="async" />}
          <img className="group-shirt front" src={style.frontImage} alt={`${style.title} T-shirt style`} loading="lazy" decoding="async" />
          <div className="shirt-caption group-caption">
            <strong style={captionStyles.title}>{style.title}</strong>
            <span style={captionStyles.brand}>LIYAN'S VASTRA</span>
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

function ServicesHeroShowcase({ categories, onSelect, copy = {} }) {
  const storedSlides = categories.flatMap((category) => {
    const categorySlides = [
      {
        id: `${category.id}-category`,
        categoryId: category.id,
        title: category.title,
        text: category.text,
        frontImage: category.frontImage,
        backImage: category.backImage,
        cardGradient: category.cardGradient,
        captionTitleColor: category.captionTitleColor,
        captionBrandColor: category.captionBrandColor,
      },
    ];
    const itemSlides = (category.items || []).map((item, index) => {
      const style = normalizeStyleItem(item, category, index);
      return {
        id: style.id,
        categoryId: category.id,
        title: style.title,
        text: style.text,
        frontImage: style.frontImage,
        backImage: style.backImage,
        cardGradient: style.cardGradient,
        captionTitleColor: style.captionTitleColor,
        captionBrandColor: style.captionBrandColor,
      };
    });
    return [...categorySlides, ...itemSlides];
  }).filter((slide) => slide.frontImage);

  const fallbackSlides = serviceHeroSlides.map(([title, text], index) => ({
    id: `fallback-${index}`,
    categoryId: categories[index % Math.max(categories.length, 1)]?.id || '',
    title,
    text,
    frontImage: shirtFrontImage,
    backImage: shirtBackImage,
    cardGradient: defaultGradient,
  }));
  const baseSlides = storedSlides.length ? storedSlides : fallbackSlides;
  const slides = [...baseSlides, ...baseSlides];

  return (
    <div className="services-royal-showcase" data-reveal>
        <div className="showcase-copy">
        <span>{copy.eyebrow || 'Royal T-shirt Gallery'}</span>
        <h2>{copy.title || 'Sample Style Movement'}</h2>
        <p>{copy.subtitle || 'Auto-moving sample display for logo T-shirts, premium cotton, and custom apparel categories.'}</p>
      </div>
      <div className="showcase-track-wrap">
        <div className="showcase-track">
          {slides.map((slide, index) => (
            <button className="showcase-slide" type="button" key={`${slide.id}-${index}`} onClick={() => onSelect(slide.categoryId)}>
              <div className="showcase-shirt-stage" style={{ '--card-bg': slide.cardGradient || defaultGradient }}>
                {slide.backImage && <img className="showcase-shirt back" src={slide.backImage} alt="" loading="lazy" decoding="async" />}
                <img className={slide.backImage ? 'showcase-shirt front' : 'showcase-shirt front single'} src={slide.frontImage} alt="" loading="lazy" decoding="async" />
                <div className="shirt-caption showcase-caption">
                  <strong style={getCaptionTextStyles(slide).title}>{slide.title}</strong>
                  <span style={getCaptionTextStyles(slide).brand}>LIYAN'S VASTRA</span>
                </div>
              </div>
              <div>
                <small>{slide.text}</small>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ServicesPage({ categories, serviceFocus, setServiceFocus, setActivePage }) {
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
        <ServicesHeroShowcase categories={categories.filter((category) => category.showOnServices !== false)} onSelect={openCategoryPage} />
        <SectionTitle eyebrow="What We Offer" title="Our Services" subtitle="Explore T-shirt style categories, sample groups, and enquiry-ready apparel directions." />
        <div className="service-jump-grid">
          {categories.filter((category) => category.showOnServices !== false).map((category, index) => (
            <button className="service-jump-card royal-text-card" key={category.id} onClick={() => jumpToCategory(category.id)} data-reveal>
              <GoldIcon icon="category" />
              <strong>{category.title}</strong>
              <div className="card-small-line" aria-hidden="true" />
              <small>{category.count} / {category.rate}</small>
              <span className="explore-link hide-view-styles">View Styles <b aria-hidden="true">-&gt;</b></span>
            </button>
          ))}
        </div>
        {categories.filter((category) => category.showOnServices !== false).map((category, index) => (
          <section className="service-category-panel" id={category.id} key={category.id} data-reveal>
            <div className="service-category-heading">
              <span>Part {index + 1}</span>
              <h3>{category.title}</h3>
              <p>{category.text}</p>
            </div>
            <ScrollArrowRow className="service-shirt-grid">
              {category.items.map((item, itemIndex) => ({ style: normalizeStyleItem(item, category, itemIndex), itemIndex }))
                .filter(({ style }) => style.showOnServices !== false)
                .map(({ style, itemIndex }) => {
                return (
                <ProductCard
                  key={style.id}
                  category={{ ...category, ...style, badge: category.badge, count: category.count }}
                  onSelect={() => openCategoryPage(category.id)}
                />
                );
              })}
            </ScrollArrowRow>
          </section>
        ))}
      </div>
    </section>
  );
}

function ServiceDetailPage({ categories, serviceFocus, setActivePage, setServiceFocus }) {
  const category = findServiceCategory(categories, serviceFocus);
  const groupStyles = category.items
    .map((item, index) => ({ ...category, ...normalizeStyleItem(item, category, index), id: `${category.id}-${index}`, count: `${index + 1} sample` }))
    .filter((style) => style.showOnServices !== false);

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



export default ServicesPage;
export { ServicesPage, ServiceDetailPage };

