import { Routes, Route, Outlet, Link } from "react-router-dom";
import Cars from "./pages/Parceiros";
import Login from "./pages/Login";
import Requests from "./pages/Students";
import SignUp from "./pages/SignUp";
import Transactions from "./pages/Transactions";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Requests />} />
        <Route path="partners" element={<Cars />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="transactions" element={<Transactions />} />
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
