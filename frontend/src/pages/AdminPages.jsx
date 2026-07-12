import React, { useEffect, useRef, useState } from 'react';
import { apiBaseUrl, adminEmail, authKey, adminTokenKey, background, brand, logo, animationOptions, gradientOptions, clampIndex, defaultGradient, defaultSiteContent, getContactDetails, getVisualStyleVars, goTop, normalizeStyleItem, parseTextCards, reorderArray, serializeTextCards, slugify, visibleCards, adminEditorPath, ProductCard, ScrollArrowRow, MaterialIcon, materialIconOptions } from '../pageLibrary.jsx';



function AdminLoginPage({ setActivePage, setIsAdminAuthed, setAdminToken }) {
  const [credentials, setCredentials] = useState({ email: adminEmail, password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email.trim(),
          password: credentials.password,
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok || !result.token) {
        throw new Error(result?.message || 'Invalid admin email or password.');
      }
      localStorage.setItem(adminTokenKey, result.token);
      localStorage.setItem(authKey, 'true');
      setAdminToken(result.token);
      setIsAdminAuthed(true);
      setActivePage('AdminDashboard');
      return;
    } catch (error) {
      setError('Invalid admin email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin-page page-enter" style={{ '--admin-bg': `url(${background})` }}>
      <form className="admin-login-card" onSubmit={handleLogin}>
        <img src={logo} alt={brand} />
        <h1>Admin Login</h1>
        <p>Private content editor for LIYAN'S VASTRA.</p>
        <label>Email<input type="email" value={credentials.email} onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))} /></label>
        <label>Password<input type="password" value={credentials.password} onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))} /></label>
        {error && <p className="form-status error">{error}</p>}
        <button className="gold-button" type="submit" disabled={loading}>{loading ? 'Checking...' : 'Login'}</button>
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

const staticTargetOptions = [
  ['', 'Select target', 'Explore'],
  ['contact', 'Contact Page', 'Contact'],
  ['premium-cotton', 'Premium Cotton', 'View Cotton'],
  ['logo-shirts', 'Logo T-shirt Styles', 'View Logo Styles'],
  ['custom-models', 'Custom Model Showcase', 'View Models'],
  ['business-information', 'Business Information', 'View Details'],
];

function IconPickerModal({ currentIcon, onSelect, onClose }) {
  const [selectedIcon, setSelectedIcon] = useState(currentIcon || 'category');

  return (
    <div className="admin-modal icon-picker-modal" role="dialog" aria-modal="true">
      <div className="admin-modal-card icon-picker-card">
        <div className="admin-section-head compact-head">
          <div>
            <h2>Select Icon</h2>
            <p>Choose one royal material icon for this text container.</p>
          </div>
        </div>
        <div className="icon-picker-grid">
          {materialIconOptions.map(([name, label]) => (
            <button
              key={name}
              className={selectedIcon === name ? 'icon-picker-option selected' : 'icon-picker-option'}
              type="button"
              onClick={() => setSelectedIcon(name)}
              aria-label={label}
              title={label}
            >
              <MaterialIcon name={name} />
              <span>{label}</span>
            </button>
          ))}
        </div>
        <div className="admin-actions icon-picker-actions">
          <button className="dark-button" type="button" onClick={onClose}>Cancel</button>
          <button className="gold-button" type="button" onClick={() => onSelect(selectedIcon)}>OK</button>
        </div>
      </div>
    </div>
  );
}

