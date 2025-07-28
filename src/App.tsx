import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./styles/global.scss";
import Footer from './components/Footer.tsx';
import Home from './components/pages/Home.tsx';
import MyData from './components/pages/MyData.tsx';
import CarwashStatistics from './components/pages/CarwashStatistics.tsx';

function App() {
  return (
    <BrowserRouter>
      <div className="main-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<MyData/>} />
          <Route path="/carwash-statistics" element={<CarwashStatistics/>} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
