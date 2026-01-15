import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Invitation from "../pages/Invitation";
import Admin from "../pages/Admin";
import Login from "../pages/Login";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Invitación con prefijo */}
        <Route path="/:type/:guestSlug" element={<Invitation />} />

        {/* Home sin slug */}
        <Route path="/" element={<Invitation />} />

        {/* Admin (después lo protegemos con Firebase Auth) */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
