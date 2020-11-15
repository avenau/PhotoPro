import React from "react";

interface PriceProps {
  fullPrice: number;
  discount: number;
  className?: string;
}

function calDiscount(discount: number, fullPrice: number) {
  return Math.round((1 - discount / 100) * fullPrice);
}

Price.defaultProps = {
  className: "",
};

export default function Price(props: PriceProps) {
  const { className } = props;
  return props.discount ? (
    <div className={`ml-1 ${className}`}>
      <s>{props.fullPrice}</s> {calDiscount(props.discount, props.fullPrice)}{" "}
      Credits
    </div>
  ) : (
    <div className={`ml-1 ${className}`}>{props.fullPrice} Credits</div>
  );
}
