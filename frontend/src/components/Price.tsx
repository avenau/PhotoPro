import React from "react";
import { Button } from "react-bootstrap";

interface PriceProps {
  price: number;
  discount: number;
}

export default function Price(props: PriceProps) {
  return <div>Price: {props.price} CR</div>;
}
