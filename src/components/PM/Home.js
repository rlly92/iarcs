import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

import {
  Button,
  Paper,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const Home = () => {
  const { isAuthenticated, user, getAccessTokenSilently, isLoading } =
    useAuth0();

  const navigate = useNavigate();
  const [state, setState] = useState({ email: "" });
  const [scenarios, setScenarios] = useState({ scenarios: [] });

  const accessToken = localStorage.getItem("accessToken");
  const userID = localStorage.getItem("userID");
  const userName = localStorage.getItem("userName");

  // check if user is signed-in, and if not, redirect them to login page, if signed in, check if they are RC, if yes, then redirect to home RC page:
  useEffect(() => {
    // Check if the user is authenticated
    if (!isAuthenticated) {
      // If not authenticated, redirect to "/"
      navigate("/");
    } else {
      // If authenticated, check the user's email

      if (user?.email === "riskconsultant@gmail.com") {
        // If the user's email is "riskconsultant@gmail.com", redirect to "/homeRC"
        navigate("/homeRC");
      }
    }
  }, [isAuthenticated, navigate, user?.email]);

  //   Get access token, UserID and store in local storage and load all scenarios:
  useEffect(() => {
    // 1. get accessToken and store in local storage:
    const getTokenAndEmail = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUDIENCE,
            scope: "read:current_user",
          },
        });
        console.log("token:", token);
        localStorage.setItem("accessToken", token);

        if (isAuthenticated && user) {
          setState({
            email: user.email,
          });
          console.log("user email:", user.email);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getTokenAndEmail();

    // 2. Get UserID from backend and store in local storage:
    const getCurrentUserID = async () => {
      try {
        const getUserID = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/users/getUserID?email=${state.email}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        // store the userID and userName (retrieved from backend) in the local storage:
        console.log(getUserID.data);
        localStorage.setItem("userID", getUserID.data.id);
        localStorage.setItem("userName", getUserID.data.name);
      } catch (error) {
        console.error("Error occurred while retrieving userID from db.", error);
      }
    };
    getCurrentUserID();
    // 3. Load all the scenarios:
    const loadAllScenarios = async () => {
      try {
        const getAllScenarios = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/riskscenarios`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (getAllScenarios.data) {
          // if the scenarios exist in the db(they normally would), store the scenarios data in the local state of scenarios for rendering in return block:
          setScenarios(getAllScenarios.data);
        }
      } catch (error) {
        console.error(
          "Error occurred while retrieving scenarios from db.",
          error
        );
      }
    };
    loadAllScenarios();
  }, [state.email, getAccessTokenSilently, accessToken, user, isAuthenticated]);

  console.log("scenarios:", scenarios);
  console.log(user?.email);

  // button action for what happens when PM clicks "add to risk table button":
  const handleButtonClick = async (scenario) => {
    try {
      // Send the scenario to the backend
      const addToRiskTable = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/usersriskscenarios/addtorisktable`,
        {
          riskscenario_id: scenario.id,
          user_id: userID,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Handle success:
      console.log(addToRiskTable.data.message);
      if (
        addToRiskTable.data.message ===
        "This risk scenario already exists in your risk table"
      ) {
        alert("This risk scenario already exists in your risk table");
      } else if (addToRiskTable.statusText === "OK") {
        alert("This risk scenario has been added to your risk table");
      }
    } catch (error) {
      // Handle errors
      console.error("Error adding scenario to risk table:", error);
      alert("There was an error adding the risk scenario to your risk table.");
    }
  };

  if (isLoading) {
    // Show loading state
    return (
      <div>
        <h1>Loading...Your patience is appreciated.</h1>
      </div>
    );
  }

  return (
    <Stack alignItems={"center"} justifyContent={"center"} my={1}>
      <Paper sx={{ px: 5, py: 4, my: 7 }} elevation={0}>
        <Typography
          variant="h3"
          sx={{ fontFamily: "'Yeseva One'", textAlign: "center" }}
        >
          Hello {userName}
        </Typography>
      </Paper>
      <NavBar />
      {scenarios.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Strategy</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scenarios.map((scenario) => (
                <TableRow key={scenario.id}>
                  <TableCell>{scenario.id}</TableCell>
                  <TableCell>{scenario.name}</TableCell>
                  <TableCell>{scenario.description}</TableCell>
                  <TableCell>{scenario.strategy}</TableCell>
                  <TableCell>
                    {/* Add a button for each row */}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleButtonClick(scenario)}
                    >
                      Add to risk table
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  );
};

export default Home;
