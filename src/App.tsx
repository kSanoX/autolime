import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer.tsx';
import Header from './components/Header.tsx';
import Home from './components/pages/Home.tsx';

function App() {
  return (
    <BrowserRouter>
      <div className="main-container">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
