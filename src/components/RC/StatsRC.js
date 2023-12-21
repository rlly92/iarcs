import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";
import NavBarRC from "./NavBarRC";

import { Paper, Stack, Typography } from "@mui/material";

const StatsRC = () => {
  const { isAuthenticated, user, isLoading } = useAuth0();

  const navigate = useNavigate();
  const [riskTables, setRiskTables] = useState({ RiskTables: [] });

  const accessToken = localStorage.getItem("accessToken");
  const userID = localStorage.getItem("userID");
  const userName = localStorage.getItem("userName");

  const generatePieChartData = (riskTables) => {
    if (!Array.isArray(riskTables)) {
      return []; // Return an empty array if riskTables is not an array
    }

    // Count the occurrences of each risk scenario
    const riskScenarioCount = riskTables.reduce((acc, user) => {
      user.riskScenarios.forEach((riskScenario) => {
        const { riskScenarioName } = riskScenario;
        acc[riskScenarioName] = (acc[riskScenarioName] || 0) + 1;
      });
      return acc;
    }, {});

    // Convert the count object to an array of objects for PieChart data
    const pieChartData = Object.entries(riskScenarioCount).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    return pieChartData;
  };

  // Use the function to generate piechart:
  const dataForPieChart = generatePieChartData(riskTables);

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
          await setRiskTables(getPMRiskTables.data);
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

      <NavBarRC />

      <PieChart width={400} height={400}>
        <Pie
          dataKey="value"
          isAnimationActive={true}
          data={dataForPieChart}
          cx="50%"
          cy="50%"
          outerRadius={130}
          fill="#8884d8"
          label
        />

        <Tooltip />
      </PieChart>
    </Stack>
  );
};

export default StatsRC;
