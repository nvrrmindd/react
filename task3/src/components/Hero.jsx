import avatar from '../assets/avatar.jpg';
import grass from '../assets/grass.svg';
import vision from '../assets/vision.svg';
import star from '../assets/star.svg';

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="portrait-wrap">
        <img className="portrait" src={avatar} alt="nieyrinn portrait" />
        <div className="sticker">Main character<br />energy</div>
        <div className="portrait-label">Player one</div>
      </div>
      <div className="hero-panel">
        <div className="character-line"><span>LVL 09</span><span>CLASS: CREATIVE DEV</span><span className="rare-label">RARE</span></div>
        <h1>nieyrinn</h1>
        <div className="main-character-label"><span>★★★★★</span><strong>5-STAR MAIN CHARACTER</strong></div>
        <div className="legendary-label">LEGENDARY</div>
        <div className="hero-tabs"><span className="active">PROFILE</span><span>ABILITY</span><span>TRANSCEND</span></div>
        <div className="profile-panel">
          <div className="profile-stats">
            <div className="profile-stat"><span>Creativity</span><strong>98</strong></div>
            <div className="profile-stat"><span>Curiosity</span><strong>100</strong></div>
            <div className="profile-stat"><span>Sleep</span><strong>404</strong></div>
            <div className="profile-stat"><span>Good vibes</span><strong>+10</strong></div>
          </div>
          <div className="hero-skills">
            <div className="hero-skill"><span className="hero-skill-icon"><img className="pixel-icon" src={grass} alt="Pixel grass icon" /></span><div><small>PASSIVE / CRYO</small><strong>Touch Grass</strong></div></div>
            <div className="hero-skill"><span className="hero-skill-icon"><img className="pixel-icon" src={vision} alt="Pixel eye icon" /></span><div><small>ACTIVE / GEO</small><strong>Pixel Vision</strong></div></div>
            <div className="hero-skill"><span className="hero-skill-icon"><img className="pixel-icon" src={star} alt="Pixel star icon" /></span><div><small>ULTIMATE</small><strong>Ship It</strong></div></div>
          </div>
        </div>
        <p className="hero-copy">A creative developer with a cracked curiosity build, high imagination stats and one mission: make the web feel less NPC.</p>
        <div className="hero-actions">
          <a className="button primary" href="#about">Get the lore</a>
          <a className="button secondary" href="#contact">Slide in</a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
