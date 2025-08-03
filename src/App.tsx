import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { useUserRole } from "./hooks/useUserRole";

import Home from "./components/pages/Home";
import ManagerCalendar from "./components/Calendars/ManagerCalendar";
import ManagerCarwashStatistics from "./components/pages/Manager/ManagerCarwashStatistics";
import Booking from "./components/pages/Manager/Booking";
import ReschudelingOrder from "./components/pages/Manager/ReschudelingOrder";

import CustomerMyData from "./components/pages/Customer/CustomerMyData";
import Authentication from "./components/pages/Customer/Authentication";
import Registration from "./components/pages/Customer/Registration";

import ManagerLayout from "./components/Layouts/ManagerLayout";
import CustomerLayout from "./components/Layouts/CustomerLayout";
import PhoneNumberChanging from "./components/pages/Customer/PhoneNumberChanging";
import EmailChanging from "./components/pages/Customer/EmailChanging";
import AddCar from "./components/pages/Customer/AddCar";
function AppRoutes() {
  const role = useUserRole();

  return (
    <Routes>
      {role === "manager" ? (
        <Route element={<ManagerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ManagerCalendar />} />
          <Route path="/carwash-statistics" element={<ManagerCarwashStatistics />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/reschedule/:id" element={<ReschudelingOrder />} />
        </Route>
      ) : (
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Authentication />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/customer-my-data" element={<CustomerMyData />} />
          <Route path="/change-phone" element={<PhoneNumberChanging />} />
          <Route path="/change-email" element={<EmailChanging />} />
          <Route path="/add-car" element={<AddCar />} />
        </Route>
      )}

      {/* 🔒 Если пользователь вводит путь не из своей роли — редирект */}
      <Route path="*" element={<Navigate to={role === "manager" ? "/" : "/customer-my-data"} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="main-container">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
