import axios from "axios";
import { Authorization } from "./pages/authorization";
import Login from "./pages/login";
import Signup from "./pages/signup";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddTaskRappel from "./pages/AddTaskRappel";
import UpdateTask from "./pages/UpdateTask";
import UserPage from "./pages/UserPage";
import Category from "./pages/Category";

function App() {
  axios.defaults.baseURL = "http://localhost:4001/";
  axios.defaults.withCredentials = true;
  return (
    <>
      <Router>
        <div className="h-screen col-span-1 sm:h-screen">
          <div className="content">
            <Routes>
              <Route path="/" element={<Signup />} />
              {/* <Route path="/" element={<Category />} /> */}

              <Route path="/auth" element={<Authorization />} />
              <Route path="/login/" element={<Login />} />
              <Route path="/add" element={<AddTaskRappel />} />
              <Route path="/update/:id/:taskId" element={<UpdateTask />} />
              <Route path="/userPage/:id/" element={<UserPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
