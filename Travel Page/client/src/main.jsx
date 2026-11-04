import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const destinations = [
  { city: "Rome, Italy", price: "$5.42k", days: "10 Days Trip", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=700&q=85" },
  { city: "London, UK", price: "$4.2k", days: "12 Days Trip", image: "https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=700&q=85" },
  { city: "Full Europe", price: "$15k", days: "28 Days Trip", image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=700&q=85" }
];

const services = [
  ["☀", "Calculated Weather", "Built Wicket longer admire do barton vanity itself do in it."],
  ["✈", "Best Flights", "Engrossed listening. Park gate sell they west hard for the."],
  ["♟", "Local Events", "Barton vanity itself do in it. Preferred to men it engrossed listening."],
  ["⚙", "Customization", "We deliver outsourced aviation services for military customers."]
];

function Logo() {
  return <a className="logo" href="#home" aria-label="Jadoo home">Jad<span>oo</span><i /></a>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  async function subscribe(event) {
    event.preventDefault();
    setStatus("Sending...");
    try {
      const response = await fetch("http://localhost:5000/api/subscribe", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email })
      });
      const data = await response.json();
      setStatus(data.message);
      if (response.ok) setEmail("");
    } catch {
      setStatus("Start the API with npm run server to subscribe.");
    }
  }

  return (
    <main>
      <header className="header" id="home">
        <Logo />
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">☰</button>
        <nav className={menuOpen ? "nav open" : "nav"}>
          <a href="#services" onClick={() => setMenuOpen(false)}>Destinations</a>
          <a href="#destinations" onClick={() => setMenuOpen(false)}>Hotels</a>
          <a href="#trip" onClick={() => setMenuOpen(false)}>Flights</a>
          <a href="#subscribe" onClick={() => setMenuOpen(false)}>Bookings</a>
          <a href="#footer" onClick={() => setMenuOpen(false)}>Login</a>
          <a className="signup" href="#subscribe" onClick={() => setMenuOpen(false)}>Sign up</a>
          <button className="language">EN⌄</button>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">BEST DESTINATIONS AROUND THE WORLD</p>
          <h1>Travel, enjoy<br />and live a new<br />and full life<span className="underline" /></h1>
          <p className="hero-text">Built Wicket longer admire do barton vanity itself do in it.<br />Preferred to sportsmen it engrossed listening. Park gate<br />sell they west hard for the.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#destinations">Find out more</a>
            <a className="play-link" href="#trip"><b>▶</b> Play Demo</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="sun-shape" />
          <span className="plane plane-one">✈</span>
          <img src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=900&q=90" alt="Traveller exploring a sunny destination" />
          <span className="plane plane-two">✈</span>
        </div>
      </section>

      <section className="section services" id="services">
        <p className="section-kicker">CATEGORY</p>
        <h2>We Offer Best Services</h2>
        <div className="service-grid">
          {services.map(([icon, title, copy], index) => (
            <article className={index === 1 ? "service-card featured" : "service-card"} key={title}>
              <span className="service-icon">{icon}</span><h3>{title}</h3><p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section destinations" id="destinations">
        <p className="section-kicker">TOP SELLING</p><h2>Top Destinations</h2>
        <div className="destination-grid">
          {destinations.map((destination) => (
            <article className="destination-card" key={destination.city}>
              <img src={destination.image} alt={destination.city} />
              <div className="destination-info"><span>{destination.city}</span><strong>{destination.price}</strong><small>➤ &nbsp;{destination.days}</small></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section trip" id="trip">
        <div className="trip-copy"><p className="section-kicker left">EASY AND FAST</p><h2>Book Your Next Trip<br />In 3 Easy Steps</h2>
          {[["◈", "Choose Destination", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna, tortor tempus."], ["▣", "Make Payment", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna, tortor tempus."], ["▰", "Reach Airport on Selected Date", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna, tortor tempus."]].map(([icon, title, copy]) => <div className="step" key={title}><b>{icon}</b><span><strong>{title}</strong><small>{copy}</small></span></div>)}
        </div>
        <div className="trip-card"><img src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=750&q=85" alt="Trip to Greece" /><strong>Trip To Greece</strong><small>14-29 June | by Robbin jose</small><div className="trip-meta">♡ &nbsp; 24 people going <span>♡</span></div><div className="ongoing"><b>●</b><small>Ongoing</small><strong>Trip to rome</strong><i>40% completed</i></div></div>
      </section>

      <section className="section testimonial"><div><p className="section-kicker left">TESTIMONIALS</p><h2>What People Say<br />About Us.</h2><div className="dots">●　<span>● ●</span></div></div><blockquote><div className="avatar">👨🏻</div><p>“On the Windows talking painted pasture yet its express parties use. Sure last upon he same as knew next. Of believed or diverted no.”</p><strong>Mike taylor</strong><small>Lahore, Pakistan</small></blockquote></section>
      <div className="partners"><b>axon</b><b>Jetstar★</b><b>🌐Expedia</b><b>➤QANTAS</b><b>Alitalia</b></div>

      <section className="subscribe" id="subscribe"><span className="send">➤</span><h2>Subscribe to get information, latest news and other<br /> interesting offers about Jadoo</h2><form onSubmit={subscribe}><input type="email" placeholder="✉  Your email" value={email} onChange={(event) => setEmail(event.target.value)} required /><button>Subscribe</button></form>{status && <p className="form-status">{status}</p>}</section>

      <footer id="footer"><div><Logo /><p>Book your trip in minute, get full<br />Control for much longer.</p></div><div><strong>Company</strong><a>About</a><a>Careers</a><a>Mobile</a></div><div><strong>Contact</strong><a>Help/FAQ</a><a>Press</a><a>Affiliates</a></div><div><strong>More</strong><a>Airlinefees</a><a>Airline</a><a>Low fare tips</a></div><div><strong>Discover our app</strong><span>●　◎　●</span><small>Google Play　 App Store</small></div><small className="copyright">All rights reserved@jadoo.co</small></footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
