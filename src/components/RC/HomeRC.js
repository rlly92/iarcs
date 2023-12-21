import React, { useState, useContext, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../PM/NavBar";

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
  Modal,
  TextField,
} from "@mui/material";

const HomeRC = () => {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  const navigate = useNavigate();
  const [state, setState] = useState({ email: "" });
  const [scenarios, setScenarios] = useState({ scenarios: [] });

  // state variables for Edit Modal:
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedStrategy, setEditedStrategy] = useState("");

  // state variables for Adding New Risk Scenario Modal:
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [newScenarioName, setNewScenarioName] = useState("");
  const [newScenarioDescription, setNewScenarioDescription] = useState("");
  const [newScenarioStrategy, setNewScenarioStrategy] = useState("");

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
      if (!user?.email === "riskconsultant@gmail.com") {
        // If the user's email is NOT "riskconsultant@gmail.com", redirect to "/home"
        navigate("/home");
      }
    }
  }, [isAuthenticated, navigate, user?.email]);

  //   Get access token, UserID and store in local storage and load all scenarios:
  useEffect(() => {
    // 1. store email in state so it can be used in get req later:

    if (isAuthenticated && user) {
      setState({
        email: user.email,
      });
      console.log("user email:", user.email);
    }

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
  }, [
    state.email,
    getAccessTokenSilently,
    accessToken,
    user,
    isAuthenticated,
    userName,
  ]);

  console.log("scenarios:", scenarios);
  console.log(user?.email);

  // Function to handle opening the EDIT modal and setting/pre-locking-in the selected scenario for editing:
  const handleOpenModal = (scenario) => {
    setSelectedScenario(scenario);
    setEditedName(scenario.name);
    setEditedDescription(scenario.description);
    setEditedStrategy(scenario.strategy);
    setModalOpen(true);
  };

  // Function to handle closing the EDIT modal
  const handleCloseModal = () => {
    setSelectedScenario(null);
    setModalOpen(false);
  };

  // button action for what happens when RC clicks "EDIT" button:
  const handleButtonEdit = async (scenarioID) => {
    try {
      // Send the scenario to the backend
      const editRiskScenario = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/riskscenarios/editriskscenario`,
        {
          riskscenario_id: selectedScenario.id,
          name: editedName,
          description: editedDescription,
          strategy: editedStrategy,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // Handle success:
      console.log(editRiskScenario);
      if (editRiskScenario.statusText === "OK") {
        alert("Risk scenario has been successfully updated");

        // Update the state without making another API call
        setScenarios((prevScenarios) =>
          prevScenarios.map((scenario) =>
            scenario.id === selectedScenario.id
              ? {
                  ...scenario,
                  name: editedName,
                  description: editedDescription,
                  strategy: editedStrategy,
                }
              : scenario
          )
        );

        handleCloseModal();
      }
    } catch (error) {
      // Handle errors
      console.error("Error editing risk scenario:", error);
      alert("There was an error editing the risk scenario.");
    }
  };

  // Function to handle opening the modal to ADD a new scenario:
  const handleOpenRiskModal = () => {
    setAddModalOpen(true);
  };

  // Function to handle closing the modal to ADD a new scenario:
  const handleCloseRiskModal = () => {
    setAddModalOpen(false);
  };

  // Function to handle SUBMIT BUTTON to add a new risk scenario
  const handleAddRiskScenario = async () => {
    try {
      // Send the new scenario to the backend
      const addRiskScenario = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/riskscenarios/addriskscenario`,
        {
          name: newScenarioName,
          description: newScenarioDescription,
          strategy: newScenarioStrategy,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Handle success:
      console.log(addRiskScenario);
      if (addRiskScenario.statusText === "OK") {
        alert("Risk scenario has been successfully added");

        // Update the state without making another API call
        setScenarios((prevScenarios) => [
          ...prevScenarios,
          addRiskScenario.data,
        ]);

        handleCloseRiskModal();
      }
    } catch (error) {
      // Handle errors
      console.error("Error adding risk scenario:", error);
      alert("There was an error adding the risk scenario.");
    }
  };

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
                      color="secondary"
                      onClick={() => handleOpenModal(scenario)}
                    >
                      EDIT
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* Modal for editing scenario */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Paper>
            <form onSubmit={handleButtonEdit}>
              <Stack spacing={2} p={4}>
                <Typography variant="h5" mb={2}>
                  Edit Scenario
                </Typography>
                <TextField
                  label="Name"
                  fullWidth
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  required
                />
                <TextField
                  label="Description"
                  fullWidth
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  required
                />
                <TextField
                  label="Strategy"
                  fullWidth
                  value={editedStrategy}
                  onChange={(e) => setEditedStrategy(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
                <Button variant="contained" onClick={handleCloseModal}>
                  Cancel
                </Button>
              </Stack>
            </form>
          </Paper>
        </div>
      </Modal>
      <br />
      <Button variant="contained" onClick={handleOpenRiskModal}>
        ADD RISK SCENARIO
      </Button>

      {/* Modal for adding a new risk scenario */}
      <Modal open={isAddModalOpen} onClose={handleCloseRiskModal}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Paper>
            <form onSubmit={handleAddRiskScenario}>
              <Stack spacing={2} p={4}>
                <Typography variant="h5" mb={2}>
                  Add Risk Scenario
                </Typography>
                <TextField
                  label="Name"
                  fullWidth
                  value={newScenarioName}
                  onChange={(e) => setNewScenarioName(e.target.value)}
                  required
                />
                <TextField
                  label="Description"
                  fullWidth
                  value={newScenarioDescription}
                  onChange={(e) => setNewScenarioDescription(e.target.value)}
                  required
                />
                <TextField
                  label="Strategy"
                  fullWidth
                  value={newScenarioStrategy}
                  onChange={(e) => setNewScenarioStrategy(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
                <Button variant="contained" onClick={handleCloseRiskModal}>
                  Cancel
                </Button>
              </Stack>
            </form>
          </Paper>
        </div>
      </Modal>
    </Stack>
  );
};

export default HomeRC;
