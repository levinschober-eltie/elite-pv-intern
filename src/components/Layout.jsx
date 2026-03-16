import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { COLORS } from "../theme";
import { LOGO_B64 } from "../assets/logo";

const SIDEBAR_WIDTH = 240;

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
        background: COLORS.light,
        color: COLORS.dark,
      }}
    >
      {/* Mobile Header */}
      <div
        className="epv-mobile-header"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 101,
          background: COLORS.dark,
          padding: "10px 14px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src={LOGO_B64} style={{ height: 24 }} alt="" />
          <span style={{ color: COLORS.white, fontWeight: 700, fontSize: 14 }}>
            Elite PV
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={mobileOpen}
          style={{
            background: "none",
            border: "none",
            color: COLORS.white,
            fontSize: 22,
            cursor: "pointer",
          }}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.5)",
            zIndex: 99,
          }}
        />
      )}

      {/* Sidebar – Desktop + Mobile Drawer */}
      <div
        className="epv-sidebar"
        style={{
          width: SIDEBAR_WIDTH,
          background: COLORS.dark,
          color: COLORS.white,
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 100,
          overflowY: "auto",
          ...(mobileOpen
            ? { display: "flex", flexDirection: "column" }
            : {}),
        }}
      >
        <Sidebar onNavClick={() => setMobileOpen(false)} />
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: SIDEBAR_WIDTH,
            height: "100vh",
            background: COLORS.dark,
            color: COLORS.white,
            zIndex: 200,
            overflowY: "auto",
            boxShadow: "4px 0 20px rgba(0,0,0,.4)",
          }}
        >
          <Sidebar onNavClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Content */}
      <div
        className="epv-content"
        style={{
          marginLeft: SIDEBAR_WIDTH,
          flex: 1,
          padding: "24px 28px 48px",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}
