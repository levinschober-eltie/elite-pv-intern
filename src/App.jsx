import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/Toast";
import Layout from "./components/Layout";
import Dashboard from "./modules/dashboard/Dashboard";
import WartungGenerator from "./modules/wartung/WartungGenerator";
import DachpachtGenerator from "./modules/dachpacht/DachpachtGenerator";
import FreiflaecheGenerator from "./modules/freiflaeche/FreiflaecheGenerator";
import BESSGenerator from "./modules/bess/BESSGenerator";
import Kundenverwaltung from "./modules/kunden/Kundenverwaltung";
import Vorlagen from "./modules/vorlagen/Vorlagen";
import LeitungswegGenerator from "./modules/leitungsweg/LeitungswegGenerator";
import BauleitplanungGenerator from "./modules/bauleitplanung/BauleitplanungGenerator";

export default function App() {
  return (
    <ToastProvider>
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/wartung" element={<WartungGenerator />} />
          <Route path="/dachpacht" element={<DachpachtGenerator />} />
          <Route path="/freiflaeche" element={<FreiflaecheGenerator />} />
          <Route path="/bess" element={<BESSGenerator />} />
          <Route path="/kunden" element={<Kundenverwaltung />} />
          <Route path="/leitungsweg" element={<LeitungswegGenerator />} />
          <Route path="/bauleitplanung" element={<BauleitplanungGenerator />} />
          <Route path="/vorlagen" element={<Vorlagen />} />
        </Route>
      </Routes>
    </HashRouter>
    </ToastProvider>
  );
}
