import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const brand = "LIYAN'S VASTRA";
const assetPath = (path) => `${import.meta.env.BASE_URL}${path}`;
const logo = assetPath('logo.png');
const background = assetPath('background.jpg');
const lifestyleImage = assetPath('background.jpg');
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const navItems = ['Home', 'About', 'Services', 'Contact'];
const pageToPath = { Home: '/', About: '/about', Services: '/services', Contact: '/contacts', AdminLogin: '/admin-login', AdminDashboard: '/admin-dashboard', AdminCategoryEditor: '/admin-dashboard/category', AdminContainerEditor: '/admin-dashboard/container', NotFound: '/404' };
const pathToPage = { '/': 'Home', '/home': 'Home', '/about': 'About', '/services': 'Services', '/contact': 'Contact', '/contacts': 'Contact', '/admin-login': 'AdminLogin', '/admin-dashboard': 'AdminDashboard', '/admin-dashboard/category': 'AdminCategoryEditor', '/admin-dashboard/container': 'AdminContainerEditor' };
const adminEmail = 'liyansvastra@brillaris.pro';
const adminPassword = 'Brillaris$12';
const storageKey = 'liyans_vastra_admin_content_v1';
const authKey = 'liyans_vastra_admin_auth_v1';
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
const animationOptions = [
  ['royal-zoom-right', 'Single image zoom/right'],
  ['front-back-display', 'Front and back display'],
  ['hover-right-pair', 'Hover right-side pair'],
  ['royal-float', 'Royal floating zoom'],
];
const gradientOptions = [
  ['royal-light', 'Royal Light', 'radial-gradient(circle at 72% 22%, rgba(255, 201, 0, 0.2), transparent 11rem), linear-gradient(135deg, rgba(234, 234, 234, 0.96), rgba(204, 204, 204, 0.76))'],
  ['black-gold', 'Black Gold', 'radial-gradient(circle at 74% 20%, rgba(255, 201, 0, 0.22), transparent 12rem), linear-gradient(135deg, rgba(12, 10, 6, 0.96), rgba(44, 33, 12, 0.82))'],
  ['champagne', 'Champagne', 'radial-gradient(circle at 24% 18%, rgba(255, 201, 0, 0.18), transparent 10rem), linear-gradient(135deg, rgba(235, 225, 190, 0.96), rgba(174, 158, 108, 0.76))'],
  ['silver-royal', 'Silver Royal', 'radial-gradient(circle at 70% 26%, rgba(213, 173, 24, 0.2), transparent 11rem), linear-gradient(135deg, rgba(234, 234, 234, 0.94), rgba(172, 172, 172, 0.78))'],
  ['deep-maroon', 'Deep Maroon', 'radial-gradient(circle at 68% 18%, rgba(255, 201, 0, 0.2), transparent 11rem), linear-gradient(135deg, rgba(38, 8, 12, 0.96), rgba(11, 8, 6, 0.9))'],
];
const defaultGradient = gradientOptions[0][2];

const defaultServiceCategories = [
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

const defaultSiteContent = {
  heroTitle: 'Elevated Elegance in Every Thread',
  heroText: 'We craft premium apparel for the discerning individual. From meticulously sourced fabrics to innovative designs, every piece reflects our commitment to excellence.',
  storyTitle: `About ${brand}`,
  storyParagraphs: [
    `${brand} is a premium textile and apparel brand born from a passion for quality craftsmanship and timeless style.`,
    'Founded as a proprietorship, we take pride in our hands-on approach to quality. Every product is carefully sourced and crafted using premium cotton fabrics.',
    'Our tagline, "Elevated Elegance", reflects our commitment to everyday premium fashion.',
  ],
  aboutSubtitle: 'A premium textile brand born from passion for quality and timeless style.',
  aboutJourney: [
    `${brand} was born from a simple belief: everyone deserves to wear clothing that makes them feel their best.`,
    'Every product is carefully crafted using premium cotton fabrics with superior GSM weights.',
    'As a GST-registered proprietorship, we operate with full transparency and commitment to our customers.',
  ],
  contactTitle: 'Get In Touch',
  contactSubtitle: 'Tell us about your logo T-shirt or custom apparel requirement.',
};

const defaultAdminContent = {
  site: defaultSiteContent,
  categories: defaultServiceCategories,
};

const findServiceCategory = (categories, categoryId) => (
  categories.find((category) => category.id === categoryId) || categories[0]
);

const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `category-${Date.now()}`;
const clampIndex = (value, length) => Math.min(Math.max(Number.isFinite(Number(value)) ? Number(value) : 0, 0), Math.max(length - 1, 0));
const reorderArray = (items, fromIndex, toIndex) => {
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
};

function encodeAdminToken(value) {
  try {
    return btoa(JSON.stringify(value)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  } catch {
    return '';
  }
}

function decodeAdminToken(token = '') {
  try {
    const normalized = `${token}`.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return JSON.parse(atob(padded));
  } catch {
    return {};
  }
}

function adminEditorPath(page, categoryIndex = 0, itemIndex = 0) {
  if (page === 'AdminCategoryEditor') {
    return `/admin-dashboard/category/${encodeAdminToken({ c: categoryIndex })}`;
  }
  if (page === 'AdminContainerEditor') {
    return `/admin-dashboard/container/${encodeAdminToken({ c: categoryIndex, i: itemIndex })}`;
  }
  return pageToPath[page] || '/';
}

function loadAdminContent() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    if (!stored) return defaultAdminContent;
    return {
      site: { ...defaultSiteContent, ...(stored.site || {}) },
      categories: Array.isArray(stored.categories) && stored.categories.length ? stored.categories : defaultServiceCategories,
    };
  } catch {
    return defaultAdminContent;
  }
}

function getPageFromLocation() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const parts = pathname.split('/').filter(Boolean);
  if (pathname.startsWith('/service/group-services/')) return { page: 'ServiceDetail', serviceFocus: pathname.split('/').filter(Boolean)[2] || '' };
  if (pathname === '/service/group-services') return { page: 'ServiceDetail', serviceFocus: '' };
  if (parts[0] === 'admin-dashboard' && parts[1] === 'category') {
    const token = decodeAdminToken(parts[2]);
    return { page: 'AdminCategoryEditor', serviceFocus: '', adminCategoryIndex: Number(token.c || 0), adminItemIndex: 0 };
  }
  if (parts[0] === 'admin-dashboard' && parts[1] === 'container') {
    const token = decodeAdminToken(parts[2]);
    return { page: 'AdminContainerEditor', serviceFocus: '', adminCategoryIndex: Number(token.c || 0), adminItemIndex: Number(token.i || 0) };
  }
  if (pathname.startsWith('/services/')) return { page: 'ServiceDetail', serviceFocus: pathname.split('/').filter(Boolean)[1] || '' };
  return { page: pathToPage[pathname] || 'NotFound', serviceFocus: '' };
}

