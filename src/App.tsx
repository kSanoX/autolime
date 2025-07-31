import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.tsx";
import Home from "./components/pages/Home.tsx";
import MyData from "./components/pages/Manager/MyData.tsx";
import ManagerCarwashStatistics from "./components/pages/Manager/ManagerCarwashStatistics.tsx";
import Booking from "./components/pages/Manager/Booking.tsx";
import ReschudelingOrder from "./components/pages/Manager/ReschudelingOrder.tsx";
import { Provider } from "react-redux";
import { store } from "./store/index.ts";
import ManagerCalendar from "./components/Calendars/ManagerCalendar.tsx";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className='main-container'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/profile' element={<ManagerCalendar />} />
            <Route
              path='/carwash-statistics'
              element={<ManagerCarwashStatistics />}
            />
            <Route path='/booking' element={<Booking />} />
            <Route path='/reschedule/:id' element={<ReschudelingOrder />} />
          </Routes>
          <NavBar />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
