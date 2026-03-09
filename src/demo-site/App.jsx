import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import "./styles/app.css";
import { AdminWidget } from "../components/AdminWidget";

export default function App() {
  return (
    <Router>
      <Navigation />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/admin" element={<Home />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>&copy; 2026 Demo Site. All rights reserved.</p>
      </footer>
      <AdminWidget />
    </Router>
  );
}

function NotFound() {
  return (
    <div className="page">
      <h1>404 - Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
}
