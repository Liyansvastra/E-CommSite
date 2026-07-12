import React, { useEffect, useMemo, useState } from 'react';
import './styles.css';
import {
  apiBaseUrl,
  adminEmail,
  adminPassword,
  storageKey,
  authKey,
  background,
  defaultAdminContent,
  normalizeAdminContent,
  loadAdminContent,
  getPageFromLocation,
  adminEditorPath,
  useRevealOnScroll,
  Header,
  Footer,
  FloatingActions,
} from './pageLibrary.jsx';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ServicesPage, { ServiceDetailPage } from './pages/ServicesPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import {
  AdminLoginPage,
  AdminDashboardPage,
  AdminCategoryEditorPage,
  AdminContainerEditorPage,
} from './pages/AdminPages.jsx';

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
    AdminHomeSettings: (props) => <AdminDashboardPage {...props} adminSection="home" />,
    AdminAboutSettings: (props) => <AdminDashboardPage {...props} adminSection="home" />,
    AdminServicesSettings: (props) => <AdminDashboardPage {...props} adminSection="services" />,
    AdminContactSettings: (props) => <AdminDashboardPage {...props} adminSection="contact" />,
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
          const normalizedContent = normalizeAdminContent(result.content);
          setContent(normalizedContent);
          localStorage.setItem(storageKey, JSON.stringify(normalizedContent));
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
    if ((activePage === 'AdminDashboard' || activePage === 'AdminHomeSettings' || activePage === 'AdminAboutSettings' || activePage === 'AdminServicesSettings' || activePage === 'AdminContactSettings' || activePage === 'AdminCategoryEditor' || activePage === 'AdminContainerEditor') && !isAdminAuthed) {
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

  const isAdminPage = activePage === 'AdminLogin' || activePage === 'AdminDashboard' || activePage === 'AdminHomeSettings' || activePage === 'AdminAboutSettings' || activePage === 'AdminServicesSettings' || activePage === 'AdminContactSettings' || activePage === 'AdminCategoryEditor' || activePage === 'AdminContainerEditor';
  const isServicePage = activePage === 'Services' || activePage === 'ServiceDetail';
  const hideSiteBackground = isAdminPage || isServicePage;

  return (
    <>
      {!hideSiteBackground && (
        <div
          className="site-background"
          style={{ backgroundImage: `url(${background})` }}
          aria-hidden="true"
        />
      )}
      {isAdminPage && (
        <div
          className="admin-fixed-background"
          style={{ backgroundImage: `url(${background})` }}
          aria-hidden="true"
        />
      )}
      {isServicePage && (
        <div
          className="service-fixed-background"
          style={{ backgroundImage: `url(${background})` }}
          aria-hidden="true"
        />
      )}
      {!isAdminPage && <Header activePage={navActivePage} setActivePage={setActivePage} />}
      <main key={activePage} className={isServicePage ? 'service-no-image-main' : ''}>
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
      {!isAdminPage && <Footer content={content} setActivePage={setActivePage} />}
      {!isAdminPage && <FloatingActions />}
    </>
  );
}


export default App;
