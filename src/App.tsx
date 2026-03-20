import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store";
import { useUserRole } from "./hooks/useUserRole";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { setTranslations } from "./store/langSlice";
import { ensureDeviceToken } from "./hooks/useDeviceToken";

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
import EditCar from "./components/pages/Customer/EditCar";
import BranchScreen from "./components/BranchScreen";
import WashAppointment from "./components/pages/Customer/WashApointment";
import MyReviews from "./components/pages/Customer/MyReviews";
import MyPackages from "./components/pages/Customer/MyPackages";
import MyPoints from "./components/pages/Customer/MyPoints";
import MyAreaPage from "./components/pages/Customer/MyAreaPage";
import PointsInfo from "./components/pages/Customer/PointsInfo";
import ReferralsInfo from "./components/pages/Customer/ReferralsInfo";
import ShopPage from "./components/pages/Customer/ShopPage";
import DiscountsPage from "./components/pages/Customer/DiscountsPage";
import DiscountDetailPage from "./components/pages/Customer/DiscountDetailPage";
import GiveawayPage from "./components/pages/Customer/GiveawayPage";
import GiveawayDetailPage from "./components/pages/Customer/GiveawayDetailPage";
import CustomerCalendar from "./components/Calendars/CustomerCalendar";
import QRPage from "./components/pages/Customer/QRPage";
import ManagerScanner from "./components/pages/Manager/ManagerScanner";
import Messages from "./components/pages/Messages";
import Help from "./components/pages/Help";
import Contacts from "./components/Contacts";
import MyData from "./components/pages/Manager/MyData";
import { CarCheckRoute } from "./components/CarCheckRoute";
import { customFetch } from "./utils/customFetch";
import RenewPasswordPage from "./components/pages/RenewPasswordPage";
import SettingsPage from "./components/pages/SettingsPage";
import { useSelector } from "react-redux";
import type { RootState } from "./store";


function AppRoutes() {
  const role = useUserRole();
  const dispatch = useDispatch();
  const [langLoading, setLangLoading] = useState(true);
  const currentLang = useSelector((s: RootState) => s.lang.currentLang);
  useUser();

  useEffect(() => {
    ensureDeviceToken().then((token) => {
      if (token) {
        const webview = document.querySelector("iframe, webview");
        if (webview) {
          const url = new URL(webview.src);
          url.searchParams.set("token", token);
          webview.src = url.toString();
        }
      }
    });
  }, []);

//////////////////////////////////////

  useEffect(() => {
    setLangLoading(true);
    customFetch(`${import.meta.env.VITE_API_URL}/lang/${currentLang}`)
      .then((res) => res.json())
      .then((data) => {
        dispatch(setTranslations(data));
      })
      .catch((err) => console.error("Failed to load translations:", err))
      .finally(() => setLangLoading(false));
  }, [dispatch, currentLang]);

  if (langLoading) {
    return (
      <div className="lang-loader">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/auth" element={<Authentication />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/renew-password" element={<RenewPasswordPage/>} />

      {/* Secure routes */}
      <Route element={<ProtectedRoute />}>
  <Route path="/add-car" element={<AddCar showHeader={true} />} /> {/* access always */}

  <Route element={<CarCheckRoute />}>
    {role === "manager" ? (
      <Route element={<ManagerLayout />}>
        <Route path="/" element={<ManagerCalendar />} />
        <Route path="/profile" element={<MyData />} />
        <Route path="/carwash-statistics" element={<ManagerCarwashStatistics />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/reschedule/:id" element={<ReschudelingOrder />} />
        <Route path="/manager-qr-page" element={<ManagerScanner />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/help" element={<Help />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    ) : (
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/customer-my-data" element={<CustomerMyData />} />
        <Route path="/change-phone" element={<PhoneNumberChanging />} />
        <Route path="/change-email" element={<EmailChanging />} />
        <Route path="/edit-car/:carid" element={<EditCar />} />
        <Route path="/branches" element={<BranchScreen />} />
        <Route path="/wash-appointment" element={<WashAppointment />} />
        <Route path="/my-reviews" element={<MyReviews />} />
        <Route path="/my-packages" element={<MyPackages />} />
        <Route path="/my-points" element={<MyPoints />} />
        <Route path="/my-area" element={<MyAreaPage />} />
        <Route path="/my-points/info" element={<PointsInfo />} />
        <Route path="/my-points/referrals" element={<ReferralsInfo />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/discounts" element={<DiscountsPage />} />
        <Route path="/shop/discounts/:id" element={<DiscountDetailPage />} />
        <Route path="/shop/giveaway" element={<GiveawayPage />} />
        <Route path="/shop/giveaway/:id" element={<GiveawayDetailPage />} />
        <Route path="/customer-calendar" element={<CustomerCalendar />} />
        <Route path="/customer-qr-page" element={<QRPage />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/help" element={<Help />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    )}
  </Route>
</Route>

      {/* Fallback */}
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
