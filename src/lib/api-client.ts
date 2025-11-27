import { API_URL } from "@/config";
import Axios from "axios";

export const api = Axios.create({
  baseURL: API_URL,
});
