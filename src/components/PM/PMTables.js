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
  Select,
  MenuItem,
} from "@mui/material";

const PMTables = () => {
  const { isAuthenticated, user, isLoading } = useAuth0();

  const navigate = useNavigate();
  const [scenarios, setScenarios] = useState({ scenarios: [] });

  const accessToken = localStorage.getItem("accessToken");
  const userID = localStorage.getItem("userID");
  const userName = localStorage.getItem("userName");

  // check if user is signed-in, and if not, redirect them to login page, if signed in, check if they are RC, if yes, then redirect to home RC page:
  useEffect(() => {
    // Check if the user is authenticated
    if (!isAuthenticated) {
      // If not authenticated, redirect to "/" aka the login page:
      navigate("/");
    } else {
      // If authenticated, check the user's email:

      if (user?.email === "riskconsultant@gmail.com") {
        // If the user's email is "riskconsultant@gmail.com", redirect to "/homeRC"
        navigate("/homeRC");
      }
    }
  }, [isAuthenticated, navigate, user?.email]);

  useEffect(() => {
    // get req to load all the risk scenarios in your risk table:
    const loadPMRiskTable = async () => {
      try {
        const getPMRiskScenarios = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/usersriskscenarios/getPMriskscenarios/${userID}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (getPMRiskScenarios.data) {
          // if the PMRiskSenarios.data exist in the db(they normally would), store them in state variable for rendering in return block:
          setScenarios(getPMRiskScenarios.data);
        }
      } catch (error) {
        console.error(
          "Error occurred while retrieving PM's risk scenarios from db.",
          error
        );
      }
    };
    loadPMRiskTable();
  }, [userID, accessToken, user?.email, isAuthenticated]);

  console.log(scenarios);

  // Function to handle deletion of a scenario when PM hits delete button:
  const handleDelete = async (UserRiskScenarioID) => {
    try {
      // Add logic to delete the scenario with the given UserRiskScenarioID:
      // Display a confirmation popup to confirm if user wants to delete the scenario:
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this scenario?"
      );

      // If the user confirms, proceed with deletion
      if (isConfirmed) {
        await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/usersriskscenarios/deletescenario/${UserRiskScenarioID}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }
      // After successful deletion, update the state directly without a reload
      setScenarios((prevScenarios) =>
        prevScenarios.filter(
          (scenario) => scenario.user_riskscenario_id !== UserRiskScenarioID
        )
      );
    } catch (error) {
      console.error("Error occurred while deleting the scenario", error);
    }
  };

  // Function to handle updating a scenario with status change
  const handleUpdateWithStatus = async (UserRiskScenarioID, newStatus) => {
    try {
      const editStatus = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/usersriskscenarios/editstatus`,
        {
          status: newStatus,
          UserRiskScenarioID: UserRiskScenarioID,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(editStatus);
      // No need to reload the window; update the scenarios state directly
      setScenarios((prevScenarios) =>
        prevScenarios.map((scenario) =>
          scenario.user_riskscenario_id === UserRiskScenarioID
            ? { ...scenario, status: newStatus }
            : scenario
        )
      );
    } catch (error) {
      console.error("Error occurred while updating the status", error);
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
      {scenarios.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>

                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scenarios.map((scenario) => (
                <TableRow key={scenario.id}>
                  <TableCell>{scenario.name}</TableCell>
                  <TableCell>{scenario.description}</TableCell>
                  <TableCell>
                    <Select
                      value={scenario.status || ""}
                      onChange={(e) =>
                        handleUpdateWithStatus(
                          scenario.user_riskscenario_id,
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="Not Mitigated">Not Mitigated</MenuItem>
                      <MenuItem value="Fully Mitigated">
                        Fully Mitigated
                      </MenuItem>
                      <MenuItem value="Partially Mitigated">
                        Partially Mitigated
                      </MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "red", color: "white" }}
                      onClick={() =>
                        handleDelete(scenario.user_riskscenario_id)
                      }
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No scenarios available.
        </Typography>
      )}
    </Stack>
  );
};

export default PMTables;
