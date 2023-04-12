import { Routes, Route, Outlet, Link } from "react-router-dom";
import Cars from "./pages/Cars";
import Login from "./pages/Login";
import Requests from "./pages/Requests";
import SignUp from "./pages/SignUp";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Requests />} />
        <Route path="cars" element={<Cars />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

function Layout() {
  return (
    <div
      style={{
        width: "90%",
        height: "90%",
        backgroundColor: "white",
        borderRadius: "12px",
      }}
    >
      <Outlet />
    </div>
  );
}
