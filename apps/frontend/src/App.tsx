import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import AssociationsPage from "./pages/AssociationsPage";
import AssociationDetailPage from "./pages/AssociationDetailPage";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/foreningar" element={<AssociationsPage />} />
        <Route path="/foreningar/:id" element={<AssociationDetailPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
