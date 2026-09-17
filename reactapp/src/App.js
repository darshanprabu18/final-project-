import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import NavBar from "./components/NavBar";
import CampaignList from "./components/CampaignList";
import CampaignDetails from "./components/CampaignDetails";
import CreateCampaign from "./components/CreateCampaign";
import NotFound from "./components/NotFound";

import Login from "./pages/Login";
import Register from "./pages/Register";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">

          <NavBar />

          <main className="main-content">
            <Routes>

              {/* Home */}
              <Route path="/" element={<CampaignList />} />

              {/* Campaign Details */}
              <Route path="/campaign/:id" element={<CampaignDetails />} />
              <Route path="/campaigns/:id" element={<CampaignDetails />} />

              {/* Create Campaign */}
              <Route path="/create" element={<CreateCampaign />} />
              <Route
                path="/create-campaign"
                element={<CreateCampaign />}
              />

              {/* Authentication */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />

            </Routes>
          </main>

        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;