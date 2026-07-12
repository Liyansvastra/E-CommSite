import { brand, logo } from '../pageLibrary.jsx';



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



export default NotFoundPage;
export { NotFoundPage };

