import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import axios from "axios";
import ContentLoader from "../ContentLoader/ContentLoader";

export default function CuratedFeed() {
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        if (token !== null) {
            console.log(token)
            // Compute metrics for recommendation algorithm
            axios.get("/welcome/recommend/compute", {params: {
                token: token
            }})
            .then((res) => {
                // Load photos based on computed metrics
                setLoading(false)
            }
            )
            .catch(() => {
            })
        }
    }, []
    )

    return(
        <>
        <Container>
          {loading ?
            <></>
            :
            <>
            <h1>Your Feed</h1>
            <ContentLoader
              query=""
              route="/welcome/recommend"
              type="photo"
            />
            </>
          }
        </Container>
        </>
    )
}