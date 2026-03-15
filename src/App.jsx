import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./modules/dashboard/Dashboard";
import WartungGenerator from "./modules/wartung/WartungGenerator";
import DachpachtGenerator from "./modules/dachpacht/DachpachtGenerator";
import FreiflaecheGenerator from "./modules/freiflaeche/FreiflaecheGenerator";
import PlaceholderPage from "./components/PlaceholderPage";

function BESSPlaceholder() {
  return (
    <PlaceholderPage
      title="BESS-Generator"
      icon="🔋"
      description="6-Tab-Workflow mit 4 Modellen, Hybrid PV+BESS"
    />
  );
}

function KundenPlaceholder() {
  return (
    <PlaceholderPage
      title="Kundenverwaltung"
      icon="👥"
      description="CRUD, Suche, JSON Export/Import"
    />
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/wartung" element={<WartungGenerator />} />
          <Route path="/dachpacht" element={<DachpachtGenerator />} />
          <Route path="/freiflaeche" element={<FreiflaecheGenerator />} />
          <Route path="/bess" element={<BESSPlaceholder />} />
          <Route path="/kunden" element={<KundenPlaceholder />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
