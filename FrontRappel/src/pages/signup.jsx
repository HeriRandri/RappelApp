import {
  Stack,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  axios.defaults.baseURL = "http://localhost:4001/";
  // const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUserName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("confirmPassword", confirmPassword);
    try {
      const res = await axios.post("/signUpPost", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data) {
        console.log(res.data);
        // const userId = res.data.data._id;
        navigate(`/login/`);
        setMessage("Signup Successful");
        setIsError(false);
        setOpenSnackBar(true);
      }
    } catch (error) {
      setLoading(false);
      if (error.response) {
        if (error.response.status === 409) {
          setMessage("That email is already registered.");
          setIsError(false);
          setOpenSnackBar(true);
        } else if (error.response.status === 403) {
          setMessage("Password does not match.");
          setIsError(false);
          setOpenSnackBar(true);
        } else {
          console.log(error.response);

          setMessage("An error occurred. Please vefiy your field.");
        }
        setIsError(true);
        setOpenSnackBar(true);
      } else {
        setMessage("An error occurred. Please check your network connection.");
        setIsError(true);
        setOpenSnackBar(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSnackBar = () => {
    setOpenSnackBar(false);
  };

  return (
    <div>
      <div className="flex items-center min-h-screen bg-gray-900 justify-around">
        <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 max-w-md w-full ">
          <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} className="flex">
              <TextField
                label="Name"
                variant="filled"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                size="small"
                InputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "white" } }}
              />
            </Stack>
            <Stack direction="row" spacing={2} className="flex">
              <TextField
                label="Email"
                variant="filled"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                size="small"
                InputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "white" } }}
              />
            </Stack>
            <Stack direction="row" spacing={2} className="flex">
              <TextField
                label="Phone"
                variant="filled"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                fullWidth
                size="small"
                InputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "white" } }}
              />
            </Stack>
            <Stack direction="row" spacing={2} className="flex">
              <TextField
                label="Username"
                variant="filled"
                type="text"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                fullWidth
                size="small"
                InputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "white" } }}
              />
            </Stack>
            <Stack direction="row" spacing={2} className="flex">
              <TextField
                label="Password"
                variant="filled"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                size="small"
                InputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "white" } }}
              />
            </Stack>
            <Stack direction="row" spacing={2} className="flex">
              <TextField
                label="Confirm Password"
                variant="filled"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                size="small"
                InputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "white" } }}
              />
            </Stack>
            <Stack direction="row" spacing={2} className="flex">
              <TextField
                label="Photo profil"
                variant="filled"
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                fullWidth
                size="small"
                accept="image/*"
                InputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "white" } }}
              />
            </Stack>

            <Stack>
              <Button
                variant="contained"
                onClick={handleSignUp}
                className="bg-blue-500 text-white w-full py-2"
              >
                Envoyer
              </Button>
              <p className="text-gray-600 text-xs text-center mt-4">
                Dont have an account?{" "}
                <a href="/login" className="text-blue-700">
                  Sign In
                </a>
              </p>
            </Stack>
            <Stack>
              {loading && (
                <div className="spin_container flex justify-center items-center h-5">
                  <CircularProgress />
                </div>
              )}
            </Stack>
          </Stack>
        </div>

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
  );
};

export default SignUp;
