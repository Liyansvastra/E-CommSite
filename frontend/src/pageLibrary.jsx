import React, { useEffect, useMemo, useRef, useState } from 'react';
import { navItems, pageToPath, pathToPage } from './pages/pageConfig.js';

const brand = "LIYAN'S VASTRA";
const assetPath = (path) => `${import.meta.env.BASE_URL}${path}`;
const logo = assetPath('logo.png');
const background = assetPath('background.jpg');
const lifestyleImage = assetPath('background.jpg');
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const adminEmail = 'liyansvastra@brillaris.pro';
const storageKey = 'liyans_vastra_admin_content_v1';
const authKey = 'liyans_vastra_admin_auth_v1';
const adminTokenKey = 'liyans_vastra_admin_token_v1';
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
const textColorOptions = [
  ['gold-light', 'Bright Gold', '#ffc900'],
  ['gold', 'Royal Gold', '#d5ad18'],
  ['deep-gold', 'Antique Gold', '#b4872e'],
  ['black', 'Royal Black', '#141006'],
  ['charcoal', 'Charcoal', '#252525'],
  ['white', 'Pearl White', '#f7f3e8'],
  ['silver', 'Soft Silver', '#eaeaea'],
];

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
    showOnAbout: true,
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
    showOnAbout: true,
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
    showOnAbout: true,
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
  whyChooseCards: [
    { title: 'Premium Fabric Quality', text: '100% premium cotton with superior GSM for lasting comfort and durability.', icon: 'fabric', target: 'premium-cotton', actionLabel: 'View Cotton' },
    { title: 'Comfortable Fit', text: 'Thoughtfully designed cuts that support clean everyday T-shirt styling.', icon: 'fit', target: 'premium-cotton', actionLabel: 'View Fits' },
    { title: 'Unisex Designs', text: 'Versatile styles crafted for logo apparel, teams, and brand enquiries.', icon: 'group', target: 'custom-models', actionLabel: 'View Models' },
    { title: 'Logo Customization', text: 'Logo placement and styling support for brand and team apparel enquiries.', icon: 'design', target: 'logo-shirts', actionLabel: 'View Logo Styles' },
    { title: 'Easy Enquiry', text: 'Quick WhatsApp and email communication for custom T-shirt requirements.', icon: 'chat', target: 'contact', actionLabel: 'Contact' },
    { title: 'Pan India Support', text: 'Delivery and support discussion available for customers across India.', icon: 'delivery', target: 'contact', actionLabel: 'Contact' },
  ],
  valueCards: [
    { title: 'Quality First', text: 'Premium fabrics and superior craftsmanship in every product we create.', icon: 'quality', target: 'premium-cotton', actionLabel: 'View Quality' },
    { title: 'Customer Care', text: 'Your satisfaction is our priority from purchase to delivery and beyond.', icon: 'care', target: 'contact', actionLabel: 'Contact' },
    { title: 'Transparency', text: 'Honest pricing, clear policies, and open communication at every step.', icon: 'transparent', target: 'business-information', actionLabel: 'View Details' },
    { title: 'Inclusivity', text: 'Unisex designs crafted to flatter and fit people of all body types.', icon: 'inclusive', target: 'custom-models', actionLabel: 'View Models' },
  ],
  testimonials: [
    { title: 'Premium finish', text: 'The cotton feels rich, comfortable, and made for daily use.' },
    { title: 'Fast support', text: 'Quick response, clear updates, and smooth delivery experience.' },
    { title: 'Great quality', text: 'The fabric weight and stitching made the product feel premium.' },
  ],
  contactDetails: {
    address: "LIYAN'S VASTRA\nNo 53 G1 Sudha Madhuri Homes\nNalluruhalli Main Road\nOpp. HP Petrol Pump, DNA Anantha Layout\nBengaluru - 560066, Karnataka",
    phoneNumber,
    displayPhone,
    email: emailAddress,
    hours: 'Monday - Saturday\n10:00 AM - 6:00 PM IST',
    replyText: 'We reply within 24 hours',
  },
  contactTitle: 'Get In Touch',
  contactSubtitle: 'Tell us about your logo T-shirt or custom apparel requirement.',
};

const defaultAdminContent = {
  site: defaultSiteContent,
  categories: defaultServiceCategories,
};

