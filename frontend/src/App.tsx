import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { CalculadoraPage } from './pages/CalculadoraPage';
import { PosesionEfectivaPage } from './pages/PosesionEfectivaPage';
import { PlaceholderPage } from './pages/PlaceholderPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-background text-on-surface selection:bg-primary-container selection:text-on-primary font-inter antialiased transition-colors duration-200">
        <NavBar />
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculadora" element={<CalculadoraPage />} />
            <Route path="/posesion-efectiva" element={<PosesionEfectivaPage />} />
            <Route path="/asesoria" element={<PlaceholderPage />} />
            <Route path="/tramites" element={<PlaceholderPage />} />
            <Route path="/mi-carpeta" element={<PlaceholderPage />} />
            <Route path="/login" element={<PlaceholderPage />} />
            <Route path="/terminos" element={<PlaceholderPage />} />
            <Route path="/privacidad" element={<PlaceholderPage />} />
            <Route path="/faq" element={<PlaceholderPage />} />
            <Route path="/contacto" element={<PlaceholderPage />} />
            <Route path="*" element={<PlaceholderPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
