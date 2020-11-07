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
                // If there are sufficient results
                console.log(res)
                if (res.data.success === true) {
                    setLoading(false)
                }
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
            <h1>Recommended for you</h1>
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