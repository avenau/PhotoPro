import React from 'react';
import { PencilSquare, XSquare } from "react-bootstrap-icons";
import { Link, useHistory } from "react-router-dom";
import './AlbumHeader.scss';
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
    <div className='album-header-container'>
      <Link to={path}>
        <PencilSquare size="2rem" color="#343a40" />
      </Link>
      {'               '}
        <div
          className='album-header-delete-button'
          onClick={() => axios
            .delete(`/album/delete`, {
              params: {
                token: props.token,
                albumId: props.albumId,
              }})
            .then(() => history.push('/'))
            .catch()}>
          <XSquare size="2rem" color="#b00b1e"/>
        </div>
      </div>
  )
  :
  (<></>);
}
