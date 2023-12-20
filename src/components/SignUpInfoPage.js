// REMOVE THIS FILE AFTER YOU'RE DONE WITH 90% OF THE PROJECT:

// import React, { useState, useEffect } from "react";
// import { useAuth0 } from "@auth0/auth0-react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// import { Button, Stack, TextField, Typography } from "@mui/material";

// const SignUpInfoPage = () => {
//   const { isAuthenticated, user, isLoading } = useAuth0();

//   const accessToken = localStorage.getItem("accessToken");
//   console.log("access token:", accessToken);

//   const [state, setState] = useState({
//     email: "",
//     name: "",
//     isrc: null,
//   });
//   const navigate = useNavigate();

//   // UseEffect here to validate if user has given backend his user data, if yes redirect them to /home page:
//   useEffect(() => {
//     const checkUserInfoExists = async () => {
//       if (state.email !== "") {
//         try {
//           const response = await axios.get(
//             `${process.env.REACT_APP_BACKEND_URL}/users/checkuserinfo?email=${state.email}`,
//             {
//               headers: {
//                 Authorization: `Bearer ${accessToken}`,
//               },
//             }
//           );
//           console.log(response.data);
//           // Check the response to determine if the user exists on db:
//           if (!response.data.error) {
//             console.log("user info exists!");
//             navigate("/home");
//           } else {
//             console.log("user info does not exist!");
//           }
//         } catch (error) {
//           console.error(
//             "Error occurred while checking user info exists on db:",
//             error
//           );
//         }
//       }
//     };
//     checkUserInfoExists();
//   }, [state?.email, accessToken]);

//   // GET EMAIL ON MOUNT:
//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate("/");
//     }
//     if (isAuthenticated && user) {
//       setState({
//         email: user.email,
//       });
//       console.log("user email:", user.email);
//     }
//   }, [isAuthenticated]);

//   console.log("email:", state.email);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Perform form submission actions
//     axios
//       .post(
//         `${process.env.REACT_APP_BACKEND_URL}/users/signupinfo`,
//         {
//           email: state.email,
//           name: state.name,
//           isrc: false,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       )
//       .then((res) => {
//         setState({
//           email: "",
//           name: "",
//           isrc: null,
//         });

//         navigate("/home");
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//     console.log({
//       email: state.email,
//       name: state.name,
//       isrc: state.isrc,
//     });
//     return console.log("you've submitted user info!");
//   };

//   const handleChange = (e) => {
//     setState({ ...state, [e.target.id]: e.target.value });
//     console.log(state);
//   };

//   if (isLoading) {
//     // Show loading state
//     return (
//       <div>
//         <h1>Loading...Your patience is appreciated.</h1>
//       </div>
//     );
//   }
//   return (
//     <Stack alignItems={"center"} justifyContent={"center"} my={5}>
//       <Typography variant="h2">Thank you for signing up!</Typography>
//       <br />
//       <Typography variant="subtitle1">
//         Please kindly provide your details again:
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <Stack
//           alignItems={"center"}
//           justifyContent={"center"}
//           spacing={2}
//           mt={2}
//         >
//           <TextField
//             required
//             autoComplete="off"
//             value={state.name}
//             size="small"
//             id="name"
//             type="name"
//             label="Name"
//             onChange={handleChange}
//           ></TextField>
//           <TextField
//             required
//             autoComplete="off"
//             value={state.email}
//             size="small"
//             id="email"
//             type="email"
//             label="Email"
//             onChange={handleChange}
//           ></TextField>

//           <Button type="submit" variant="contained">
//             Sign Up
//           </Button>
//         </Stack>
//       </form>
//     </Stack>
//   );
// };

// export default SignUpInfoPage;