function normalizeStyleItem(item, category, index = 0) {
  const title = typeof item === 'string' ? item : item?.title || `Style ${index + 1}`;
  const frontImage = typeof item === 'object' && item?.frontImage ? item.frontImage : category.frontImage;
  const backImage = typeof item === 'object' && item?.backImage ? item.backImage : category.backImage;
  return {
    id: typeof item === 'object' && item?.id ? item.id : slugify(`${category.id}-${title}-${index}`),
    title,
    text: typeof item === 'object' && item?.text ? item.text : `${category.text} This group sample can be replaced with the final client image set later.`,
    frontImage,
    backImage,
    animationType: typeof item === 'object' && item?.animationType ? item.animationType : category.animationType || (backImage ? 'front-back-display' : 'royal-zoom-right'),
    cardGradient: typeof item === 'object' && item?.cardGradient ? item.cardGradient : category.cardGradient || defaultGradient,
    frontZoom: typeof item === 'object' && item?.frontZoom ? item.frontZoom : category.frontZoom || 1,
    frontX: typeof item === 'object' && item?.frontX ? item.frontX : category.frontX || 0,
    frontY: typeof item === 'object' && item?.frontY ? item.frontY : category.frontY || 0,
    frontFit: typeof item === 'object' && item?.frontFit ? item.frontFit : category.frontFit || 'contain',
    backZoom: typeof item === 'object' && item?.backZoom ? item.backZoom : category.backZoom || 1,
    backX: typeof item === 'object' && item?.backX ? item.backX : category.backX || 0,
    backY: typeof item === 'object' && item?.backY ? item.backY : category.backY || 0,
    backFit: typeof item === 'object' && item?.backFit ? item.backFit : category.backFit || 'contain',
    showOnHome: typeof item === 'object' ? item?.showOnHome === true : false,
    showOnServices: typeof item === 'object' ? item?.showOnServices !== false : true,
    clothStyle: typeof item === 'object' && item?.clothStyle ? item.clothStyle : ['Round Neck', 'Logo Placement', 'Custom Color'][index] || 'Premium Tee',
    fabric: typeof item === 'object' && item?.fabric ? item.fabric : index === 1 ? '220 GSM Cotton' : 'Premium Cotton',
    fit: typeof item === 'object' && item?.fit ? item.fit : index === 2 ? 'Custom Fit' : 'Regular Comfort Fit',
    rating: typeof item === 'object' && item?.rating ? item.rating : ['4.8 / 5', '4.7 / 5', '4.9 / 5'][index] || '4.8 / 5',
    rate: typeof item === 'object' && item?.rate ? item.rate : category.rate,
  };
}

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

function getVisualStyleVars(item = {}) {
  const frontZoom = Number(item.frontZoom || 1);
  const backZoom = Number(item.backZoom || 1);
  return {
    '--card-bg': item.cardGradient || defaultGradient,
    '--front-zoom': String(frontZoom),
    '--front-scale-096': String(frontZoom * 0.96),
    '--front-scale-098': String(frontZoom * 0.98),
    '--front-scale-104': String(frontZoom * 1.04),
    '--front-scale-106': String(frontZoom * 1.06),
    '--front-scale-108': String(frontZoom * 1.08),
    '--front-x': `${item.frontX || 0}%`,
    '--front-y': `${item.frontY || 0}%`,
    '--front-fit': item.frontFit || 'contain',
    '--back-zoom': String(backZoom),
    '--back-scale-09': String(backZoom * 0.9),
    '--back-scale-092': String(backZoom * 0.92),
    '--back-scale-098': String(backZoom * 0.98),
    '--back-x': `${item.backX || 0}%`,
    '--back-y': `${item.backY || 0}%`,
    '--back-fit': item.backFit || 'contain',
  };
}

