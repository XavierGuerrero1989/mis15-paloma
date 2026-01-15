import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/admin";
    } catch (err) {
      setError("Credenciales inválidas o usuario no autorizado");
    }
  };

  return (
    <div className="loginWrapper">
      <div className="loginCard">
        <h1>Acceso Administrador</h1>
        <p>Panel privado para gestionar confirmaciones.</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Ingresar</button>

          {error && <span className="loginError">{error}</span>}
        </form>
      </div>
    </div>
  );
}
