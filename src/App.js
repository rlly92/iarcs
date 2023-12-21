import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Home from "./components/PM/Home";
import NavBar from "./components/PM/NavBar";
import HomeRC from "./components/RC/HomeRC";
import PMTables from "./components/PM/PMTables";
import NavBarRC from "./components/RC/NavBarRC";
import TablesRC from "./components/RC/TablesRC";
import StatsRC from "./components/RC/StatsRC";
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
            <Route path="/yourrisktable" element={<PMTables />} />

            <Route path="/homeRC" element={<HomeRC />} />
            <Route path="/navbarRC" element={<NavBarRC />} />
            <Route path="/tablesRC" element={<TablesRC />} />
            <Route path="/statsRC" element={<StatsRC />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
