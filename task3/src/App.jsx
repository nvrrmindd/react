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
    </div>
  );
}

export default App;
