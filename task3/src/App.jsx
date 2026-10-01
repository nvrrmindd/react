import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';

function App() {
  return (
    <div className="page">
      <Header />
      <main>
        <Hero />
        <About />
        <Contact />
      </main>
      <footer className="footer">
        <span>Designed and built with React.</span>
        <span>© 2026 nieyrinn</span>
      </footer>
    </div>
  );
}

export default App;
