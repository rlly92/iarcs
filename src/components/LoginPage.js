import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { useNavigate } from "react-router-dom";

import { Button, Paper, Stack, Typography } from "@mui/material";

const LoginPage = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  });

  return (
    <Stack alignItems={"center"} justifyContent={"center"} my={1}>
      <Paper sx={{ px: 5, py: 4, my: 7 }} elevation={0}>
        <Typography
          variant="h1"
          sx={{ fontFamily: "'Yeseva One'", textAlign: "center" }}
        >
          IARCS Risk Scenario System
        </Typography>
      </Paper>
      <Typography
        variant="h4"
        sx={{ fontFamily: "'Yeseva One'", textAlign: "center" }}
      >
        Please log in to view risk scenario tables
      </Typography>
      <br />
      <br />
      <Button variant="contained" onClick={() => loginWithRedirect()}>
        Log In
      </Button>

      {/* <Button
        variant="contained"
        onClick={() =>
          loginWithRedirect({
            authorizationParams: {
              screen_hint: "signup",
            },
            appState: {
              returnTo: "/home",
            },
          })
        }
      >
        Sign Up
      </Button> */}
      <br />
      <br />
      <br />
      <br />
    </Stack>
  );
};

export default LoginPage;
