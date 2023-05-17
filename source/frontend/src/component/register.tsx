import React from "react";
import { Grid, Box, Avatar, Typography, TextField, Button, FormControlLabel, Checkbox } from "@mui/material";
import { ContactsOutlined } from '@mui/icons-material'
import { Link } from "react-router-dom";

function Register() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()  // prevent default action
  }
  return (
    <>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <ContactsOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Regsitration
        </Typography>
        <Box component={'form'} noValidate onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            type="password"
            id="password"
            label="Password"
            name="password"
            autoComplete="password"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            type="password"
            id="confirm_password"
            label="Confirm Password"
            name="confirm_password"
            autoFocus
          />

          <FormControlLabel control={<Checkbox name="agree_term" />} label="Agree Term & Conditions" />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Grid container>
            <Grid item xs={12}>
              <Link to='/login' >
                Already have account, Login
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default Register;
