import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Home from "./components/Home";
import SignUpInfoPage from "./components/SignUpInfoPage";
import "./App.css";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/signupinfo" element={<SignUpInfoPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
