import React from "react";

interface PriceProps {
  price: number;
  discount: number;
}

export default function Price(props: PriceProps) {
  return <div className="ml-1">{props.price} CR</div>;
}
