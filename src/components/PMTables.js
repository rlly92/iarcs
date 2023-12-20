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

const PMTables = () => {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  const navigate = useNavigate();
  const [state, setState] = useState({ email: "" });

  const accessToken = localStorage.getItem("accessToken");
  const userID = localStorage.getItem("userID");
  const userName = localStorage.getItem("userName");
  const [tables, setTables] = useState([]);

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

  //   Get access token, UserID and store in local storage and load all scenarios:
  useEffect(() => {
    // load all tables for the current user:
    const loadAllTables = async () => {
      try {
        const getAllTables = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/risktables/getall/${userID}`,

          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log(getAllTables.data);
        setTables(getAllTables.data);
      } catch (error) {
        console.error(
          "Error occurred while retrieving scenarios from db.",
          error
        );
      }
    };
    loadAllTables();
  }, [
    state.email,
    getAccessTokenSilently,
    accessToken,
    user,
    isAuthenticated,
    userID,
  ]);

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
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {tables.map((table) => (
              <TableRow key={table.id}>
                <TableCell>{table.title}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default PMTables;