function ScrollArrowRow({ children, className = '' }) {
  const rowRef = useRef(null);
  const [scrollState, setScrollState] = useState({ canLeft: false, canRight: false });

  const updateScrollState = () => {
    const row = rowRef.current;
    if (!row) return;
    const maxScroll = row.scrollWidth - row.clientWidth;
    setScrollState({
      canLeft: row.scrollLeft > 8,
      canRight: row.scrollLeft < maxScroll - 8,
    });
  };

  const move = (direction) => {
    const row = rowRef.current;
    if (!row) return;
    row.scrollBy({ left: direction * Math.max(row.clientWidth * 0.82, 280), behavior: 'smooth' });
  };

  useEffect(() => {
    updateScrollState();
    const row = rowRef.current;
    if (!row) return undefined;
    row.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    const timer = window.setTimeout(updateScrollState, 80);
    return () => {
      row.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
      window.clearTimeout(timer);
    };
  }, [children]);

  return (
    <div className="scroll-arrow-shell">
      {scrollState.canLeft && (
        <button className="scroll-arrow scroll-arrow-left" type="button" aria-label="Scroll left" onClick={() => move(-1)}>
          &lt;
        </button>
      )}
      <div className={className} ref={rowRef}>
        {children}
      </div>
      {scrollState.canRight && (
        <button className="scroll-arrow scroll-arrow-right" type="button" aria-label="Scroll right" onClick={() => move(1)}>
          &gt;
        </button>
      )}
    </div>
  );
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

const materialIconPaths = {
  fabric: (
    <>
      <path d="M6 3h12l2 4-3 3v11H7V10L4 7l2-4Z" />
      <path d="M9 3c0 2 1.3 3 3 3s3-1 3-3" />
    </>
  ),
  fit: (
    <>
      <path d="M8 4 4 7l3 4 2-1v10h6V10l2 1 3-4-4-3" />
      <path d="M9 4c.5 1.5 1.5 2 3 2s2.5-.5 3-2" />
    </>
  ),
  group: (
    <>
      <circle cx="8" cy="7" r="3" />
      <circle cx="16" cy="7" r="3" />
      <path d="M3 20c0-4 2-7 5-7s5 3 5 7" />
      <path d="M11 20c0-4 2-7 5-7s5 3 5 7" />
    </>
  ),
  design: (
    <>
      <path d="M4 20 16 8" />
      <path d="m14 6 4 4" />
      <path d="M17 3 21 7 8 20H4v-4L17 3Z" />
      <path d="M12 8 16 12" />
    </>
  ),
  chat: (
    <>
      <path d="M21 11.5a8.5 8.5 0 0 1-9 8.5 9 9 0 0 1-4-.9L3 21l1.7-4.4A8.5 8.5 0 1 1 21 11.5Z" />
      <path d="M8 10h8" />
      <path d="M8 14h5" />
    </>
  ),
  delivery: (
    <>
      <path d="M3 7h11v10H3Z" />
      <path d="M14 10h4l3 3v4h-7Z" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </>
  ),
  quality: (
    <>
      <path d="m12 3 2.7 5.5 6.1.9-4.4 4.2 1 6-5.4-2.9-5.4 2.9 1-6-4.4-4.2 6.1-.9L12 3Z" />
      <path d="m9.5 12 1.7 1.7 3.5-3.7" />
    </>
  ),
  care: (
    <>
      <path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.7A4 4 0 0 1 19 11c0 5.6-7 10-7 10Z" />
      <path d="M9 12h6" />
    </>
  ),
  transparent: (
    <>
      <path d="M12 3 4 7v5c0 5 3.4 8.5 8 9 4.6-.5 8-4 8-9V7l-8-4Z" />
      <path d="M9 12h6" />
      <path d="M9 16h4" />
    </>
  ),
  inclusive: (
    <>
      <circle cx="12" cy="7" r="3" />
      <path d="M5 21c0-4.4 3.1-8 7-8s7 3.6 7 8" />
      <path d="M4 11h4" />
      <path d="M16 11h4" />
    </>
  ),
  location: (
    <>
      <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  phone: (
    <>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.4 2.1L8 9.6a16 16 0 0 0 6.4 6.4l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.6.5 2.5.6a2 2 0 0 1 1.7 2Z" />
    </>
  ),
  email: (
    <>
      <path d="M4 5h16v14H4Z" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  category: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
};

function MaterialIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {materialIconPaths[name] || materialIconPaths.quality}
    </svg>
  );
}

function GoldIcon({ icon, children }) {
  return <div className="gold-icon">{icon ? <MaterialIcon name={icon} /> : children}</div>;
}

function Stat({ value, label }) {
  return (
    <div className="stat" data-reveal>
      <strong>{value}</strong>
      <small>{label}</small>
    </div>
  );
}

function FeatureCard({ title, text, icon, centered = false, onSelect, actionLabel = 'Explore' }) {
  const handleKeyDown = (event) => {
    if (!onSelect || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    onSelect();
  };

  return (
    <article
      className={centered ? 'feature-card centered' : 'feature-card'}
      data-reveal
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      <GoldIcon icon={icon} />
      <div className="feature-card-content">
        <h3>{title}</h3>
        <div className="card-small-line" aria-hidden="true" />
        <p>{text}</p>
        <span className="explore-link">{actionLabel} <b aria-hidden="true">-&gt;</b></span>
      </div>
    </article>
  );
}

function ProductCard({ category, onSelect }) {
  const hasBackImage = Boolean(category.backImage);
  const animationType = category.animationType || (hasBackImage ? 'front-back-display' : 'royal-zoom-right');
  const visualClass = [
    'shirt-visual',
    !hasBackImage ? 'single-visual' : '',
    animationType === 'hover-right-pair' || category.visualType === 'person-pair' ? 'person-visual pair-hover-visual' : '',
    animationType === 'royal-float' ? 'royal-float-visual' : '',
    animationType,
  ].filter(Boolean).join(' ');

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
      <div className={visualClass} style={getVisualStyleVars(category)} aria-hidden="true">
        {hasBackImage && <img className="shirt-image back" src={category.backImage} alt="" loading="lazy" decoding="async" />}
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
  const hasBackImage = Boolean(style.backImage);
  const animationType = style.animationType || (hasBackImage ? 'front-back-display' : 'royal-zoom-right');
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

function ServicesHeroShowcase({ categories, onSelect }) {
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
        <span>Royal T-shirt Gallery</span>
        <h2>Sample Style Movement</h2>
        <p>Auto-moving sample display for logo T-shirts, premium cotton, and custom apparel categories.</p>
      </div>
      <div className="showcase-track-wrap">
        <div className="showcase-track">
          {slides.map((slide, index) => (
            <button className="showcase-slide" type="button" key={`${slide.id}-${index}`} onClick={() => onSelect(slide.categoryId)}>
              <div className="showcase-shirt-stage" style={{ '--card-bg': slide.cardGradient || defaultGradient }}>
                {slide.backImage && <img className="showcase-shirt back" src={slide.backImage} alt="" loading="lazy" decoding="async" />}
                <img className={slide.backImage ? 'showcase-shirt front' : 'showcase-shirt front single'} src={slide.frontImage} alt="" loading="lazy" decoding="async" />
                <div className="shirt-caption showcase-caption">
                  <strong>{slide.title}</strong>
                  <span>LIYAN'S VASTRA</span>
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

function HomePage({ content, categories, setActivePage, setServiceFocus }) {
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
          {content.site.storyParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="mini-stat-grid">
            <Stat value="220 GSM" label="Premium Weight Fabric" />
            <Stat value="100%" label="Pure Cotton" />
            <Stat value="GST" label="Registered" />
            <Stat value="Pan India" label="Delivery" />
          </div>
        </div>
      </section>

      <FeaturedProducts categories={categories} setActivePage={setActivePage} setServiceFocus={setServiceFocus} />
      <WhyChoose setActivePage={setActivePage} setServiceFocus={setServiceFocus} />
      <Testimonials />
    </>
  );
}

function WhyChoose({ setActivePage, setServiceFocus }) {
  const cards = [
    ['Premium Fabric Quality', '100% premium cotton with superior GSM for lasting comfort and durability.', 'fabric', 'premium-cotton', 'View Cotton'],
    ['Comfortable Fit', 'Thoughtfully designed cuts that support clean everyday T-shirt styling.', 'fit', 'premium-cotton', 'View Fits'],
    ['Unisex Designs', 'Versatile styles crafted for logo apparel, teams, and brand enquiries.', 'group', 'custom-models', 'View Models'],
    ['Logo Customization', 'Logo placement and styling support for brand and team apparel enquiries.', 'design', 'logo-shirts', 'View Logo Styles'],
    ['Easy Enquiry', 'Quick WhatsApp and email communication for custom T-shirt requirements.', 'chat', 'contact', 'Contact'],
    ['Pan India Support', 'Delivery and support discussion available for customers across India.', 'delivery', 'contact', 'Contact'],
  ];

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
          {cards.map(([title, text, icon, target, actionLabel]) => (
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
  return (
    <>
      <PageHero eyebrow="Our Story" title={`About ${brand}`} subtitle={content.site.aboutSubtitle} />
      <section className="section-block journey-section">
        <div className="container narrow">
          <SectionTitle eyebrow="Who We Are" title="Our Journey" />
          <div className="journey-copy" data-reveal>
            {content.site.aboutJourney.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
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
      <Values setActivePage={setActivePage} setServiceFocus={setServiceFocus} />
      <BusinessInformation />
      <section className="work-together" id="lets-work-together" data-reveal>
        <h2>Let's Work Together</h2>
        <p>Partner with us for premium apparel solutions tailored to your needs.</p>
        <button className="gold-button" onClick={() => setActivePage('Contact')}>Get In Touch</button>
      </section>
    </>
  );
}

function Values({ setActivePage, setServiceFocus }) {
  const values = [
    ['Quality First', 'Premium fabrics and superior craftsmanship in every product we create.', 'quality', 'premium-cotton', 'View Quality'],
    ['Customer Care', 'Your satisfaction is our priority from purchase to delivery and beyond.', 'care', 'contact', 'Contact'],
    ['Transparency', 'Honest pricing, clear policies, and open communication at every step.', 'transparent', 'business-information', 'View Details'],
    ['Inclusivity', 'Unisex designs crafted to flatter and fit people of all body types.', 'inclusive', 'custom-models', 'View Models'],
  ];

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
          {values.map(([title, text, icon, target, actionLabel]) => (
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
    <section className="section-block services-page page-enter" style={{ '--service-page-bg': `url(${background})` }}>
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
              <span className="explore-link">View Styles <b aria-hidden="true">-&gt;</b></span>
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
function ContactPage({ content }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contacts = [
    ['Our Address', "LIYAN'S VASTRA\nNo 53 G1 Sudha Madhuri Homes\nNalluruhalli Main Road\nOpp. HP Petrol Pump, DNA Anantha Layout\nBengaluru - 560066, Karnataka", 'location'],
    ['Phone', `${displayPhone}\nMon - Sat: 10 AM - 6 PM IST`, 'phone'],
    ['Email', `${emailAddress}\nWe reply within 24 hours`, 'email'],
    ['Business Hours', 'Monday - Saturday\n10:00 AM - 6:00 PM IST', 'clock'],
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

  const openContactCard = (title) => {
    if (title === 'Phone') {
      window.location.href = `tel:${phoneNumber}`;
      return;
    }
    if (title === 'Email') {
      window.location.href = `mailto:${emailAddress}`;
      return;
    }
    document.querySelector('.message-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleContactKeyDown = (event, title) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openContactCard(title);
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
              <article
                className="contact-card royal-text-card"
                key={title}
                role="button"
                tabIndex={0}
                onClick={() => openContactCard(title)}
                onKeyDown={(event) => handleContactKeyDown(event, title)}
              >
                <GoldIcon icon={icon} />
                <div>
                  <h3>{title}</h3>
                  <div className="card-small-line" aria-hidden="true" />
                  {renderContactText(title, text)}
                  <span className="explore-link">{title === 'Phone' ? 'Call Now' : title === 'Email' ? 'Send Email' : 'Open Form'} <b aria-hidden="true">-&gt;</b></span>
                </div>
              </article>
            ))}
          </div>
        </div>
        <form className="message-card" data-reveal onSubmit={handleSubmit}>
          <h2>{content.site.contactTitle}</h2>
          <p>{content.site.contactSubtitle}</p>
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

function AdminLoginPage({ setActivePage, setIsAdminAuthed }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();
    if (credentials.email.trim() === adminEmail && credentials.password === adminPassword) {
      localStorage.setItem(authKey, 'true');
      setIsAdminAuthed(true);
      setActivePage('AdminDashboard');
      return;
    }
    setError('Invalid admin email or password.');
  };

  return (
    <section className="admin-page page-enter" style={{ backgroundImage: `url(${background})` }}>
      <form className="admin-login-card" onSubmit={handleLogin}>
        <img src={logo} alt={brand} />
        <h1>Admin Login</h1>
        <p>Private content editor for LIYAN'S VASTRA.</p>
        <label>Email<input type="email" value={credentials.email} onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))} /></label>
        <label>Password<input type="password" value={credentials.password} onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))} /></label>
        {error && <p className="form-status error">{error}</p>}
        <button className="gold-button" type="submit">Login</button>
      </form>
    </section>
  );
}

function ImageUploadField({ label, value, onChange, required = false, allowClear = false }) {
  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result || value));
    reader.readAsDataURL(file);
  };

  return (
    <label className="image-upload-field">
      <span className="upload-label-row">
        {label}
        {required && <small>Required</small>}
      </span>
      <input type="file" accept="image/*" onChange={handleFile} />
      <span className="upload-note">
        {required
          ? (value ? 'Front image selected' : 'Front image is required')
          : (value ? (value.startsWith('data:') ? 'Uploaded image selected' : 'Using current project image') : 'Optional - no back image')}
      </span>
      {allowClear && value && (
        <button className="dark-button upload-clear" type="button" onClick={() => onChange('')}>
          Remove Back Image
        </button>
      )}
    </label>
  );
}

function VisualPreview({ item, badge = 'Live Preview' }) {
  return (
    <div className="admin-visual-preview">
      <span>{badge}</span>
      <ProductCard category={{ ...item, badge, count: item.count || 'Preview', rate: item.rate || 'Quote Based' }} onSelect={() => {}} />
    </div>
  );
}

function ImageAdjustmentControls({ title, prefix, item, updateField, disabled = false }) {
  const fitValue = item[`${prefix}Fit`] || 'contain';
  return (
    <div className={disabled ? 'image-adjust-card disabled' : 'image-adjust-card'}>
      <h4>{title}</h4>
      {disabled ? (
        <p>Add a backside image to enable backside crop and movement controls.</p>
      ) : (
        <>
          <label>
            Image Zoom
            <input type="range" min="0.72" max="1.65" step="0.01" value={item[`${prefix}Zoom`] || 1} onChange={(event) => updateField(`${prefix}Zoom`, Number(event.target.value))} />
          </label>
          <div className="form-two compact">
            <label>
              Move Left / Right
              <input type="range" min="-38" max="38" step="1" value={item[`${prefix}X`] || 0} onChange={(event) => updateField(`${prefix}X`, Number(event.target.value))} />
            </label>
            <label>
              Move Top / Bottom
              <input type="range" min="-28" max="28" step="1" value={item[`${prefix}Y`] || 0} onChange={(event) => updateField(`${prefix}Y`, Number(event.target.value))} />
            </label>
          </div>
          <label>
            Crop Method
            <select value={fitValue} onChange={(event) => updateField(`${prefix}Fit`, event.target.value)}>
              <option value="contain">Full Image</option>
              <option value="cover">Crop Fill</option>
              <option value="scale-down">Scale Down</option>
            </select>
          </label>
        </>
      )}
    </div>
  );
}

function RoyalVisualControls({ item, updateField }) {
  const selectedGradient = item.cardGradient || defaultGradient;
  return (
    <div className="royal-visual-editor">
      <div className="form-two">
        <label>
          Container Gradient
          <select value={selectedGradient} onChange={(event) => updateField('cardGradient', event.target.value)}>
            {gradientOptions.map(([, label, value]) => <option key={label} value={value}>{label}</option>)}
          </select>
        </label>
        <label>
          Animation Style
          <select value={item.animationType || (item.backImage ? 'front-back-display' : 'royal-zoom-right')} onChange={(event) => updateField('animationType', event.target.value)}>
            {animationOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
      </div>
      <div className="image-adjust-grid">
        <ImageAdjustmentControls title="Frontside Crop & Position" prefix="front" item={item} updateField={updateField} />
        <ImageAdjustmentControls title="Backside Crop & Position" prefix="back" item={item} updateField={updateField} disabled={!item.backImage} />
      </div>
      <VisualPreview item={item} />
    </div>
  );
}

function AdminSaveBar({ status, onSave }) {
  return (
    <div className="admin-save-bar">
      <button className="gold-button" type="button" onClick={() => onSave()}>Save</button>
      {status?.message && <span className={status.type === 'success' ? 'success' : 'error'}>{status.message}</span>}
    </div>
  );
}

function AdminDashboardPage({ content, setContent, setActivePage, setIsAdminAuthed, setAdminEditCategoryIndex, setAdminEditItemIndex, onSaveContent, adminSaveStatus }) {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const selectedCategory = content.categories[selectedCategoryIndex] || content.categories[0];
  const selectedItem = selectedCategory ? normalizeStyleItem(selectedCategory.items[selectedItemIndex], selectedCategory, selectedItemIndex) : null;

  const updateSite = (field, value) => {
    setContent((current) => ({ ...current, site: { ...current.site, [field]: value } }));
  };

  const updateTextList = (field, value) => {
    updateSite(field, value.split('\n').filter((line) => line.trim()));
  };

  const updateCategory = (index, field, value) => {
    setContent((current) => ({
      ...current,
      categories: current.categories.map((category, categoryIndex) => (
        categoryIndex === index ? { ...category, [field]: value } : category
      )),
    }));
  };

  const toggleCategory = (index, field, checked) => {
    setContent((current) => ({
      ...current,
      categories: current.categories.map((category, categoryIndex) => (
        categoryIndex === index ? { ...category, [field]: checked } : category
      )),
    }));
  };

  const updateCategoryItems = (index, value) => {
    setContent((current) => ({
      ...current,
      categories: current.categories.map((category, categoryIndex) => (
        categoryIndex === index ? {
          ...category,
          items: value.split('\n').filter((line) => line.trim()).map((title, itemIndex) => normalizeStyleItem(title, category, itemIndex)),
        } : category
      )),
    }));
  };

  const updateGroupItem = (categoryIndex, itemIndex, field, value) => {
    setContent((current) => ({
      ...current,
      categories: current.categories.map((category, currentCategoryIndex) => {
        if (currentCategoryIndex !== categoryIndex) return category;
        return {
          ...category,
          items: category.items.map((item, currentItemIndex) => {
            if (currentItemIndex !== itemIndex) return item;
            return { ...normalizeStyleItem(item, category, itemIndex), [field]: value };
          }),
        };
      }),
    }));
  };

  const addCategory = () => {
    const title = `New T-shirt Category ${content.categories.length + 1}`;
    setContent((current) => ({
      ...current,
      categories: [
        ...current.categories,
        {
          id: slugify(title),
          title,
          text: 'Add description for this category.',
          badge: 'New Style',
          count: '0 styles',
          rate: 'Quote Based',
          frontImage: shirtFrontImage,
          backImage: '',
          animationType: 'royal-zoom-right',
          cardGradient: defaultGradient,
          frontZoom: 1,
          frontX: 0,
          frontY: 0,
          frontFit: 'contain',
          backZoom: 1,
          backX: 0,
          backY: 0,
          backFit: 'contain',
          showOnHome: true,
          showOnServices: true,
          items: ['New Style Group'],
        },
      ],
    }));
    setSelectedCategoryIndex(content.categories.length);
    setSelectedItemIndex(0);
  };

  const removeCategory = (index) => {
    setContent((current) => ({ ...current, categories: current.categories.filter((_, categoryIndex) => categoryIndex !== index) }));
    setSelectedCategoryIndex(0);
    setSelectedItemIndex(0);
  };

  const addGroupItem = (categoryIndex) => {
    setContent((current) => ({
      ...current,
      categories: current.categories.map((category, currentCategoryIndex) => {
        if (currentCategoryIndex !== categoryIndex) return category;
        const title = `New Style Container ${category.items.length + 1}`;
        return {
          ...category,
          items: [
            ...category.items,
            normalizeStyleItem({
              id: slugify(`${category.id}-${title}`),
              title,
              text: category.text,
              frontImage: category.frontImage,
              backImage: category.backImage,
              animationType: category.animationType || (category.backImage ? 'front-back-display' : 'royal-zoom-right'),
              clothStyle: 'Premium Tee',
              fabric: 'Premium Cotton',
              fit: 'Regular Comfort Fit',
              rating: '4.8 / 5',
              rate: category.rate,
              showOnHome: false,
              showOnServices: true,
            }, category, category.items.length),
          ],
        };
      }),
    }));
    setSelectedItemIndex(selectedCategory?.items.length || 0);
  };

  const removeGroupItem = (categoryIndex, itemIndex) => {
    setContent((current) => ({
      ...current,
      categories: current.categories.map((category, currentCategoryIndex) => (
        currentCategoryIndex === categoryIndex
          ? { ...category, items: category.items.filter((_, currentItemIndex) => currentItemIndex !== itemIndex) }
          : category
      )),
    }));
    setSelectedItemIndex(0);
  };

  const resetContent = () => {
    setContent(defaultAdminContent);
  };

  const logout = () => {
    localStorage.removeItem(authKey);
    setIsAdminAuthed(false);
    setActivePage('AdminLogin');
  };

  return (
    <section className="admin-page admin-dashboard page-enter" style={{ backgroundImage: `url(${background})` }}>
      <div className="container">
        {deleteTarget && (
          <div className="admin-modal" role="dialog" aria-modal="true">
            <div className="admin-modal-card">
              <h2>Confirm Delete</h2>
              <p>Are you sure you want to delete this {deleteTarget.type === 'category' ? 'category' : 'image container'}?</p>
              <div className="admin-actions">
                <button className="dark-button" type="button" onClick={() => setDeleteTarget(null)}>Cancel</button>
                <button
                  className="gold-button"
                  type="button"
                  onClick={() => {
                    if (deleteTarget.type === 'category') removeCategory(deleteTarget.categoryIndex);
                    if (deleteTarget.type === 'item') removeGroupItem(deleteTarget.categoryIndex, deleteTarget.itemIndex);
                    setDeleteTarget(null);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="admin-topbar">
          <div>
            <span>Private Admin</span>
            <h1>Website Content Dashboard</h1>
          </div>
          <div className="admin-actions">
            <button className="dark-button" type="button" onClick={() => setActivePage('Home')}>View Site</button>
            <button className="dark-button" type="button" onClick={logout}>Logout</button>
          </div>
        </div>
        <div className="admin-grid">
          <section className="admin-panel">
            <h2>Home Page</h2>
            <label>Hero Title<input value={content.site.heroTitle} onChange={(event) => updateSite('heroTitle', event.target.value)} /></label>
            <label>Hero Text<textarea rows="4" value={content.site.heroText} onChange={(event) => updateSite('heroText', event.target.value)} /></label>
            <label>Our Story Title<input value={content.site.storyTitle} onChange={(event) => updateSite('storyTitle', event.target.value)} /></label>
            <label>Our Story Paragraphs<textarea rows="7" value={content.site.storyParagraphs.join('\n')} onChange={(event) => updateTextList('storyParagraphs', event.target.value)} /></label>
            <AdminSaveBar status={adminSaveStatus} onSave={onSaveContent} />
          </section>

          <section className="admin-panel">
            <h2>About & Contact Pages</h2>
            <label>About Subtitle<input value={content.site.aboutSubtitle} onChange={(event) => updateSite('aboutSubtitle', event.target.value)} /></label>
            <label>Journey Paragraphs<textarea rows="6" value={content.site.aboutJourney.join('\n')} onChange={(event) => updateTextList('aboutJourney', event.target.value)} /></label>
            <label>Contact Form Title<input value={content.site.contactTitle} onChange={(event) => updateSite('contactTitle', event.target.value)} /></label>
            <label>Contact Form Subtitle<input value={content.site.contactSubtitle} onChange={(event) => updateSite('contactSubtitle', event.target.value)} /></label>
            <AdminSaveBar status={adminSaveStatus} onSave={onSaveContent} />
          </section>
        </div>

        <section className="admin-panel admin-wide">
          <div className="admin-section-head">
            <div>
              <h2>Image Containers & Service Categories</h2>
              <p>Select a category to edit it at the top, then manage its image containers below.</p>
            </div>
            <div className="admin-actions">
              <button className="gold-button" type="button" onClick={addCategory}>Add Category On Home Page</button>
              <button className="dark-button" type="button" onClick={resetContent}>Reset Default</button>
            </div>
          </div>
          {false && selectedCategory && (
            <div className="admin-edit-focus">
              <h3>Edit Selected Category</h3>
              <div className="form-two">
                <label>T-shirt / Category Name<input value={selectedCategory.title} onChange={(event) => updateCategory(selectedCategoryIndex, 'title', event.target.value)} /></label>
                <label>Brand / Badge Name<input value={selectedCategory.badge} onChange={(event) => updateCategory(selectedCategoryIndex, 'badge', event.target.value)} /></label>
              </div>
              <label>Description<textarea rows="3" value={selectedCategory.text} onChange={(event) => updateCategory(selectedCategoryIndex, 'text', event.target.value)} /></label>
              <div className="form-two">
                <label>Cloth Count<input value={selectedCategory.count} onChange={(event) => updateCategory(selectedCategoryIndex, 'count', event.target.value)} /></label>
                <label>Rating / Rate<input value={selectedCategory.rate} onChange={(event) => updateCategory(selectedCategoryIndex, 'rate', event.target.value)} /></label>
              </div>
              <div className="form-two">
                <label>Front Image URL<input value={selectedCategory.frontImage} onChange={(event) => updateCategory(selectedCategoryIndex, 'frontImage', event.target.value)} /></label>
                <label>Back Image URL<input value={selectedCategory.backImage} onChange={(event) => updateCategory(selectedCategoryIndex, 'backImage', event.target.value)} /></label>
              </div>
              <div className="admin-checks">
                <label><input type="checkbox" checked={selectedCategory.showOnHome !== false} onChange={(event) => toggleCategory(selectedCategoryIndex, 'showOnHome', event.target.checked)} /> Show on Home page</label>
                <label><input type="checkbox" checked={selectedCategory.showOnServices !== false} onChange={(event) => toggleCategory(selectedCategoryIndex, 'showOnServices', event.target.checked)} /> Show on Services category page</label>
              </div>
            </div>
          )}
          <ScrollArrowRow className="admin-category-list admin-scroll-row">
            {content.categories.map((category, index) => (
              <article className={selectedCategoryIndex === index ? 'admin-category-card selected' : 'admin-category-card'} key={`${category.id}-${index}`}>
                <div className="admin-category-preview" style={getVisualStyleVars(category)}>
                  <img src={category.frontImage} alt="" />
                  {category.backImage && <img src={category.backImage} alt="" />}
                </div>
                <div className="admin-category-fields">
                  <strong>{category.title}</strong>
                  <span>{category.badge}</span>
                  <small>{category.count} / {category.rate}</small>
                  <div className="admin-actions">
                    <button className="gold-button" type="button" onClick={() => { goTop(); setActivePage('AdminCategoryEditor', { categoryIndex: index, itemIndex: 0 }); }}>Edit</button>
                    <button className="dark-button" type="button" onClick={() => setDeleteTarget({ type: 'category', categoryIndex: index })}>Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </ScrollArrowRow>
          {false && selectedCategory && (
            <div className="admin-group-editor">
              <div className="admin-section-head">
                <div>
                  <h2>{selectedCategory.title} Containers</h2>
                  <p>Edit containers shown inside this category group page.</p>
                </div>
                <button className="gold-button" type="button" onClick={() => addGroupItem(selectedCategoryIndex)}>Add New Container</button>
              </div>
              {selectedItem && (
                <div className="admin-edit-focus">
                  <h3>Edit Selected Image Container</h3>
                  <div className="form-two">
                    <label>Cloth Name<input value={selectedItem.title} onChange={(event) => updateGroupItem(selectedCategoryIndex, selectedItemIndex, 'title', event.target.value)} /></label>
                    <label>Rating<input value={selectedItem.rating} onChange={(event) => updateGroupItem(selectedCategoryIndex, selectedItemIndex, 'rating', event.target.value)} /></label>
                  </div>
                  <label>Description<textarea rows="3" value={selectedItem.text} onChange={(event) => updateGroupItem(selectedCategoryIndex, selectedItemIndex, 'text', event.target.value)} /></label>
                  <div className="form-two">
                    <label>Front Image URL<input value={selectedItem.frontImage} onChange={(event) => updateGroupItem(selectedCategoryIndex, selectedItemIndex, 'frontImage', event.target.value)} /></label>
                    <label>Back Image URL<input value={selectedItem.backImage} onChange={(event) => updateGroupItem(selectedCategoryIndex, selectedItemIndex, 'backImage', event.target.value)} /></label>
                  </div>
                  <div className="form-two">
                    <label>Cloth Style<input value={selectedItem.clothStyle} onChange={(event) => updateGroupItem(selectedCategoryIndex, selectedItemIndex, 'clothStyle', event.target.value)} /></label>
                    <label>Rate<input value={selectedItem.rate} onChange={(event) => updateGroupItem(selectedCategoryIndex, selectedItemIndex, 'rate', event.target.value)} /></label>
                  </div>
                </div>
              )}
              <ScrollArrowRow className="admin-category-list admin-scroll-row">
                {selectedCategory.items.map((item, itemIndex) => {
                  const style = normalizeStyleItem(item, selectedCategory, itemIndex);
                  return (
                    <article className={selectedItemIndex === itemIndex ? 'admin-category-card selected' : 'admin-category-card'} key={style.id}>
                      <div className="admin-category-preview" style={getVisualStyleVars(style)}>
                        <img src={style.frontImage} alt="" />
                        {style.backImage && <img src={style.backImage} alt="" />}
                      </div>
                      <div className="admin-category-fields">
                        <strong>{style.title}</strong>
                        <span>{selectedCategory.badge}</span>
                        <small>{style.rating} / {style.rate}</small>
                        <div className="admin-actions">
                          <button className="gold-button" type="button" onClick={() => setSelectedItemIndex(itemIndex)}>Edit</button>
                          <button className="dark-button" type="button" onClick={() => setDeleteTarget({ type: 'item', categoryIndex: selectedCategoryIndex, itemIndex })}>Delete</button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </ScrollArrowRow>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

function AdminCategoryEditorPage({ content, setContent, setActivePage, adminEditCategoryIndex, setAdminEditCategoryIndex, setAdminEditItemIndex, onSaveContent, adminSaveStatus }) {
  const categoryIndex = clampIndex(adminEditCategoryIndex, content.categories.length);
  const category = content.categories[categoryIndex] || content.categories[0];
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [dragItemIndex, setDragItemIndex] = useState(null);

  const updateCategory = (field, value) => {
    setContent((current) => ({
      ...current,
      categories: current.categories.map((item, index) => index === categoryIndex ? { ...item, [field]: value } : item),
    }));
  };

  const toggleCategory = (field, checked) => updateCategory(field, checked);
  const toggleGroupItem = (itemIndex, field, checked) => {
    setContent((current) => ({
      ...current,
      categories: current.categories.map((item, index) => {
        if (index !== categoryIndex) return item;
        return {
          ...item,
          items: item.items.map((group, groupIndex) => (
            groupIndex === itemIndex ? { ...normalizeStyleItem(group, item, itemIndex), [field]: checked } : group
          )),
        };
      }),
    }));
  };

  const addGroupItem = () => {
    setContent((current) => ({
      ...current,
      categories: current.categories.map((item, index) => {
        if (index !== categoryIndex) return item;
        const title = `New Style Container ${item.items.length + 1}`;
        return {
          ...item,
          items: [...item.items, normalizeStyleItem({ title, text: item.text, frontImage: item.frontImage, backImage: item.backImage, animationType: item.animationType || (item.backImage ? 'front-back-display' : 'royal-zoom-right'), showOnHome: false, showOnServices: true }, item, item.items.length)],
        };
      }),
    }));
  };

  const removeGroupItem = (itemIndex) => {
    setContent((current) => ({
      ...current,
      categories: current.categories.map((item, index) => index === categoryIndex ? { ...item, items: item.items.filter((_, currentIndex) => currentIndex !== itemIndex) } : item),
    }));
    setDeleteTarget(null);
  };

  const reorderGroupItems = (fromIndex, toIndex) => {
    if (!Number.isInteger(fromIndex) || !Number.isInteger(toIndex) || fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= category.items.length || toIndex >= category.items.length) return;
    const nextItems = reorderArray(category.items, fromIndex, toIndex);
    const nextContent = {
      ...content,
      categories: content.categories.map((item, index) => (
        index === categoryIndex ? { ...item, items: nextItems } : item
      )),
    };
    setContent(nextContent);
    setAdminEditItemIndex(toIndex);
    onSaveContent(nextContent);
  };

  const startItemDrag = (event, itemIndex) => {
    setDragItemIndex(itemIndex);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', `${itemIndex}`);
  };

  const dropItem = (event, targetIndex) => {
    event.preventDefault();
    const sourceIndex = dragItemIndex ?? Number(event.dataTransfer.getData('text/plain'));
    setDragItemIndex(null);
    reorderGroupItems(sourceIndex, targetIndex);
  };

  if (!category) return null;

  return (
    <section className="admin-page admin-dashboard page-enter" style={{ backgroundImage: `url(${background})` }}>
      <div className="container">
        {deleteTarget !== null && (
          <div className="admin-modal" role="dialog" aria-modal="true">
            <div className="admin-modal-card">
              <h2>Confirm Delete</h2>
              <p>Are you sure you want to delete this image container?</p>
              <div className="admin-actions">
                <button className="dark-button" type="button" onClick={() => setDeleteTarget(null)}>Cancel</button>
                <button className="gold-button" type="button" onClick={() => removeGroupItem(deleteTarget)}>Delete</button>
              </div>
            </div>
          </div>
        )}
        <div className="admin-topbar">
          <div><span>Category Editor</span><h1>{category.title}</h1></div>
          <div className="admin-actions">
            <button className="dark-button" type="button" onClick={() => setActivePage('AdminDashboard')}>Back Dashboard</button>
            <button className="gold-button" type="button" onClick={addGroupItem}>Add New Container</button>
          </div>
        </div>
        <section className="admin-panel admin-wide">
          <div className="admin-edit-focus">
            <h3>Edit Category</h3>
            <div className="form-two">
              <label>T-shirt / Category Name<input value={category.title} onChange={(event) => updateCategory('title', event.target.value)} /></label>
              <label>Brand / Badge Name<input value={category.badge} onChange={(event) => updateCategory('badge', event.target.value)} /></label>
            </div>
            <label>Description<textarea rows="3" value={category.text} onChange={(event) => updateCategory('text', event.target.value)} /></label>
            <div className="form-two">
              <label>Cloth Count<input value={category.count} onChange={(event) => updateCategory('count', event.target.value)} /></label>
              <label>Rating / Rate<input value={category.rate} onChange={(event) => updateCategory('rate', event.target.value)} /></label>
            </div>
            <div className="form-two">
              <ImageUploadField label="Front Image File" value={category.frontImage} required onChange={(value) => updateCategory('frontImage', value)} />
              <ImageUploadField label="Back Image File" value={category.backImage} allowClear onChange={(value) => updateCategory('backImage', value)} />
            </div>
            <RoyalVisualControls item={category} updateField={updateCategory} />
            <div className="admin-checks">
              <label><input type="checkbox" checked={category.showOnHome !== false} onChange={(event) => toggleCategory('showOnHome', event.target.checked)} /> Show on Home page</label>
              <label><input type="checkbox" checked={category.showOnServices !== false} onChange={(event) => toggleCategory('showOnServices', event.target.checked)} /> Show on Services category page</label>
            </div>
            <AdminSaveBar status={adminSaveStatus} onSave={onSaveContent} />
          </div>
          <div className="admin-section-head">
            <div><h2>{category.title} Containers</h2><p>Edit containers shown inside this category group page.</p></div>
          </div>
          <ScrollArrowRow className="admin-category-list admin-scroll-row">
            {category.items.map((item, itemIndex) => {
              const style = normalizeStyleItem(item, category, itemIndex);
              return (
                <article
                  className={dragItemIndex === itemIndex ? 'admin-category-card dragging' : 'admin-category-card'}
                  key={style.id}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => dropItem(event, itemIndex)}
                >
                  <button
                    className="drag-handle"
                    type="button"
                    draggable
                    onClick={(event) => event.stopPropagation()}
                    onDragStart={(event) => startItemDrag(event, itemIndex)}
                    onDragEnd={() => setDragItemIndex(null)}
                    aria-label={`Move ${style.title}`}
                  />
                  <div className="admin-category-preview" style={getVisualStyleVars(style)}><img src={style.frontImage} alt="" />{style.backImage && <img src={style.backImage} alt="" />}</div>
                  <div className="admin-category-fields">
                    <strong>{style.title}</strong><span>{category.badge}</span><small>{style.rating} / {style.rate}</small>
                    <div className="admin-checks compact-checks">
                      <label><input type="checkbox" checked={style.showOnHome === true} onChange={(event) => toggleGroupItem(itemIndex, 'showOnHome', event.target.checked)} /> Show on Home page</label>
                      <label><input type="checkbox" checked={style.showOnServices !== false} onChange={(event) => toggleGroupItem(itemIndex, 'showOnServices', event.target.checked)} /> Show on Services category page</label>
                    </div>
                    <div className="admin-actions">
                      <button className="gold-button" type="button" onClick={() => { goTop(); setActivePage('AdminContainerEditor', { categoryIndex, itemIndex }); }}>Edit</button>
                      <button className="dark-button" type="button" onClick={() => setDeleteTarget(itemIndex)}>Delete</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </ScrollArrowRow>
        </section>
      </div>
    </section>
  );
}

function AdminContainerEditorPage({ content, setContent, setActivePage, adminEditCategoryIndex, adminEditItemIndex, setAdminEditItemIndex, onSaveContent, adminSaveStatus }) {
  const editorCategoryIndex = clampIndex(adminEditCategoryIndex, content.categories.length);
  const category = content.categories[editorCategoryIndex] || content.categories[0];
  const itemIndex = clampIndex(adminEditItemIndex, category?.items.length || 1);
  const selectedItem = category ? normalizeStyleItem(category.items[itemIndex], category, itemIndex) : null;
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [dragItemIndex, setDragItemIndex] = useState(null);

  const updateGroupItem = (field, value) => {
    setContent((current) => ({
      ...current,
      categories: current.categories.map((item, categoryIndex) => {
        if (categoryIndex !== editorCategoryIndex) return item;
        return { ...item, items: item.items.map((group, groupIndex) => groupIndex === itemIndex ? { ...normalizeStyleItem(group, item, itemIndex), [field]: value } : group) };
      }),
    }));
  };

  const toggleGroupItem = (field, checked) => updateGroupItem(field, checked);

  const removeGroupItem = (targetIndex) => {
    setContent((current) => ({
      ...current,
      categories: current.categories.map((item, categoryIndex) => (
        categoryIndex === editorCategoryIndex
          ? { ...item, items: item.items.filter((_, currentIndex) => currentIndex !== targetIndex) }
          : item
      )),
    }));
    setAdminEditItemIndex(0);
    setDeleteTarget(null);
  };

  const getSelectedIndexAfterReorder = (selectedIndex, fromIndex, toIndex) => {
    if (selectedIndex === fromIndex) return toIndex;
    if (fromIndex < selectedIndex && selectedIndex <= toIndex) return selectedIndex - 1;
    if (toIndex <= selectedIndex && selectedIndex < fromIndex) return selectedIndex + 1;
    return selectedIndex;
  };

  const reorderGroupItems = (fromIndex, toIndex) => {
    if (!Number.isInteger(fromIndex) || !Number.isInteger(toIndex) || fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= category.items.length || toIndex >= category.items.length) return;
    const nextItems = reorderArray(category.items, fromIndex, toIndex);
    const nextSelectedIndex = getSelectedIndexAfterReorder(itemIndex, fromIndex, toIndex);
    const nextContent = {
      ...content,
      categories: content.categories.map((item, categoryIndex) => (
        categoryIndex === editorCategoryIndex ? { ...item, items: nextItems } : item
      )),
    };
    setContent(nextContent);
    setAdminEditItemIndex(nextSelectedIndex);
    window.history.replaceState({}, '', adminEditorPath('AdminContainerEditor', editorCategoryIndex, nextSelectedIndex));
    onSaveContent(nextContent);
  };

  const startItemDrag = (event, index) => {
    setDragItemIndex(index);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', `${index}`);
  };

  const dropItem = (event, targetIndex) => {
    event.preventDefault();
    const sourceIndex = dragItemIndex ?? Number(event.dataTransfer.getData('text/plain'));
    setDragItemIndex(null);
    reorderGroupItems(sourceIndex, targetIndex);
  };

  if (!category || !selectedItem) return null;

  return (
    <section className="admin-page admin-dashboard page-enter" style={{ backgroundImage: `url(${background})` }}>
      <div className="container">
        {deleteTarget !== null && (
          <div className="admin-modal" role="dialog" aria-modal="true">
            <div className="admin-modal-card">
              <h2>Confirm Delete</h2>
              <p>Are you sure you want to delete this image container?</p>
              <div className="admin-actions">
                <button className="dark-button" type="button" onClick={() => setDeleteTarget(null)}>Cancel</button>
                <button className="gold-button" type="button" onClick={() => removeGroupItem(deleteTarget)}>Delete</button>
              </div>
            </div>
          </div>
        )}
        <div className="admin-topbar">
          <div><span>Container Editor</span><h1>{selectedItem.title}</h1></div>
          <button className="dark-button" type="button" onClick={() => setActivePage('AdminCategoryEditor', { categoryIndex: editorCategoryIndex, itemIndex: 0 })}>Back Category</button>
        </div>
        <section className="admin-panel admin-wide">
          <div className="admin-edit-focus">
            <h3>Edit Image Container</h3>
            <div className="form-two">
              <label>Cloth Name<input value={selectedItem.title} onChange={(event) => updateGroupItem('title', event.target.value)} /></label>
              <label>Rating<input value={selectedItem.rating} onChange={(event) => updateGroupItem('rating', event.target.value)} /></label>
            </div>
            <label>Description<textarea rows="3" value={selectedItem.text} onChange={(event) => updateGroupItem('text', event.target.value)} /></label>
            <div className="form-two">
              <ImageUploadField label="Front Image File" value={selectedItem.frontImage} required onChange={(value) => updateGroupItem('frontImage', value)} />
              <ImageUploadField label="Back Image File" value={selectedItem.backImage} allowClear onChange={(value) => updateGroupItem('backImage', value)} />
            </div>
            <RoyalVisualControls item={selectedItem} updateField={updateGroupItem} />
            <div className="admin-checks">
              <label><input type="checkbox" checked={selectedItem.showOnHome === true} onChange={(event) => toggleGroupItem('showOnHome', event.target.checked)} /> Show on Home page</label>
              <label><input type="checkbox" checked={selectedItem.showOnServices !== false} onChange={(event) => toggleGroupItem('showOnServices', event.target.checked)} /> Show on Services category page</label>
            </div>
            <div className="form-two">
              <label>Cloth Style<input value={selectedItem.clothStyle} onChange={(event) => updateGroupItem('clothStyle', event.target.value)} /></label>
              <label>Rate<input value={selectedItem.rate} onChange={(event) => updateGroupItem('rate', event.target.value)} /></label>
            </div>
            <AdminSaveBar status={adminSaveStatus} onSave={onSaveContent} />
          </div>
          <div className="admin-section-head"><div><h2>{category.title} Containers</h2><p>Select another container to edit it.</p></div></div>
          <ScrollArrowRow className="admin-category-list admin-scroll-row">
            {category.items.map((item, index) => {
              const style = normalizeStyleItem(item, category, index);
              return (
                <article
                  className={`${index === itemIndex ? 'admin-category-card selected' : 'admin-category-card'}${dragItemIndex === index ? ' dragging' : ''}`}
                  key={style.id}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => dropItem(event, index)}
                >
                  <button
                    className="drag-handle"
                    type="button"
                    draggable
                    onClick={(event) => event.stopPropagation()}
                    onDragStart={(event) => startItemDrag(event, index)}
                    onDragEnd={() => setDragItemIndex(null)}
                    aria-label={`Move ${style.title}`}
                  />
                  <div className="admin-category-preview" style={getVisualStyleVars(style)}><img src={style.frontImage} alt="" />{style.backImage && <img src={style.backImage} alt="" />}</div>
                  <div className="admin-category-fields">
                    <strong>{style.title}</strong><span>{category.badge}</span><small>{style.rating} / {style.rate}</small>
                    <div className="admin-actions">
                      <button className="gold-button" type="button" onClick={() => { setAdminEditItemIndex(index); window.history.replaceState({}, '', adminEditorPath('AdminContainerEditor', editorCategoryIndex, index)); goTop(); }}>Edit</button>
                      <button className="dark-button" type="button" onClick={() => setDeleteTarget(index)}>Delete</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </ScrollArrowRow>
        </section>
      </div>
    </section>
  );
}

function NotFoundPage({ setActivePage }) {
  return (
    <section className="not-found-page page-enter">
      <div className="container">
        <div className="not-found-card" data-reveal>
          <img src={logo} alt={brand} />
          <span>Royal Route Not Found</span>
          <h1>404</h1>
          <p>The page you opened is not available. Return to the LIYAN'S VASTRA showcase or explore the service styles.</p>
          <div className="not-found-actions">
            <button className="gold-button" type="button" onClick={() => setActivePage('Home')}>Go Home</button>
            <button className="dark-button" type="button" onClick={() => setActivePage('Services')}>View Services</button>
          </div>
        </div>
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
        <span>Â© 2026 {brand}. All rights reserved. A Proprietorship Business.</span>
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
  const initialRoute = getPageFromLocation();
  const [activePage, setActivePageState] = useState(initialRoute.page);
  const [serviceFocus, setServiceFocus] = useState(initialRoute.serviceFocus);
  const [content, setContent] = useState(loadAdminContent);
  const [isAdminAuthed, setIsAdminAuthed] = useState(() => localStorage.getItem(authKey) === 'true');
  const [adminEditCategoryIndex, setAdminEditCategoryIndex] = useState(initialRoute.adminCategoryIndex || 0);
  const [adminEditItemIndex, setAdminEditItemIndex] = useState(initialRoute.adminItemIndex || 0);
  const [adminSaveStatus, setAdminSaveStatus] = useState({ type: '', message: '' });
  const CurrentPage = useMemo(() => ({
    Home: HomePage,
    About: AboutPage,
    Services: ServicesPage,
    ServiceDetail: ServiceDetailPage,
    Contact: ContactPage,
    NotFound: NotFoundPage,
    AdminLogin: AdminLoginPage,
    AdminDashboard: AdminDashboardPage,
    AdminCategoryEditor: AdminCategoryEditorPage,
    AdminContainerEditor: AdminContainerEditorPage,
  })[activePage] || HomePage, [activePage]);
  const navActivePage = activePage === 'ServiceDetail' ? 'Services' : activePage;
  useRevealOnScroll(activePage);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(content));
  }, [content]);

  useEffect(() => {
    let cancelled = false;
    fetch(`${apiBaseUrl}/api/admin/content`)
      .then((response) => response.json())
      .then((result) => {
        if (!cancelled && result?.ok && result.content?.site && Array.isArray(result.content?.categories)) {
          setContent(result.content);
          localStorage.setItem(storageKey, JSON.stringify(result.content));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const route = getPageFromLocation();
      setActivePageState(route.page);
      setServiceFocus(route.serviceFocus);
      if (route.adminCategoryIndex !== undefined) setAdminEditCategoryIndex(route.adminCategoryIndex);
      if (route.adminItemIndex !== undefined) setAdminEditItemIndex(route.adminItemIndex);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if ((activePage === 'AdminDashboard' || activePage === 'AdminCategoryEditor' || activePage === 'AdminContainerEditor') && !isAdminAuthed) {
      setActivePage('AdminLogin');
    }
  }, [activePage, isAdminAuthed]);

  const setActivePage = (page, adminTarget = {}) => {
    const nextCategoryIndex = adminTarget.categoryIndex ?? adminEditCategoryIndex;
    const nextItemIndex = adminTarget.itemIndex ?? adminEditItemIndex;
    if (adminTarget.categoryIndex !== undefined) setAdminEditCategoryIndex(adminTarget.categoryIndex);
    if (adminTarget.itemIndex !== undefined) setAdminEditItemIndex(adminTarget.itemIndex);
    const nextPath = page === 'ServiceDetail'
      ? `/service/group-services/${serviceFocus || content.categories[0]?.id || ''}`
      : adminEditorPath(page, nextCategoryIndex, nextItemIndex);
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
    setActivePageState(page);
  };

  const saveContentToSupabase = async (contentOverride = content) => {
    setAdminSaveStatus({ type: '', message: 'Saving content...' });
    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Email': adminEmail,
          'X-Admin-Password': adminPassword,
        },
        body: JSON.stringify({ content: contentOverride }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) throw new Error(result?.message || 'Unable to save content.');
      setAdminSaveStatus({ type: 'success', message: 'Successfully Saved' });
    } catch (error) {
      setAdminSaveStatus({ type: 'error', message: 'Unable to save to Supabase. Check backend env settings.' });
    }
  };

  useEffect(() => {
    const nextPath = activePage === 'ServiceDetail'
      ? `/service/group-services/${serviceFocus || content.categories[0]?.id || ''}`
      : adminEditorPath(activePage, adminEditCategoryIndex, adminEditItemIndex);
    if (window.location.pathname !== nextPath) {
      window.history.replaceState({}, '', nextPath);
    }
  }, [activePage, serviceFocus, content.categories, adminEditCategoryIndex, adminEditItemIndex]);

  const isAdminPage = activePage === 'AdminLogin' || activePage === 'AdminDashboard' || activePage === 'AdminCategoryEditor' || activePage === 'AdminContainerEditor';

  return (
    <>
      <div
        className="site-background"
        style={{ backgroundImage: `url(${background})` }}
        aria-hidden="true"
      />
      {!isAdminPage && <Header activePage={navActivePage} setActivePage={setActivePage} />}
      <main key={activePage}>
        <CurrentPage
          content={content}
          categories={content.categories}
          setContent={setContent}
          adminEditCategoryIndex={adminEditCategoryIndex}
          setAdminEditCategoryIndex={setAdminEditCategoryIndex}
          adminEditItemIndex={adminEditItemIndex}
          setAdminEditItemIndex={setAdminEditItemIndex}
          onSaveContent={saveContentToSupabase}
          adminSaveStatus={adminSaveStatus}
          setActivePage={setActivePage}
          serviceFocus={serviceFocus}
          setServiceFocus={setServiceFocus}
          setIsAdminAuthed={setIsAdminAuthed}
        />
      </main>
      {!isAdminPage && <Footer setActivePage={setActivePage} />}
      {!isAdminPage && <FloatingActions />}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);

