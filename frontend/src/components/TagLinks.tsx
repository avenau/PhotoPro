import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

interface TagProps {
  tagName: string;
  type: string;
}

export default function Tags(props: TagProps) {
  return (
    <div>
      <Link to={`/search/${props.type}?q=${props.tagName}`}>
        <Button className="mr-1 mt-1" variant="secondary">
          {props.tagName}
        </Button>
      </Link>
    </div>
  );
}
