import React from "react";
import { Routes, Route, Link, Outlet } from "react-router-dom";
import Register from "./component/register";
import Login from "./component/login";
import Dashboard from "./component/dashboard";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, CssBaseline, Typography, Link as MaterialLink, Snackbar } from "@mui/material";

//redux
import { Provider, useSelector } from "react-redux";
import { store, RootState, useAppDispatch } from "./redux/store";
import { closeSnackbar } from "./redux/snackbar";

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
    <Provider store={store}>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Outlet />
          <Popup />
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
    </Provider>
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

const Popup: React.FC = () => {

  const snackBar = useSelector((state: RootState) => state.snackBar)
  const dispatch = useAppDispatch()

  return <>
    <Snackbar open={snackBar.open}
      onClose={() => { dispatch(closeSnackbar()) }}
      message={snackBar.message} />
  </>
}

export default App;
