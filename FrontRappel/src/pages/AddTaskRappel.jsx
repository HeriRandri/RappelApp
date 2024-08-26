import { useState, useEffect } from "react";

import axios from "axios";
import {
  Stack,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const AddTaskRappel = () => {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(dayjs());
  const [ope, setOpe] = useState(false);

  const [list, setList] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "/add",
        { titre, description, date },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data) {
        const token = localStorage.getItem("token");

        setTitre("");
        setDescription("");
        setDate(dayjs());
        const updatedRes = await axios.get("/list", {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        if (updatedRes.data) {
          setList(updatedRes.data.data);
        }

        setOpe(false);
      }
      console.log("Task added successfully:", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/update/${id}`);
  };
  const handleDelete = async (id) => {
    try {
      console.log("delete");

      await axios.delete(`/delete/${id}`);
      setList((prevList) => prevList.filter((item) => item._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("/list", {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data) {
          setList(res.data.data);
          console.log(res.data.user);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    const res = localStorage.removeItem("token");
    if (res) {
      navigate("/");
    }
    alert("Token no supprimer, logout failed");
  };

  return (
    <div className="flex items-center w-full h-screen text-black p-4 justify-around flex-col">
      <Button
        variant="contained"
        onClick={handleLogout}
        className="bg-blue-300 text-white w-full py-2"
      >
        Logout
      </Button>
      {ope ? (
        ""
      ) : (
        <Stack spacing={2}>
          <Button
            variant="contained"
            onClick={() => setOpe(true)}
            className="bg-blue-500 text-white w-full py-2"
            // startIcon={<SendIcon />}
          >
            Create
          </Button>
        </Stack>
      )}
      {ope && (
        <div>
          <Stack spacing={2} maxWidth="600px" width="100%">
            <Stack spacing={2}>
              <TextField
                label="Titre"
                variant="outlined"
                type="text"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                fullWidth
              />
            </Stack>

            <Stack spacing={2}>
              <TextField
                label="Description"
                variant="outlined"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
              />
            </Stack>

            <Stack spacing={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Date et Heure"
                  value={date}
                  onChange={(newValue) => setDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Stack>

            <Stack spacing={2}>
              <input
                type="file"
                accept="image/*"
                // onChange={(e) => setImage(e.target.files[0])}
              />
            </Stack>

            <Stack spacing={2}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                className="bg-blue-500 text-white w-full py-2"
                startIcon={<SendIcon />}
              >
                Envoyer
              </Button>
            </Stack>
          </Stack>
        </div>
      )}
      <div className="flex flex-wrap gap-4 mt-4 max-w-[1200px]">
        {list.map((item) => (
          <Card key={item._id} sx={{ maxWidth: 300 }}>
            <CardMedia
              component="img"
              height="140"
              image={item.image ? item.image : ""}
              alt="Image de tâche"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {item.titre}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
              <Typography variant="body2" color="text.primary">
                {item.date}
              </Typography>
            </CardContent>
            <CardActions className="flex justify-around">
              <IconButton
                aria-label="edit"
                color="blank² "
                onClick={() => handleEdit(item._id)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label="delete"
                onClick={() => handleDelete(item._id)}
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </div>
      {/* {user.map((item, index) => (
        <ul key={item}>
          <li>{index.email}</li>
        </ul>
      ))} */}
    </div>
  );
};

export default AddTaskRappel;
