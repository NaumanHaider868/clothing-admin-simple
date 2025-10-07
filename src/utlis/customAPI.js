import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 600000
});


axiosInstance.interceptors.request.use(
  async (config) => {
    config.headers['Accept'] = `application/json`;
    config.headers["Authorization"] = 'Bearer ' + localStorage.getItem("token");

    return config;
  },
)

axiosInstance.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response?.status === 401) {
    window.location.href = '/';
    localStorage.removeItem("token");
  }
  return Promise.reject(error);
});

export const api = {

  get(url) {
    return axiosInstance.get(url)
  },
  post(url, data) {
    return axiosInstance.post(url, data)
  },
  put(url, data) {
    return axiosInstance.put(url, data)
  },

  delete(url, id) {
    return axiosInstance.delete(url, id)
  }
};