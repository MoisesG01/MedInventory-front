import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaHome,
  FaChartBar,
  FaBoxes,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaStethoscope,
  FaWrench,
  FaClipboardList,
  FaUser,
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({
  collapsed,
  onToggle,
  user,
  isMobileOpen,
  onMobileToggle,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleItemClick = (item) => {
    // Fechar sidebar em mobile ao clicar em um item
    if (onMobileToggle) {
      onMobileToggle();
    }
    if (item.onClick) {
      item.onClick();
    } else {
      navigate(item.path);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  const menuItems = [
    { icon: FaHome, label: "Dashboard", path: "/dashboard" },
    { icon: FaBoxes, label: "Equipamentos", path: "/equipment", badge: "5+" },
    { icon: FaWrench, label: "Manutenção", path: "/maintenance" },
    { icon: FaChartBar, label: "Relatórios", path: "/reports" },
    { icon: FaUsers, label: "Equipe", path: "/team" },
  ];

  const generalItems = [
    { icon: FaUser, label: "Meu Perfil", path: "/profile" },
    { icon: FaClipboardList, label: "Inventário", path: "/inventory" },
    { icon: FaCog, label: "Configurações", path: "/settings" },
    { icon: FaSignOutAlt, label: "Ajuda", path: "/help" },
    {
      icon: FaSignOutAlt,
      label: "Sair",
      path: "/logout",
      onClick: handleLogout,
    },
  ];

  return (
    <>
      {/* Overlay para mobile */}
      {isMobileOpen && (
        <div className="sidebar-overlay" onClick={onMobileToggle}></div>
      )}
      <div
        className={`sidebar ${collapsed ? "collapsed" : ""} ${
          isMobileOpen ? "open" : ""
        }`}
      >
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <FaStethoscope />
          </div>
          {!collapsed && <h2 className="sidebar-title">MedInventory</h2>}
          <button className="sidebar-toggle" onClick={onToggle}>
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <div className="sidebar-section-title">MENU</div>
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`sidebar-item ${
                  location.pathname === item.path ? "active" : ""
                }`}
                onClick={() => handleItemClick(item)}
              >
                <item.icon className="sidebar-icon" />
                {!collapsed && (
                  <span className="sidebar-label">{item.label}</span>
                )}
                {item.badge && !collapsed && (
                  <span className="sidebar-badge">{item.badge}</span>
                )}
              </button>
            ))}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-title">GERAL</div>
            {generalItems.map((item, index) => (
              <button
                key={index}
                className={`sidebar-item ${
                  location.pathname === item.path ? "active" : ""
                }`}
                onClick={() => handleItemClick(item)}
              >
                <item.icon className="sidebar-icon" />
                {!collapsed && (
                  <span className="sidebar-label">{item.label}</span>
                )}
              </button>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div
            className="user-profile"
            onClick={() => {
              handleItemClick({ path: "/profile" });
            }}
            style={{ cursor: "pointer" }}
          >
            <div className="user-avatar">
              {user?.nome
                ? user.nome
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : "U"}
            </div>
            {!collapsed && (
              <div className="user-info">
                <p className="user-name">{user?.nome || "Usuário"}</p>
                <p className="user-role">{user?.tipo || "Admin"}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
