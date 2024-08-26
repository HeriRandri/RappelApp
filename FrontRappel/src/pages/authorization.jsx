import axios from "axios";
import { useEffect, useState } from "react";

export const Authorization = () => {
  const [auth, setAuth] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    const res = axios.get("http://localhost:4001/auth");

    setAuth(token);
    console.log(res.data.user);
  }, [auth]);
  return <div>{auth}</div>;
};
