import CustomerNavBar from "../../components/pages/Customer/CustomerNavBar";
import { Outlet } from "react-router-dom";

export default function CustomerLayout() {
  return (
    <>
      <Outlet />
      <CustomerNavBar />
    </>
  );
}
