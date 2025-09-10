import axios from "axios";

const API = axios.create({
  //baseURL: "http://localhost:4000/api",
  baseURL: "https://blinkit-clone-v2zq.onrender.com",
  withCredentials: true, // cookie share
});

export default API;
