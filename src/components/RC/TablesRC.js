import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import NavBarRC from "./NavBarRC";

import {
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

const TablesRC = () => {
  const { isAuthenticated, user, isLoading } = useAuth0();

  const navigate = useNavigate();
  const [riskTables, setRiskTables] = useState({ RiskTables: [] });

  const accessToken = localStorage.getItem("accessToken");
  const userID = localStorage.getItem("userID");
  const userName = localStorage.getItem("userName");

  // check if user is signed-in, and if not, redirect them to login page, if signed in, check if they are RC, if not, then redirect to homepage:
  useEffect(() => {
    // Check if the user is authenticated
    if (!isAuthenticated) {
      // If not authenticated, redirect to "/" aka the login page:
      navigate("/");
    } else {
      // If authenticated, check the user's email:

      if (!(user?.email === "riskconsultant@gmail.com")) {
        // If the user's email is not "riskconsultant@gmail.com", redirect to "/home"
        navigate("/home");
      }
    }
  }, [isAuthenticated, navigate, user?.email]);

  // to get all of the risk tables created by PMs:
  useEffect(() => {
    const loadPMRiskTable = async () => {
      try {
        const getPMRiskTables = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/usersriskscenarios/getallriskscenariotables`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (getPMRiskTables.data) {
          // if the PMRiskSenarios.data exist in the db(they normally would), store them in state variable for rendering in return block:
          setRiskTables(getPMRiskTables.data);
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

  console.log(riskTables);

  if (isLoading && !isAuthenticated) {
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

      <NavBarRC />
      {riskTables.length > 0 ? (
        <div>
          {riskTables.map((user) => (
            <div key={user.user_id} style={{ marginBottom: "20px" }}>
              <Typography variant="h4" sx={{ mt: 2 }}>
                PM's Name: {user.userName}
              </Typography>
              <TableContainer component={Paper} sx={{ marginTop: "10px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: "25%" }}>Risk Scenario</TableCell>
                      <TableCell sx={{ width: "50%" }}>
                        Risk Description
                      </TableCell>
                      <TableCell sx={{ width: "25%" }}>Strategy</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {user.riskScenarios.map((scenario) => (
                      <TableRow key={scenario.id}>
                        <TableCell>{scenario.riskScenarioName}</TableCell>
                        <TableCell>
                          {scenario.riskScenarioDescription}
                        </TableCell>
                        <TableCell>{scenario.riskScenarioStrategy}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ))}
        </div>
      ) : (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No Risk Tables Available.
        </Typography>
      )}
    </Stack>
  );
};

export default TablesRC;
