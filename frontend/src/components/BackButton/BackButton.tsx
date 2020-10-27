import React from "react";
import Button from "react-bootstrap/Button";
import { ArrowLeft } from "react-bootstrap-icons";

interface BackButtonProps {
  href: string;
  label: string;
}

export default function BackButton(props: any) {
  return (
    <Button className="ml-3" href={props.href}>
      <ArrowLeft />
      {" " + props.label}
    </Button>
  );
}
