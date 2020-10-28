import React from "react";
import Button from "react-bootstrap/Button";
import Axios from "axios";

class DownloadExample extends React.Component {
  onClick() {
    Axios.get("/download").then((r) => {
      const link = document.createElement("a");
      link.href = `data:image/jpg;base64,${r.data}`;
      link.setAttribute("download", "example.jpg");
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  }

  render() {
    return (
      <div className="HomePage">
        <Button
          onClick={() => {
            this.onClick();
          }}
        >
          Not a virus
        </Button>
      </div>
    );
  }
}

export default DownloadExample;
