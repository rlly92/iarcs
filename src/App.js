import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Home from "./components/PM/Home";

import NavBar from "./components/PM/NavBar";
import HomeRC from "./components/RC/HomeRC";
import PMTables from "./components/PM/PMTables";
import "./App.css";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/navbar" element={<NavBar />} />

            <Route path="/homeRC" element={<HomeRC />} />
            <Route path="/yourrisktable" element={<PMTables />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
