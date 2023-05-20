import { Alert, AlertColor, Box, Container, CssBaseline, Snackbar } from "@mui/material";
import { Breakpoint, ThemeProvider, createTheme } from '@mui/material/styles';
import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import Dashboard from "./component/dashboard";
import Login from "./component/login";
import MainMenu from "./component/navigation/mainMenu";
import Register from "./component/register";

//redux
import { Provider, useSelector } from "react-redux";
import { closeSnackbar } from "./redux/snackbar";
import { RootState, store, useAppDispatch } from "./redux/store";

import { Copyright } from "@mui/icons-material";
import "./App.css";


const defaultTheme = createTheme();

function App() {
  return (
    <Box className="App">
      <Provider store={store}>
        <ThemeProvider theme={defaultTheme}>
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
        </ThemeProvider>
      </Provider>
    </Box>
  );
}

interface ContentProps {
  maxWidth?: Breakpoint;
}

const Content = (props: ContentProps) => {
  return <>
    <Container component="main" {...props}>
      <CssBaseline />
      {/* BEGIN Here we Layout components */}
      <Outlet />
      {/* END Here we Layout components */}
      <Popup />
    </Container>
  </>
}

const AuctionLayout: React.FC = () => {
  return <>
    <>
      <Container maxWidth={'md'}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '0 auto',
            outline: '1px solid black',
          }}
        >
          <MainMenu />
          <Content maxWidth="md" />
          <Copyright />
        </Box>
      </Container>
    </>
  </>
}

const Layout: React.FC = () => {
  return (
    <>
      <Content maxWidth="xs" />
      <Copyright />
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
