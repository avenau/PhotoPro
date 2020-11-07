import React from 'react';
import { PencilSquare } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

interface AlbumHeaderProps {
    albumId: string;
    isOwner: boolean;
}

export default function AlbumHeader(props: AlbumHeaderProps) {

  let path = `/album/manage/${props.albumId}`
  return props.isOwner ? (
    <Link to={path}>
      <PencilSquare size="2rem" color="#343a40" />
    </Link>
  )
  :
  (<></>);
}
