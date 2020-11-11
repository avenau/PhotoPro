import axios from "axios";
import qs from "qs";

axios.defaults.baseURL = `http://localhost:${(window as any).BACKEND_PORT}/`;
axios.defaults.headers.put["Content-Type"] =
  "application/x-www-form-urlencoded";
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";
axios.defaults.headers.delete["Content-Type"] =
  "application/x-www-form-urlencoded";

axios.interceptors.request.use((request) => {
  if (
    request.method === "put" ||
    request.method === "post" ||
    request.method === "delete"
  ) {
    request.data = qs.stringify(request.data);
  }
  return request;
});

const errorHandler = (error: any) => {
  // great gist https://gist.github.com/saqueib/a495af17d7c0e2fd5c2316b0822ebac3

  // if has response show the error
  console.error(error);

  // TODO toastify back here

  if (error.response) {
    alert(error.response.data.message);
  }

  return Promise.reject({ ...error });
};

const responseHandler = (response: any) => response;

axios.interceptors.response.use(responseHandler, errorHandler);