function normalizeAdminContent(content) {
  const site = {
    ...defaultSiteContent,
    ...(content?.site || {}),
    contactDetails: {
      ...defaultSiteContent.contactDetails,
      ...(content?.site?.contactDetails || {}),
    },
  };
  const categories = Array.isArray(content?.categories) && content.categories.length
    ? content.categories.map((category, index) => {
        const fallback = defaultServiceCategories[index % defaultServiceCategories.length];
        return {
          ...fallback,
          ...(category || {}),
          items: Array.isArray(category?.items) && category.items.length ? category.items : fallback.items,
        };
      })
    : defaultServiceCategories;
  return { site, categories };
}

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
    return normalizeAdminContent(stored);
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
    captionTitleColor: typeof item === 'object' && item?.captionTitleColor ? item.captionTitleColor : category.captionTitleColor || '#ffc900',
    captionBrandColor: typeof item === 'object' && item?.captionBrandColor ? item.captionBrandColor : category.captionBrandColor || '#d5ad18',
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
    showOnAbout: typeof item === 'object' ? item?.showOnAbout === true : false,
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

const serializeTextCards = (cards = [], includeMeta = true) => cards.map((card) => (
  includeMeta
    ? [card.title, card.text, card.icon || 'category', card.target || '', card.actionLabel || 'Explore'].join(' | ')
    : [card.title, card.text].join(' | ')
)).join('\n');

const parseTextCards = (value, fallback = [], includeMeta = true) => {
  const cards = value.split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title = '', text = '', icon = 'category', target = '', actionLabel = 'Explore'] = line.split('|').map((part) => part.trim());
      return includeMeta ? { title, text, icon, target, actionLabel } : { title, text };
    })
    .filter((card) => card.title && card.text);
  return cards.length ? cards : fallback;
};

const visibleCards = (cards = []) => cards.filter((card) => card.show !== false);
const getContactDetails = (content) => ({ ...defaultSiteContent.contactDetails, ...(content.site.contactDetails || {}) });

const materialIconOptions = [
  ['category', 'Category'],
  ['fabric', 'Fabric'],
  ['fit', 'Fit'],
  ['group', 'Group'],
  ['design', 'Design'],
  ['chat', 'Chat'],
  ['delivery', 'Delivery'],
  ['quality', 'Quality'],
  ['care', 'Care'],
  ['transparent', 'Transparent'],
  ['inclusive', 'Inclusive'],
  ['location', 'Location'],
  ['phone', 'Phone'],
  ['email', 'Email'],
  ['clock', 'Clock'],
  ['download', 'Download'],
  ['hexagon', 'Hexagon'],
  ['nodes', 'Network'],
  ['support', 'Support'],
  ['megaphone', 'Megaphone'],
  ['muted', 'Muted'],
  ['mail-card', 'Mail Card'],
  ['cube', 'Cube'],
  ['message-panel', 'Message Panel'],
  ['sparkle', 'Sparkle'],
  ['shield', 'Shield'],
  ['shirt', 'T-shirt'],
  ['palette', 'Palette'],
  ['package', 'Package'],
  ['ruler', 'Ruler'],
];

function goTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getVisualStyleVars(item = {}) {
  const frontZoom = Number(item.frontZoom || 1);
  const backZoom = Number(item.backZoom || 1);
  return {
    '--card-bg': item.cardGradient || defaultGradient,
    '--caption-title-color': item.captionTitleColor || '#ffc900',
    '--caption-brand-color': item.captionBrandColor || '#d5ad18',
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

function getCaptionTextStyles(item = {}) {
  return {
    title: { color: item.captionTitleColor || '#ffc900' },
    brand: { color: item.captionBrandColor || '#d5ad18' },
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
  download: (
    <>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </>
  ),
  hexagon: (
    <path d="M7 3.8h10L22 12l-5 8.2H7L2 12l5-8.2Z" />
  ),
  nodes: (
    <>
      <circle cx="7" cy="7" r="2.5" />
      <circle cx="17" cy="7" r="2.5" />
      <circle cx="12" cy="17" r="2.5" />
      <path d="M9.1 8.5 11 14.7" />
      <path d="m14.9 8.5-2 6.2" />
      <path d="M9.5 7h5" />
    </>
  ),
  support: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M7 12a5 5 0 0 1 10 0" />
      <path d="M7 12v3" />
      <path d="M17 12v3" />
      <path d="M14 17h3" />
    </>
  ),
  megaphone: (
    <>
      <path d="M4 13h4l10 5V6L8 11H4v2Z" />
      <path d="M8 13v5" />
    </>
  ),
  muted: (
    <>
      <path d="M4 13h4l6 5V6l-6 5H4v2Z" />
      <path d="m18 9 4 6" />
      <path d="m22 9-4 6" />
    </>
  ),
  'mail-card': (
    <>
      <rect x="3" y="6" width="18" height="12" rx="1.5" />
      <path d="m3 8 9 6 9-6" />
      <path d="M7 18v3" />
      <path d="M17 18v3" />
    </>
  ),
  cube: (
    <>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="M4 7.5 12 12l8-4.5" />
      <path d="M12 12v9" />
    </>
  ),
  'message-panel': (
    <>
      <rect x="4" y="5" width="16" height="11" rx="1.5" />
      <path d="M8 9h8" />
      <path d="M8 12h5" />
      <path d="m8 16-3 4" />
    </>
  ),
  sparkle: (
    <>
      <path d="m12 3 1.6 5 5.4 1.2-4 3.4.5 5.4-3.5-2.8L8.5 18l.5-5.4-4-3.4L10.4 8 12 3Z" />
      <path d="M20 3v4" />
      <path d="M18 5h4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4 7v5c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-4Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  shirt: (
    <>
      <path d="M8 4 4 7l3 4 2-1v10h6V10l2 1 3-4-4-3" />
      <path d="M9 4c.5 1.5 1.5 2 3 2s2.5-.5 3-2" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3a9 9 0 0 0 0 18h1.2a2 2 0 0 0 1.4-3.4 1.7 1.7 0 0 1 1.2-2.9H18a6 6 0 0 0 0-12h-6Z" />
      <circle cx="8" cy="10" r="1" />
      <circle cx="11" cy="7" r="1" />
      <circle cx="15" cy="8" r="1" />
    </>
  ),
  package: (
    <>
      <path d="m12 3 8 4v10l-8 4-8-4V7l8-4Z" />
      <path d="M4 7l8 4 8-4" />
      <path d="M12 11v10" />
      <path d="m8 5 8 4" />
    </>
  ),
  ruler: (
    <>
      <path d="M4 17 17 4l3 3L7 20l-3-3Z" />
      <path d="m8 16-2-2" />
      <path d="m11 13-2-2" />
      <path d="m14 10-2-2" />
    </>
  ),
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
  const captionStyles = getCaptionTextStyles(category);
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
          <strong style={captionStyles.title}>{category.title}</strong>
          <span style={captionStyles.brand}>LIYAN'S VASTRA</span>
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
























function Footer({ content, setActivePage }) {
  const contact = getContactDetails(content);
  const socialLinks = [
    ['WhatsApp', whatsappUrl, 'whatsapp'],
    ['Facebook', '#', 'facebook'],
    ['X', '#', 'x'],
    ['LinkedIn', '#', 'linkedin'],
    ['Instagram', '#', 'instagram'],
  ];
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
            <p><b>Address</b><span>{contact.address.split('\n').join(', ')}</span></p>
            <p><b>Phone</b><a href={`tel:${contact.phoneNumber}`}>{contact.displayPhone}</a></p>
            <p><b>Email</b><a href={`mailto:${contact.email}`}>{contact.email}</a></p>
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
          <div className="footer-socials" aria-label="Social links">
            {socialLinks.map(([label, href, icon]) => (
              <a key={label} href={href} target={href === '#' ? undefined : '_blank'} rel={href === '#' ? undefined : 'noreferrer'} aria-label={label}>
                <SocialIcon icon={icon} />
              </a>
            ))}
          </div>
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


function SocialIcon({ icon }) {
  if (icon === 'whatsapp') {
    return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.02 3.2A12.68 12.68 0 0 0 5.27 22.6L4 29l6.56-1.22A12.7 12.7 0 1 0 16.02 3.2Zm0 22.9a10.3 10.3 0 0 1-5.24-1.44l-.38-.23-3.88.72.74-3.78-.25-.39a10.29 10.29 0 1 1 9.01 5.12Zm5.64-7.72c-.31-.16-1.83-.9-2.11-1-.28-.1-.49-.16-.7.16-.2.31-.8 1-.98 1.2-.18.2-.36.23-.67.08-.31-.16-1.31-.48-2.5-1.54-.92-.82-1.55-1.84-1.73-2.15-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.54.16-.18.2-.31.31-.52.1-.2.05-.39-.03-.54-.08-.16-.7-1.68-.96-2.3-.25-.6-.51-.52-.7-.53h-.59c-.2 0-.54.08-.82.39-.28.31-1.08 1.05-1.08 2.57 0 1.52 1.1 2.98 1.26 3.19.16.2 2.17 3.31 5.25 4.64.73.32 1.3.5 1.75.64.74.23 1.41.2 1.94.12.59-.09 1.83-.75 2.09-1.47.26-.72.26-1.34.18-1.47-.08-.13-.28-.2-.59-.36Z" /></svg>;
  }
  if (icon === 'facebook') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8.4V6.8c0-.8.2-1.2 1.3-1.2h1.5V3h-2.4C11.8 3 10.7 4.3 10.7 6.5v1.9H8.8v2.8h1.9V21H14v-9.8h2.4l.4-2.8H14Z" /></svg>;
  if (icon === 'x') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.8 10.5 20.8 3h-2.1l-5.8 6.2L8.2 3H3l7.4 9.7L3 21h2.1l6.2-6.8 5.2 6.8H22l-8.2-10.5Zm-2.2 2.4-.7-.9L5.5 4.6h1.7l4.6 6.3.7.9 5.8 7.8h-1.7l-5-6.7Z" /></svg>;
  if (icon === 'linkedin') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.7 8.9H3.6V21h3.1V8.9ZM5.2 3A1.8 1.8 0 1 0 5.1 6.6 1.8 1.8 0 0 0 5.2 3Zm15.2 11.1c0-3.2-1.7-5.4-4.4-5.4-1.7 0-2.8.9-3.3 1.8V8.9h-3V21h3.1v-6.1c0-1.9.9-3.2 2.4-3.2 1.4 0 2.1 1 2.1 3V21h3.1v-6.9Z" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.8 2.8h8.4a5 5 0 0 1 5 5v8.4a5 5 0 0 1-5 5H7.8a5 5 0 0 1-5-5V7.8a5 5 0 0 1 5-5Zm0 2.1a2.9 2.9 0 0 0-2.9 2.9v8.4a2.9 2.9 0 0 0 2.9 2.9h8.4a2.9 2.9 0 0 0 2.9-2.9V7.8a2.9 2.9 0 0 0-2.9-2.9H7.8Zm4.2 3.2a3.9 3.9 0 1 1 0 7.8 3.9 3.9 0 0 1 0-7.8Zm0 2.1a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6Zm4.2-2.6a1 1 0 1 1 0 2.1 1 1 0 0 1 0-2.1Z" /></svg>;
}


export {
  brand,
  logo,
  background,
  lifestyleImage,
  apiBaseUrl,
  adminEmail,
  storageKey,
  authKey,
  adminTokenKey,
  phoneNumber,
  emailAddress,
  whatsappUrl,
  shirtFrontImage,
  shirtBackImage,
  animationOptions,
  gradientOptions,
  textColorOptions,
  defaultGradient,
  defaultSiteContent,
  defaultAdminContent,
  normalizeAdminContent,
  findServiceCategory,
  slugify,
  clampIndex,
  reorderArray,
  adminEditorPath,
  loadAdminContent,
  getPageFromLocation,
  normalizeStyleItem,
  serviceHeroSlides,
  businessInfo,
  serializeTextCards,
  parseTextCards,
  visibleCards,
  getContactDetails,
  goTop,
  getCaptionTextStyles,
  getVisualStyleVars,
  ScrollArrowRow,
  useRevealOnScroll,
  Header,
  Eyebrow,
  SectionTitle,
  MaterialIcon,
  materialIconOptions,
  GoldIcon,
  Stat,
  FeatureCard,
  ProductCard,
  Footer,
  FloatingActions,
};
