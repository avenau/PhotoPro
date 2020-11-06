import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import axios from "axios";
import ContentLoader from "../ContentLoader/ContentLoader";

export default function CuratedFeed() {
    const token = localStorage.getItem("token");
    const [route, setRoute] = useState("/welcome/recommend")
    const [query, setQuery] = useState([])
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        axios.get("/welcome/recommend/compute", {params: {
            token: token
        }})
        .then((res) => {
            console.log(res)
            setQuery(res.data)
            setLoading(false)
        }
        )
        .catch(() => {
        })
    }, []
    )

    return(
        <>
        <Container>
          {loading ?
            <p>Loading photos...</p>
            :
            <ContentLoader
              query={query}
              route={route}
              type="photo"
            />
          }
        </Container>
        </>
    )
}