import React, { useState, useContext, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const { logout, isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  const navigate = useNavigate();
  const [state, setState] = useState({ email: "" });
  const [scenarios, setScenarios] = useState({ scenarios: [] });

  const accessToken = localStorage.getItem("accessToken");
  const userID = localStorage.getItem("userID");

  // GET TOKEN AND EMAIL:
  useEffect(() => {
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
        }
      } catch (err) {
        console.log(err);
        navigate("/");
      }
    };
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
          // if the listings exist in the db(they normally would), store the listings data in the local state of listings:
          await setScenarios(getAllScenarios.data);
        }
      } catch (error) {
        console.error(
          "Error occurred while retrieving scenarios from db.",
          error
        );
      }
    };
    loadAllScenarios();
    getTokenAndEmail();
  }, [accessToken]);

  // LOAD ALL SCENARIOS:
  //   useEffect(() => {

  //   }, [accessToken, ]);
  console.log("scenarios:", scenarios);

  return (
    <Stack alignItems={"center"} justifyContent={"center"} my={1}>
      <Paper sx={{ px: 5, py: 4, my: 7 }} elevation={0}>
        <Typography
          variant="h3"
          sx={{ fontFamily: "'Yeseva One'", textAlign: "center" }}
        >
          Hello {user.nickname}
        </Typography>
      </Paper>

      {scenarios.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Strategy</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scenarios.map((scenario) => (
                <TableRow key={scenario.id}>
                  <TableCell>{scenario.id}</TableCell>
                  <TableCell>{scenario.name}</TableCell>
                  <TableCell>{scenario.description}</TableCell>
                  <TableCell>{scenario.strategy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <br />
      <Button
        variant="contained"
        disableElevation
        onClick={() => {
          localStorage.removeItem("accessToken");
          logout({ logoutParams: { returnTo: window.location.origin } });
        }}
        type="button"
      >
        Log Out
      </Button>
    </Stack>
  );
};

export default Home;
