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

  // to open the popup box when user clicks on the button "create new project"
  const handleCreateProjectClick = () => {
    setOpenDialog(true);
  };

  // to close the popup box for sending project title to backend:
  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  const handleCreateProject = () => {
    // Add logic to send project title and user ID to the backend
    // For simplicity, you can log them to the console in this example
    console.log("Project Title:", projectTitle);
    console.log("User ID:", userID);

    // Send title and userID to backend to allow user to create a new project:
    const createNewProject = async () => {
      try {
        const createProject = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/risktables/createnewproject`,
          {
            userID: userID,
            title: projectTitle,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log(createProject);
      } catch (error) {
        console.error("Error occurred while creating new project.", error);
      }
    };
    createNewProject();

    // Close the popupbox:
    setOpenDialog(false);
    window.location.reload();
  };

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
              onClick={() => navigate("/yourprojects")}
            >
              Your Projects
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={handleCreateProjectClick}
            >
              Create A New Project
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
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Create a New Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Project Title"
            fullWidth
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleCreateProject}>Create</Button>
        </DialogActions>
      </Dialog>
      <Outlet />
    </>
  );
};

export default NavBar;
