import React from "react";

interface PriceProps {
  fullPrice: number;
  discount: number;
}

function calDiscount(discount: number, fullPrice: number) {
  return Math.floor((1 - discount / 100) * fullPrice);
}

export default function Price(props: PriceProps) {
  return props.discount ? (
    <div className="ml-1">
      <s>{props.fullPrice}</s> {calDiscount(props.discount, props.fullPrice)} CR
    </div>
  ) : (
    <div className="ml-1">{props.fullPrice} CR</div>
  );
}
