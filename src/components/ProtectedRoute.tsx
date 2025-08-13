import { Navigate, Outlet, useLocation } from "react-router-dom";

export function ProtectedRoute() {
  const token = localStorage.getItem("access_token");
  const location = useLocation();

  const publicPaths = ["/auth", "/register"];
  const isPublic = publicPaths.includes(location.pathname);

  if (!token && !isPublic) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}
