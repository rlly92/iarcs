import React, { useState } from "react";

import { useAuth0 } from "@auth0/auth0-react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

import { useNavigate, Outlet } from "react-router-dom";

const NavBarRC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth0();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 2 }}>
            <Button
              variant="contained"
              disableElevation
              onClick={() => navigate("/home")}
            >
              Home
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={() => navigate("/tablesRC")}
            >
              View PM's Risk tables
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={() => navigate("/statsRC")}
            >
              Stats
            </Button>
          </Typography>

          <Button
            variant="contained"
            disableElevation
            onClick={() => {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("userID");
              localStorage.removeItem("userName");
              logout({ logoutParams: { returnTo: window.location.origin } });
            }}
            type="button"
          >
            Log Out
          </Button>
        </Toolbar>
      </AppBar>

      <Outlet />
    </>
  );
};

export default NavBarRC;
