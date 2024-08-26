import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Stack,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

// can be "success", "error", "warning", "info"

import { CircularProgress } from "@mui/material";

const UpdateTask = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const { id, taskId } = useParams();
  console.log(taskId);

  const [task, setTask] = useState(null); // Initially null
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchTask = async () => {
      try {
        const res = await axios.get(`/get/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data) {
          setTask(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchTask();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await axios.put(`/update/${id}/${taskId}`, task);
      setAlertMessage("Task updated successfully!");
      setAlertSeverity("success");
      setOpenSnackbar(true);
      navigate(`/userPage/${id}`);
      // Show a success alert (using MUI Snackbar or any other method)
    } catch (error) {
      console.error(error);
      setAlertMessage("Failed to update task. Please try again.", error);
      setAlertSeverity("error");
      setOpenSnackbar(true);
      alert("erreur de mise a jour");
    }
  };

  if (!task) {
    return <CircularProgress />; // Show a loading spinner while the task is being fetched
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Update Task
      </Typography>
      <Stack spacing={2} maxWidth="600px" margin="auto">
        <TextField
          label="Titre"
          variant="outlined"
          type="text"
          value={task.titre}
          onChange={(e) => setTask({ ...task, titre: e.target.value })}
          fullWidth
        />
        <TextField
          label="Description"
          variant="outlined"
          type="text"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Update
        </Button>
      </Stack>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={alertMessage}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UpdateTask;
