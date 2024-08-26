import { useState, useEffect } from "react";

import axios from "axios";
import {
  Stack,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Pagination,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import ProfilePage from "./ProfilePage";

const UserPage = () => {
  const { id } = useParams();
  const [task, setTask] = useState([]);
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(dayjs());
  // const [image, setImage] = useState("");
  const [userId, setuserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isloading, setisLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Nombre d'éléments par page
  const [totalTasks, setTotalTasks] = useState(0); //
  const [image, setImage] = useState("");
  // const [dateList, setDateList] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `/addTaskId/${id}`,
        { titre, description, date, image },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response after adding task:", res.data);

      if (res.data) {
        setTitre("");
        setDescription("");
        setDate(dayjs());
        const updatedRes = await axios.get(`/get/${id}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        if (updatedRes.data) {
          const allTask = updatedRes.data.data;
          setTask(allTask);
          setIsFormOpen(false);
        }
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/update/${userId}/${id}`);
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/delete/${id}`);
      setTask((prevList) => prevList.filter((item) => item._id !== id));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setisLoading(true);
    const token = localStorage.getItem("token");
    const fetchTask = async () => {
      try {
        const res = await axios.get(`/get/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page,
            limit: rowsPerPage,
          },
        });
        if (res.data) {
          setTask(res.data.data);
          setuserId(res.data.user._id);
          setUserName(res.data.user.name);
          setTotalTasks(res.data.total);
          console.log(res.data.total);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchTask();
  }, [id, page, rowsPerPage]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleLogout = () => {
    const removeTok = localStorage.removeItem("token");
    if (!removeTok) {
      navigate("/login");
    }
  };
  return (
    <div
      className=" h-screen w-full relative
    flex "
    >
      <div className="md:col-span-1 md:flex md:justify-center">
        <ProfilePage />
      </div>
      <div className="flex  w-full h-auto text-black p-4  flex-col my-5 mx-5 rounded-md border-green-600 border-4">
        <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">{userName}</h2>

          <Stack direction="row" spacing={2}>
            {!isFormOpen && (
              <Button
                variant="contained"
                onClick={() => setIsFormOpen(true)}
                className="bg-blue-500 text-white hover:bg-blue-600 transition duration-200 py-2 px-4"
              >
                Create
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleLogout}
              className="bg-red-500 text-white hover:bg-red-600 transition duration-200 py-2 px-4"
            >
              Logout
            </Button>
          </Stack>
        </div>
        {isFormOpen && (
          <div className="p-4 bg-white rounded-lg shadow-md">
            <Stack spacing={3} maxWidth="600px" width="100%" mx="auto">
              <Stack spacing={2}>
                <TextField
                  label="Titre"
                  variant="outlined"
                  type="text"
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  fullWidth
                  required
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
                  required
                />
              </Stack>

              <Stack spacing={2}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Date et Heure"
                    value={date}
                    onChange={(newValue) => setDate(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Stack>
              {/* <Stack direction="row" spacing={2} className="flex">
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
              </Stack> */}

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
        <div className="overflow-x-auto">
          <TableContainer component={Paper} className="p-4">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="text-sm font-medium">Titre</TableCell>
                  <TableCell className="text-sm font-medium">
                    Description
                  </TableCell>
                  <TableCell className="text-sm font-medium">Date</TableCell>
                  <TableCell className="text-sm font-medium">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {task.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <Typography variant="body2" color="text.primary">
                        {item.titre}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.primary">
                        {item.date}
                      </Typography>
                    </TableCell>

                    <TableCell className="flex justify-around">
                      <IconButton
                        aria-label="edit"
                        color="primary"
                        onClick={() => handleEdit(item._id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => handleDelete(item._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <div className="flex justify-center mt-4">
                <div></div>
                <Pagination
                  count={Math.ceil(totalTasks / rowsPerPage)}
                  page=""
                  onChange={handleChangePage}
                  color="primary"
                />
              </div>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
