import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
  //baseURL: "https://blinkit-clone-ecommerce.onrender.com/api",
  withCredentials: true, // cookie share
});

export default API;
