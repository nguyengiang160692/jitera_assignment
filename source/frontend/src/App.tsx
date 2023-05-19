import React from "react";
import { Routes, Route, Link, Outlet } from "react-router-dom";
import Register from "./component/register";
import Login from "./component/login";
import Dashboard from "./component/dashboard";
import MainMenu from "./component/navigation/mainMenu";
import { Breakpoint, createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, CssBaseline, Typography, Link as MaterialLink, Snackbar, Alert, AlertColor, Box, Grid } from "@mui/material";

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

interface ContentProps {
  maxWidth?: Breakpoint;
}

const Content = (props: ContentProps) => {
  return <>
    <Provider store={store}>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth={props.maxWidth}>
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <MainMenu />
        <Content maxWidth="md" />
      </Box>
    </>
  </>
}

const Layout: React.FC = () => {
  return (
    <>
      <Content maxWidth="xs" />
    </>
  );
};

const Popup: React.FC = () => {

  const snackBar = useSelector((state: RootState) => state.snackBar)
  const dispatch = useAppDispatch()

  return <>
    <Snackbar open={snackBar.open} onClose={() => { dispatch(closeSnackbar()) }} message={snackBar.message}>
      <Alert onClose={() => { dispatch(closeSnackbar()) }} severity={snackBar.severity as AlertColor} sx={{ width: '100%' }}>
        {snackBar.message}
      </Alert>
    </Snackbar>
  </>
}

export default App;
