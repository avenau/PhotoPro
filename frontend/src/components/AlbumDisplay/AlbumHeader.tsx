import React from 'react';
import { PencilSquare, XSquare } from "react-bootstrap-icons";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

interface AlbumHeaderProps {
    albumId: string;
    isOwner: boolean;
    token: string;
}

export default function AlbumHeader(props: AlbumHeaderProps) {


  let path = `/album/manage/${props.albumId}`
  let history = useHistory();
  return props.isOwner ? (
    <>
    <Link to={path}>
      <PencilSquare size="2rem" color="#343a40" />
    </Link>
    {'               '}
    <Link
      to='/'
      onClick={() => console.log("DELETING")}
      /*
      onClick={() => axios
        .delete(`/album`,
        {
          headers: {
            "Authorization": `Bearer ${props.token}`
          },
          data: {
            'albumId': props.albumId,
            'token': props.token,
          }
        })
        .then(() => history.push('/'))
        .catch()}
      */
    >
      <XSquare size="2rem" color="#b00b1e"/>
    </Link>
    </>
  )
  :
  (<></>);
}
