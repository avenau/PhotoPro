import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import qs from "qs";
import { Toast } from "react-bootstrap";

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

  if (error.response && error.response.data && error.response.data.show_toast) {
    console.error(error.response);
    ReactDOM.render(
      <Toast
        style={{
          fontSize: "1.2rem",
        }}
        delay={3000}
        autohide
        onClose={() => {
          ReactDOM.unmountComponentAtNode(
            document.getElementById("toast") as Element
          );
        }}
      >
        <Toast.Header closeButton>
          {/* <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" /> */}
          <strong className="mr-auto">PhotoPro</strong>
        </Toast.Header>
        <Toast.Body>{error.response.data.message}</Toast.Body>
      </Toast>,
      document.getElementById("toast")
    );
  }

  return Promise.reject({ ...error });
};

const responseHandler = (response: any) => response;

axios.interceptors.response.use(responseHandler, errorHandler);
