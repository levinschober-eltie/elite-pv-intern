import React from "react";
import { NavLink } from "react-router-dom";
import { COLORS, styles } from "../theme";
import { LOGO_B64 } from "../assets/logo";

const NAV_ITEMS = [
  { path: "/", icon: "🏠", label: "Dashboard" },
  { path: "/wartung", icon: "📋", label: "Wartung" },
  { path: "/dachpacht", icon: "🏢", label: "Dachpacht" },
  { path: "/freiflaeche", icon: "🌾", label: "Freifläche" },
  { path: "/bess", icon: "🔋", label: "BESS" },
  { path: "/leitungsweg", icon: "🔌", label: "Leitungsweg" },
  { path: "/bauleitplanung", icon: "🏗️", label: "Bauleitplanung" },
  { path: "/kunden", icon: "👥", label: "Kunden" },
  { path: "/vorlagen", icon: "🔒", label: "Vorlagen" },
];

export default function Sidebar({ onNavClick }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid #333",
        }}
      >
        <img src={LOGO_B64} style={{ height: 28 }} alt="Elite PV" />
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.white }}>
            Elite PV
          </div>
          <div style={{ fontSize: 10, color: COLORS.mid }}>Intern</div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "10px 0", overflowY: "auto" }}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            onClick={onNavClick}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "10px 18px",
              color: isActive ? COLORS.yellow : "#aaa",
              background: isActive ? "rgba(255,255,255,.06)" : "transparent",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: isActive ? 700 : 500,
              borderLeft: isActive
                ? `3px solid ${COLORS.blue}`
                : "3px solid transparent",
              transition: "all 0.15s",
            })}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: "14px 18px",
          borderTop: "1px solid #333",
          fontSize: 11.5,
        }}
      >
        <div style={{ color: COLORS.mid, marginBottom: 6 }}>👤 Admin</div>
        <div style={{ color: COLORS.mid, fontSize: 9.5 }}>
          Elite PV GmbH
        </div>
      </div>
    </div>
  );
}
