import React from "react";
import Image from "react-bootstrap/Image";
import axios from "axios";
import ShowdownLike from "./ShowdownLike";

class Showdown extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      imagePaths: [],
    };
  }

  componentDidMount() {
    this.getShowdownData();
  }

  getShowdownData() {
    axios
      .get("/showdown", { params: { token: localStorage.getItem("token") } })
      .then((res) => {
        const imagePaths = res.data;
        this.setState({ imagePaths });
      });
  }

  render() {
    return (
      <>
        <div style={{ padding: "0% 5%" }}>
          <h3>Yesterday&apos;s Showdown Winner</h3>

          <div style={{ display: "flex", justifyContent: "left" }}>Content</div>
        </div>
        <div style={{ padding: "0% 5%" }}>
          <h3>Photo Showdown</h3>

          <div style={{ display: "flex", justifyContent: "left" }}>Content</div>
        </div>
      </>
    );
    // OLD
    // return (
    //   <Container className="p-3">
    //     <Row>
    //       <h3 style={{ textAlign: "center" }}>Today&apos;s PHOTO SHOWDOWN</h3>
    //     </Row>
    //     <Container className="p-2">
    //       <Row>
    //         <Col>
    //           <Image src={this.state.imagePaths.path_one} fluid />
    //         </Col>
    //         <Col xs={2}>
    //           {" "}
    //           <h3> VS </h3>{" "}
    //         </Col>
    //         <Col>
    //           <Image src={this.state.imagePaths.path_two} fluid />
    //         </Col>
    //       </Row>
    //       <Row>
    //         <Col>
    //           <Button variant="success">Apple</Button>
    //           {/* <ShowdownLike partId="5fa92d58367cb28505115b06" sdId="5fa92d58367cb28505115b08" isLiked={false} likeCount={0} /> */}
    //         </Col>
    //         <Col xs={2} />
    //         <Col>
    //           <Button variant="success">Banana</Button>
    //         </Col>
    //       </Row>
    //     </Container>
    //   </Container>
    // );
  }
}

export default Showdown;
