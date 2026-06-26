import Link from "next/link";

export default function Home() {
  return (
    <main className="brand-page">
      <section className="brand-hero">
        <img src="/logo.png" alt="AR Fresko" className="brand-logo" />

        <h1>Freshness You Can Trust</h1>
        <p>
          Farm-to-fork fresh chicken, hygienically processed and packed by Star
          Foods for modern Indian homes.
        </p>

        <div className="hero-buttons">
          <a href="#products">View Products</a>
          <a href="#contact" className="secondary">Contact Us</a>
        </div>
      </section>

      <section className="brand-section">
        <h2>About AR Fresko</h2>
        <p>
          AR Fresko is the fresh retail chicken brand from Star Foods, backed by
          Sampoorna Feeds. Our integrated poultry operation covers breeder,
          hatchery, feed mill, growing farms and processing, helping us maintain
          freshness, hygiene and consistency from farm to fork.
        </p>
      </section>

      <section className="trust-grid">
        <div>
          <h3>4000 BPH</h3>
          <p>Modern processing capacity</p>
        </div>
        <div>
          <h3>Marel Line</h3>
          <p>Equipment sourced from Netherlands</p>
        </div>
        <div>
          <h3>Cold Chain</h3>
          <p>Advanced chilling, freezing and storage</p>
        </div>
        <div>
          <h3>Food Safety</h3>
          <p>Hygienic handling and strict quality checks</p>
        </div>
      </section>

      <section className="brand-section" id="products">
        <h2>Our Fresh Chicken Range</h2>

        <div className="product-grid">
          <div className="product-card">
            <h3>Boneless Skinless Chicken Breast</h3>
            <p>Lean, tender and protein-rich fresh chilled chicken breast.</p>
            <Link href="/freshbbl">View Recipes</Link>
          </div>

          <div className="product-card">
            <h3>Chicken Drumsticks</h3>
            <p>Juicy drumsticks for frying, roasting and everyday meals.</p>
            <Link href="/freshdrumstick">View Recipes</Link>
          </div>

          <div className="product-card">
            <h3>Fresh Curry Cut</h3>
            <p>Perfectly cut fresh chicken for Indian curries and home cooking.</p>
            <Link href="/freshcurrycut">View Recipes</Link>
          </div>
        </div>
      </section>

      <section className="recipe-banner">
        <h2>Scan the Pack. Unlock Chef-Style Recipes.</h2>
        <p>
          Every AR Fresko pack comes with QR-based recipes made to help you cook
          better chicken at home.
        </p>
      </section>

      <section className="brand-section">
        <h2>Quality You Can Trust</h2>
        <p>
          Fresh chilled. Hygienically processed. Every batch antibiotic tested.
          Real Chicken. Real Good.
        </p>

        <div className="certs">
          <span>HACCP</span>
          <span>GMP</span>
          <span>ISO 22000</span>
          <span>FSSC 22000</span>
          <span>BRCGS</span>
          <span>FSSAI Licensed</span>
          <span>Export Approved</span>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <h2>Contact Us</h2>
        <p>+91 84377-13377</p>
        <p>customercare@sampoornafeeds.com</p>
        <p>
          Plot No.16B, Mega Food Park, Ladhowal, Ludhiana, Punjab - 141008
        </p>
        <p className="insta">@starfoods7</p>
      </section>

      <footer className="brand-footer">
        © 2026 AR Fresko. Freshness you can trust.
      </footer>
    </main>
  );
}