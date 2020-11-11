import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import axios from "axios";
import ContentLoader from "../ContentLoader/ContentLoader";

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
          <p>Create an account today, and we'll curate photos just for you.</p>
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
