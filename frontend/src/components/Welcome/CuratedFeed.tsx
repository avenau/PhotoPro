import React from "react";
import { Container } from "react-bootstrap";
import ContentLoader from "../ContentLoader/ContentLoader";
import NoContent from "../ContentLoader/NoContent";

interface Props {
  refreshCredits: () => void;
}

export default function CuratedFeed(props: Props) {
  const token = localStorage.getItem("token");

  return (
    <>
      <Container>
        <h3>Recommended for you</h3>
        {token === null ? (
          <NoContent message="Create an account today, and we'll curate photos just for you." />
        ) : (
          <ContentLoader
            query=""
            route="/welcome/recommend"
            type="photo"
            curatedFeed
            refreshCredits={props.refreshCredits}
          />
        )}
      </Container>
    </>
  );
}
