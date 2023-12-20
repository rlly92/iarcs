import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Home from "./components/Home";
import SignUpInfoPage from "./components/SignUpInfoPage";
import NavBar from "./components/NavBar";
import HomeRC from "./components/HomeRC";
import PMTables from "./components/PMTables";
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
            <Route path="/signupinfo" element={<SignUpInfoPage />} />
            <Route path="/homeRC" element={<HomeRC />} />
            <Route path="/yourprojects" element={<PMTables />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
