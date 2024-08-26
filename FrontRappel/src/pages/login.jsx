import { useEffect, useState } from "react";
import Navbar from "../Navbar";

import { useAuth0 } from "@auth0/auth0-react";
import {
  Stack,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import "tailwindcss/tailwind.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  axios.defaults.baseURL = "http://localhost:4001/";
  // const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const res = await axios.post("/loginPost", { email, password });
        if (res.data) {
          localStorage.setItem("token", res.data.token);
          setOpenSnackBar(true);
          setMessage("Login Successful !");
          setIsError(false);
          setLoading(false);
          const userId = res.data.user._id;
          navigate(`/userPage/${userId}`);
        }
      } catch (error) {
        setLoading(false);
        if (error.response) {
          if (error.response.status === 401) {
            setMessage("Invalid email or password");
            setIsError(true);
            setOpenSnackBar(true);
          } else {
            setMessage("An error occurred. Please try again later.");
            setIsError(true);
            setOpenSnackBar(true);
            // setShowModal(true);
          }
        } else {
          setMessage("An error occurred. Please try again later.");
          setIsError(true);
          setOpenSnackBar(false);
          // setShowModal(true);
        }
      }
    }, 5000);
  };

  const handleOpenSnackBar = () => {
    setOpenSnackBar(false);
  };

  return (
    <div>
      <div className="flex items-center min-h-screen bg-gray-900 justify-center flex-col gap-5">
        <Navbar />
        <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 max-w-xl w-full ">
          <div className="flex items-center w-full max-w-4xl">
            <div className="relative w-full max-w-md h-96">
              <img
                src={image}
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-md shadow-slate-500 "
                // className="w-full h-full object-cover absolute top-0 left-0 rounded-lg"
                // style={{ width: "100%", height: "100%" }}
              />{" "}
            </div>

            <div className="bg-gray-800 text-white rounded-lg shadow-md shadow-slate-500 p-6 max-w-md w-full h-96 relative z-10">
              {" "}
              <h2 className="text-2xl font-bold mb-4 text-center">
                Login For Me
              </h2>
              <Stack spacing={5}>
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    InputProps={{ style: { color: "white" } }}
                    InputLabelProps={{ style: { color: "white" } }}
                  />
                </Stack>
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    InputProps={{ style: { color: "white" } }}
                    InputLabelProps={{ style: { color: "white" } }}
                  />
                </Stack>
                <Stack>
                  <Button
                    variant="contained"
                    onClick={handleLogin}
                    className="bg-blue-500 text-white w-full py-2"
                  >
                    Login
                  </Button>
                  <p className="text-gray-400 text-xs text-center mt-4">
                    Don’t have an account?{" "}
                    <a href="/" className="text-blue-400">
                      Sign Up
                    </a>
                    {!isAuthenticated && (
                      <Button onClick={() => loginWithRedirect()}>Login</Button>
                    )}
                  </p>
                </Stack>
                <Stack>
                  {loading && (
                    <div className="flex justify-center items-center h-5">
                      <CircularProgress />
                    </div>
                  )}
                </Stack>
              </Stack>
            </div>
            {/* </Modal> */}
            <Snackbar
              open={openSnackBar}
              autoHideDuration={6000}
              onClose={handleOpenSnackBar}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                onClose={handleOpenSnackBar}
                severity={isError ? "error" : "success"}
                sx={{ width: "100%" }}
              >
                {message}
              </Alert>
            </Snackbar>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
