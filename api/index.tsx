import axios from "axios";

const instance = axios.create({
  baseURL: "https://bank-app-be-eapi-btf5b.ondigitalocean.app",
});

export default instance;
