import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import qs from "qs";
import { Modal } from "react-bootstrap";

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

const renderToast = (contents: string) => {
  ReactDOM.render(
    <Modal
      show
      autoFocus
      onHide={() =>
        ReactDOM.unmountComponentAtNode(
          document.getElementById("toast") as Element
        )
      }
    >
      <Modal.Header closeButton>
        <Modal.Title>PhotoPro</Modal.Title>
      </Modal.Header>
      <Modal.Body>{contents}</Modal.Body>
    </Modal>,
    document.getElementById("toast")
  );
};

const errorHandler = (error: any) => {
  // great gist https://gist.github.com/saqueib/a495af17d7c0e2fd5c2316b0822ebac3

  // if has response show the error
  console.error(error);

  if (error.response && error.response.data && error.response.data.show_toast) {
    console.error(error.response);
    renderToast(error.response.data.message);
  }

  return Promise.reject({ ...error });
};

const responseHandler = (response: any) => response;

axios.interceptors.response.use(responseHandler, errorHandler);

export default renderToast;
