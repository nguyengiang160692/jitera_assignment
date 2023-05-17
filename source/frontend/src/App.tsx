import React from "react";
import { Routes, Route, Link, Outlet } from "react-router-dom";
import Register from "./component/register";
import Login from "./component/login";
import Dashboard from "./component/dashboard";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, CssBaseline, Typography, Link as MaterialLink } from "@mui/material";
import "./App.css";


const defaultTheme = createTheme();

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<div>Page is not found</div>} />
        </Route>
        <Route path="/auction" element={<AuctionLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="*" element={<div>Page is not found</div>} />
        </Route>
      </Routes>
    </div>
  );
}

const Content: React.FC = () => {
  return <>
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Outlet />
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
          {'Copyright © '}
          <MaterialLink color="inherit" href="https://mui.com/">
            Myself
          </MaterialLink>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Container>
    </ThemeProvider >
  </>
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
        <Content />
      </div>
    </>
  </>
}

const Layout: React.FC = () => {
  return (
    <>
      <div>
        <Content />
      </div>
    </>
  );
};

export default App;