function AdminTextCardEditor({ title, cards, includeMeta = true, targetOptions = staticTargetOptions, focusKey, onAdd, onUpdate, onDelete }) {
  const titleRefs = useRef({});
  const [iconPickerIndex, setIconPickerIndex] = useState(null);

  useEffect(() => {
    if (focusKey === title) {
      window.setTimeout(() => titleRefs.current[0]?.focus(), 60);
    }
  }, [focusKey, title, cards.length]);

  return (
    <div className="admin-text-card-editor">
      {iconPickerIndex !== null && (
        <IconPickerModal
          currentIcon={cards[iconPickerIndex]?.icon}
          onClose={() => setIconPickerIndex(null)}
          onSelect={(icon) => {
            onUpdate(iconPickerIndex, 'icon', icon);
            setIconPickerIndex(null);
          }}
        />
      )}
      <div className="admin-section-head compact-head">
        <div>
          <h3>{title}</h3>
          <p>Add, edit, delete, and choose which text containers display on the user page.</p>
        </div>
        <button className="gold-button" type="button" onClick={onAdd}>Add Text Container</button>
      </div>
      <div className="admin-text-card-list">
        {cards.map((card, index) => (
          <div className="admin-text-card-row" key={`${title}-${index}`}>
            <div className="admin-checks compact-checks">
              <label><input type="checkbox" checked={card.show !== false} onChange={(event) => onUpdate(index, 'show', event.target.checked)} /> Display on page</label>
            </div>
            <div className="form-two">
              <label>Title<input ref={(node) => { titleRefs.current[index] = node; }} value={card.title || ''} onChange={(event) => onUpdate(index, 'title', event.target.value)} /></label>
              {includeMeta && (
                <label>
                  Icon
                  <button className="icon-select-button" type="button" onClick={() => setIconPickerIndex(index)}>
                    <MaterialIcon name={card.icon || 'category'} />
                    <span>{materialIconOptions.find(([name]) => name === (card.icon || 'category'))?.[1] || 'Category'}</span>
                  </button>
                </label>
              )}
            </div>
            <label>Text<textarea rows="3" value={card.text || ''} onChange={(event) => onUpdate(index, 'text', event.target.value)} /></label>
            {includeMeta && (
              <div className="form-two">
                <label>
                  Target
                  <select value={card.target || ''} onChange={(event) => onUpdate(index, 'target', event.target.value)}>
                    {targetOptions.map(([value, label]) => <option key={value || 'empty'} value={value}>{label}</option>)}
                  </select>
                </label>
                <label>Action Label<input value={card.actionLabel || 'Explore'} onChange={(event) => onUpdate(index, 'actionLabel', event.target.value)} /></label>
              </div>
            )}
            <div className="admin-actions">
              <button className="dark-button" type="button" onClick={() => onDelete(index)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminDashboardPage({ adminSection = 'dashboard', content, setContent, setActivePage, setIsAdminAuthed, setAdminToken, setAdminEditCategoryIndex, setAdminEditItemIndex, onSaveContent, adminSaveStatus }) {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [focusTextEditor, setFocusTextEditor] = useState('');
  const selectedCategory = content.categories[selectedCategoryIndex] || content.categories[0];
  const selectedItem = selectedCategory ? normalizeStyleItem(selectedCategory.items[selectedItemIndex], selectedCategory, selectedItemIndex) : null;
  const targetOptions = [
    ['', 'Select target', 'Explore'],
    ...content.categories.map((category) => [category.id, category.title, category.rate?.toLowerCase().includes('cotton') ? 'View Cotton' : `View ${category.badge || 'Styles'}`]),
    ['contact', 'Contact Page', 'Contact'],
    ['business-information', 'Business Information', 'View Details'],
  ];

  const actionLabelForTarget = (target) => (
    targetOptions.find(([value]) => value === target)?.[2] || 'Explore'
  );

  const updateSite = (field, value) => {
    setContent((current) => ({ ...current, site: { ...current.site, [field]: value } }));
  };

  const updateTextList = (field, value) => {
    updateSite(field, value.split('\n').filter((line) => line.trim()));
  };

  const updateTextCards = (field, value, includeMeta = true) => {
    updateSite(field, parseTextCards(value, defaultSiteContent[field] || [], includeMeta));
  };

  const updateCardList = (field, index, key, value) => {
    setContent((current) => {
      const cards = [...(current.site[field] || defaultSiteContent[field] || [])];
      cards[index] = key === 'target'
        ? { ...cards[index], target: value, actionLabel: actionLabelForTarget(value) }
        : { ...cards[index], [key]: value };
      return { ...current, site: { ...current.site, [field]: cards } };
    });
  };

  const addCard = (field, includeMeta = true) => {
    const card = includeMeta
      ? { title: 'New Text Container', text: 'Add text here.', icon: 'category', target: '', actionLabel: 'Explore', show: true }
      : { title: 'New Review', text: 'Add testimonial text here.', show: true };
    setFocusTextEditor(field);
    setContent((current) => ({ ...current, site: { ...current.site, [field]: [card, ...(current.site[field] || defaultSiteContent[field] || [])] } }));
  };

  const deleteCard = (field, index) => {
    setContent((current) => ({ ...current, site: { ...current.site, [field]: (current.site[field] || defaultSiteContent[field] || []).filter((_, itemIndex) => itemIndex !== index) } }));
  };

  const updateContactDetail = (field, value) => {
    setContent((current) => ({
      ...current,
      site: {
        ...current.site,
        contactDetails: { ...defaultSiteContent.contactDetails, ...(current.site.contactDetails || {}), [field]: value },
      },
    }));
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
          showOnAbout: true,
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
              showOnAbout: false,
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
    localStorage.removeItem(adminTokenKey);
    localStorage.removeItem(authKey);
    setAdminToken('');
    setIsAdminAuthed(false);
    setActivePage('AdminLogin');
  };

  const sectionTitles = {
    dashboard: 'Website Content Dashboard',
    home: 'Home Page Settings',
    about: 'About Page Settings',
    services: 'Services Page Settings',
    contact: 'Contact Page Settings',
  };

  const isDashboard = adminSection === 'dashboard';
  const showHomeEditor = adminSection === 'home' || isDashboard;
  const showAboutEditor = false;
  const showServicesEditor = adminSection === 'services';
  const showContactEditor = adminSection === 'contact';

  return (
    <section className="admin-page admin-dashboard page-enter" style={{ '--admin-bg': `url(${background})` }}>
      <div className="container">
        {deleteTarget && (
          <div className="admin-modal" role="dialog" aria-modal="true">
            <div className="admin-modal-card">
              <h2>Confirm Delete</h2>
              <p>Are you sure you want to delete this {deleteTarget.type === 'category' ? 'category' : deleteTarget.type === 'text-card' ? 'text container' : 'image container'}?</p>
              <div className="admin-actions">
                <button className="dark-button" type="button" onClick={() => setDeleteTarget(null)}>Cancel</button>
                <button
                  className="gold-button"
                  type="button"
                  onClick={() => {
                    if (deleteTarget.type === 'category') removeCategory(deleteTarget.categoryIndex);
                    if (deleteTarget.type === 'item') removeGroupItem(deleteTarget.categoryIndex, deleteTarget.itemIndex);
                    if (deleteTarget.type === 'text-card') deleteCard(deleteTarget.field, deleteTarget.index);
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
            <h1>{sectionTitles[adminSection] || sectionTitles.dashboard}</h1>
          </div>
          <div className="admin-actions">
            <button className="dark-button" type="button" onClick={() => setActivePage('Home')}>View Site</button>
            <button className="dark-button" type="button" onClick={logout}>Logout</button>
          </div>
        </div>
        <div className="admin-page-tabs">
          <button className="gold-button" type="button" onClick={() => setActivePage('AdminHomeSettings')}>Home Settings</button>
          <button className="gold-button" type="button" onClick={() => setActivePage('AdminServicesSettings')}>Services Settings</button>
          <button className="gold-button" type="button" onClick={() => setActivePage('AdminContactSettings')}>Contact Settings</button>
          {!isDashboard && <button className="dark-button" type="button" onClick={() => setActivePage('AdminDashboard')}>Back Admin Home</button>}
        </div>
        <div className="admin-grid">
          {showHomeEditor && <section className="admin-panel admin-flat-panel" id="admin-home-editor">
            <h2>Home Page</h2>
            <AdminTextCardEditor
              title="Why Choose Text Containers"
              cards={content.site.whyChooseCards || defaultSiteContent.whyChooseCards}
              targetOptions={targetOptions}
              focusKey={focusTextEditor === 'whyChooseCards' ? 'Why Choose Text Containers' : ''}
              onAdd={() => addCard('whyChooseCards')}
              onUpdate={(index, key, value) => updateCardList('whyChooseCards', index, key, value)}
              onDelete={(index) => setDeleteTarget({ type: 'text-card', field: 'whyChooseCards', index })}
            />
            <AdminTextCardEditor
              title="Testimonials"
              includeMeta={false}
              cards={content.site.testimonials || defaultSiteContent.testimonials}
              focusKey={focusTextEditor === 'testimonials' ? 'Testimonials' : ''}
              onAdd={() => addCard('testimonials', false)}
              onUpdate={(index, key, value) => updateCardList('testimonials', index, key, value)}
              onDelete={(index) => setDeleteTarget({ type: 'text-card', field: 'testimonials', index })}
            />
            <AdminSaveBar status={adminSaveStatus} onSave={onSaveContent} />
          </section>}

          {showAboutEditor && <section className="admin-panel admin-flat-panel" id="admin-about-editor">
            <h2>About Page</h2>
            <label>About Subtitle<input value={content.site.aboutSubtitle} onChange={(event) => updateSite('aboutSubtitle', event.target.value)} /></label>
            <label>Journey Paragraphs<textarea rows="6" value={content.site.aboutJourney.join('\n')} onChange={(event) => updateTextList('aboutJourney', event.target.value)} /></label>
            <AdminTextCardEditor
              title="Our Values Text Containers"
              cards={content.site.valueCards || defaultSiteContent.valueCards}
              targetOptions={targetOptions}
              focusKey={focusTextEditor === 'valueCards' ? 'Our Values Text Containers' : ''}
              onAdd={() => addCard('valueCards')}
              onUpdate={(index, key, value) => updateCardList('valueCards', index, key, value)}
              onDelete={(index) => setDeleteTarget({ type: 'text-card', field: 'valueCards', index })}
            />
            <AdminSaveBar status={adminSaveStatus} onSave={onSaveContent} />
          </section>}

          {showContactEditor && <section className="admin-panel admin-flat-panel" id="admin-contact-editor">
            <h2>Contact Page</h2>
            <label>Address<textarea rows="5" value={getContactDetails(content).address} onChange={(event) => updateContactDetail('address', event.target.value)} /></label>
            <div className="form-two">
              <label>Phone Number<input value={getContactDetails(content).phoneNumber} onChange={(event) => updateContactDetail('phoneNumber', event.target.value)} /></label>
              <label>Display Phone<input value={getContactDetails(content).displayPhone} onChange={(event) => updateContactDetail('displayPhone', event.target.value)} /></label>
            </div>
            <div className="form-two">
              <label>Email<input value={getContactDetails(content).email} onChange={(event) => updateContactDetail('email', event.target.value)} /></label>
              <label>Reply Text<input value={getContactDetails(content).replyText} onChange={(event) => updateContactDetail('replyText', event.target.value)} /></label>
            </div>
            <label>Business Hours<textarea rows="3" value={getContactDetails(content).hours} onChange={(event) => updateContactDetail('hours', event.target.value)} /></label>
            <label>Contact Form Title<input value={content.site.contactTitle} onChange={(event) => updateSite('contactTitle', event.target.value)} /></label>
            <label>Contact Form Subtitle<input value={content.site.contactSubtitle} onChange={(event) => updateSite('contactSubtitle', event.target.value)} /></label>
            <AdminSaveBar status={adminSaveStatus} onSave={onSaveContent} />
          </section>}
        </div>

        {showServicesEditor && <section className="admin-panel admin-wide" id="admin-services-editor">
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
        </section>}
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
          items: [...item.items, normalizeStyleItem({ title, text: item.text, frontImage: item.frontImage, backImage: item.backImage, animationType: item.animationType || (item.backImage ? 'front-back-display' : 'royal-zoom-right'), showOnHome: false, showOnServices: true, showOnAbout: false }, item, item.items.length)],
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
    <section className="admin-page admin-dashboard page-enter" style={{ '--admin-bg': `url(${background})` }}>
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
    <section className="admin-page admin-dashboard page-enter" style={{ '--admin-bg': `url(${background})` }}>
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



export { AdminLoginPage, AdminDashboardPage, AdminCategoryEditorPage, AdminContainerEditorPage };

