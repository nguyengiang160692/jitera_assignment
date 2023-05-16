import React from "react";
import { Routes, Route, Link, Outlet } from "react-router-dom";
import Register from "./component/register";
import Login from "./component/login";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<div>Page is not found</div>} />
        </Route>
        <Route path="/auction">
          
        </Route>
      </Routes>
    </div>
  );
}
const Layout: React.FC = () => {
  return (
    <>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </ul>
        </nav>
        <Outlet />
      </div>
    </>
  );
};

export default App;
