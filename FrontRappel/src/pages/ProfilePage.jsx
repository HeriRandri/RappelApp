import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

const ProfilePage = () => {
  const [name, setName] = useState(null);
  const [username, setUserName] = useState(null);
  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchTask = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`/get/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data) {
          setUserName(res.data.user.username);
          setName(res.data.user.name);
          setPhone(res.data.user.phone);
        }
      } catch (error) {
        setError("Failed to fetch user data.");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }
  return (
    <div className="max-w-md mx-1 my-5 p-4 bg-white shadow-lg rounded-lg border-green-600 border-4 ">
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
          {/* Replace with actual profile picture if available */}
          <p className="text-4xl text-gray-500">👤</p>
        </div>
        <h1 className="text-xl font-semibold mt-4 text-center">{name}</h1>
        <h2 className="text-lg text-gray-600">{username}</h2>
        <p className="text-md text-gray-500 mt-2">{phone}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
