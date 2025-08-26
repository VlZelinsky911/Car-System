import { Link, Route, Routes, useLocation } from "react-router-dom";
import UsersPage from "./pages/UsersPage";
import VehiclesPage from "./pages/VehiclesPage";

export default function App() {
  const location = useLocation();
  
  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-10 bg-white/85 backdrop-blur-md border-b border-gray-200 flex gap-8 px-10 py-4 shadow-lg shadow-indigo-100/60 mb-8 transition-colors duration-200">
        <Link 
          to="/users" 
          className={`nav-link ${location.pathname === '/users' || location.pathname === '/' ? 'active' : ''}`}
        >
          Users
        </Link>
        <Link 
          to="/vehicles" 
          className={`nav-link ${location.pathname === '/vehicles' ? 'active' : ''}`}
        >
          Vehicles
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<UsersPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/vehicles" element={<VehiclesPage />} />
      </Routes>
    </div>
  );
}
