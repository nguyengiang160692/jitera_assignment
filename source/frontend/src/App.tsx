import React from "react";
import { Routes, Route, Link, Outlet } from "react-router-dom";
import Register from "./component/register";
import Login from "./component/login";
import Dashboard from "./component/dashboard";
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
        <Route path="/auction" element={<AuctionLayout/>}>
          <Route index element={<Dashboard />} />
          <Route path="*" element={<div>Page is not found</div>} />
        </Route>
      </Routes>
    </div>
  );
}
const AuctionLayout: React.FC = () => {
  return <>
     <>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/logout">Logout</Link>
            </li>
          </ul>
        </nav>
        <Outlet />
      </div>
    </>
  </>
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
