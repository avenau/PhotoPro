import React from "react";

interface PriceProps {
  fullPrice: number;
  discount: number;
}

function calDiscount(discount: number, fullPrice: number) {
  return Math.round((1 - discount / 100) * fullPrice);
}

export default function Price(props: PriceProps) {
  return props.discount ? (
    <div className="ml-1">
      <s>{props.fullPrice}</s> {calDiscount(props.discount, props.fullPrice)}{" "}
      Credits
    </div>
  ) : (
    <div className="ml-1">{props.fullPrice} Credits</div>
  );
}
