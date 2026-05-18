// src/layouts/MainLayout.tsx

import { Link, Outlet, useNavigate } from "react-router-dom";

const MainLayout: React.FC = () => {
  const navigate = useNavigate();

  function handleLogout() {
    // exemplo simples
    localStorage.removeItem("token");

    navigate("/");
  }

  return (
    <div>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
          background: "#222",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", gap: "16px" }}>
          <Link
            to="/home"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            Início
          </Link>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "8px 12px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Deslogar
        </button>
      </nav>

      <main style={{ padding: "24px" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout