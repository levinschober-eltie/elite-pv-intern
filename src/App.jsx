import React, { Suspense, lazy } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/Toast";
import Layout from "./components/Layout";
import { COLORS } from "./theme";

const Dashboard = lazy(() => import("./modules/dashboard/Dashboard"));
const WartungGenerator = lazy(() => import("./modules/wartung/WartungGenerator"));
const DachpachtGenerator = lazy(() => import("./modules/dachpacht/DachpachtGenerator"));
const FreiflaecheGenerator = lazy(() => import("./modules/freiflaeche/FreiflaecheGenerator"));
const BESSGenerator = lazy(() => import("./modules/bess/BESSGenerator"));
const Kundenverwaltung = lazy(() => import("./modules/kunden/Kundenverwaltung"));
const Vorlagen = lazy(() => import("./modules/vorlagen/Vorlagen"));
const LeitungswegGenerator = lazy(() => import("./modules/leitungsweg/LeitungswegGenerator"));
const BauleitplanungGenerator = lazy(() => import("./modules/bauleitplanung/BauleitplanungGenerator"));
const ProjektVerwaltung = lazy(() => import("./modules/projekte/ProjektVerwaltung"));

function LoadingFallback() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
        <div style={{ fontSize: 13, color: COLORS.mid }}>Wird geladen...</div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
    <HashRouter>
      <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projekte" element={<ProjektVerwaltung />} />
          <Route path="/wartung" element={<WartungGenerator />} />
          <Route path="/dachpacht" element={<DachpachtGenerator />} />
          <Route path="/freiflaeche" element={<FreiflaecheGenerator />} />
          <Route path="/bess" element={<BESSGenerator />} />
          <Route path="/kunden" element={<Kundenverwaltung />} />
          <Route path="/leitungsweg" element={<LeitungswegGenerator />} />
          <Route path="/bauleitplanung" element={<BauleitplanungGenerator />} />
          <Route path="/vorlagen" element={<Vorlagen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      </Suspense>
    </HashRouter>
    </ToastProvider>
  );
}
