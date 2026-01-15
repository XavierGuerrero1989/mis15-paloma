import { Routes, Route } from "react-router-dom";
import Invitation from "./pages/Invitation";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <Routes>
      {/* Admin */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />

      {/* Invitación con saludo dinámico */}
      <Route path="/p/:guestSlug" element={<Invitation />} />
      <Route path="/f/:guestSlug" element={<Invitation />} />

      {/* Home sin slug (fallback) */}
      <Route path="/" element={<Invitation />} />

      {/* Seguridad extra */}
      <Route path="*" element={<Invitation />} />
    </Routes>
  );
}
