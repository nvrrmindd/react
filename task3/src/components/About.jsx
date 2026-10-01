const inventory = [
  { id: 1, icon: 'laptop.svg', name: 'MacBook Air M2', bonus: '+40 CODE' },
  { id: 2, icon: 'death-note.svg', name: 'Death Note', bonus: '+25 IDEAS' },
  { id: 3, icon: 'sleep.svg', name: '3 hours sleep', bonus: '-10 ENERGY' },
  { id: 4, icon: 'sandwich.svg', name: 'Sandwich in TB0', bonus: '+20 HP' },
  { id: 5, icon: 'coffee.svg', name: 'TB0 coffee', bonus: '+50 FOCUS' },
];

function About() {
  return (
    <section className="section" id="about">
      <div className="section-heading">
        <div className="section-label">01 / About me</div>
        <h2>ABOUT ME</h2>
      </div>
      <div className="about-grid">
        <article className="about-card">
          <h3>Ability loadout</h3>
          <p>Three abilities currently equipped in the nieyrinn build.</p>
          <div className="ability-list">
            <div className="ability"><span className="ability-icon"><img className="pixel-icon" src="grass.svg" alt="Pixel grass icon" /></span><span className="ability-meta">SKILL 01 / CRYO PASSIVE</span><h4>Touch Grass</h4><p>Restores focus and gives +10 real-life XP.</p></div>
            <div className="ability"><span className="ability-icon"><img className="pixel-icon" src="vision.svg" alt="Pixel eye icon" /></span><span className="ability-meta">SKILL 02 / GEO ACTIVE</span><h4>Pixel Vision</h4><p>Spots tiny UI details other players completely miss.</p></div>
            <div className="ability ultimate"><span className="ultimate-ribbon">ULTIMATE</span><span className="ability-icon"><img className="pixel-icon" src="star.svg" alt="Pixel star icon" /></span><span className="ability-meta">FULL POWER / FINAL MOVE</span><h4>Ship It</h4><p>Turns chaotic ideas into a clean playable experience.</p></div>
          </div>
        </article>
        <article className="about-card inventory-card">
          <h3>Build inventory</h3>
          <p>Essential items equipped for the daily creative survival run.</p>
          <div className="inventory-list">
            {inventory.map((item) => (
              <div className="inventory-item" key={item.id}>
                <span className="inventory-icon"><img className="pixel-icon" src={item.icon} alt={item.name} /></span>
                <small>{item.name}</small>
                <strong>{item.bonus}</strong>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

export default About;
