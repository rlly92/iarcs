import React, { useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

import { useNavigate, Outlet } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated, user } = useAuth0();
  const [openDialog, setOpenDialog] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const userID = localStorage.getItem("userID");
  const accessToken = localStorage.getItem("accessToken");

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
              onClick={() => navigate("/yourrisktable")}
            >
              Your Risk Table
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

export default NavBar;
