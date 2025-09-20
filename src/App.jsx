import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Practices from "./pages/Practices";

export default function App() {
  return (
    <BrowserRouter>
      <header className="navbar">
        <nav className="navbar-inner">
          <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink>
          <NavLink to="/students" className={({ isActive }) => isActive ? "active" : ""}>Alumnos</NavLink>
          <NavLink to="/practices" className={({ isActive }) => isActive ? "active" : ""}>Prácticas</NavLink>
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/practices" element={<Practices />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          Gestión de Prácticas • {new Date().getFullYear()} • Desarrollado por Beimone Web Services
        </div>
      </footer>
    </BrowserRouter>
  );
}
