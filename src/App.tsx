import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer.tsx';
import Header from './components/Header.tsx';
import Home from './components/pages/Home.tsx';
import ManagerProfile from './components/pages/ManagerProfile.tsx'
import "./styles/global.scss";

function App() {
  return (
    <BrowserRouter>
      <div className="main-container">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ManagerProfile/>} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
