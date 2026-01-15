import Axios, { AxiosError } from "axios";

interface ErrorResponse {
  message?: string;
}

export const catchAxiosError = (error: AxiosError<ErrorResponse>) => {
  if (Axios.isCancel(error)) {
    return new Error("request cancelled");
  }

  if (error.response) {
    return new Error(error.response.data?.message || "Something went wrong");
  }

  if (error.request) {
    return new Error("Something went wrong");
  }

  return error;
};

export const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

// create a new axios instance
const api = Axios.create({
  baseURL: baseUrl,
});

api.interceptors.request.use((config) => {
  config.headers["Authorization"] = `Bearer ${sessionStorage.getItem(
    "authToken"
  )}`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(catchAxiosError(error));
  }
);

export default api;
