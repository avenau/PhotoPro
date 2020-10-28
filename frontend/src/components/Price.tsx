import React from "react";
import { Button } from "react-bootstrap";

interface PriceProps {
    price: number;
    discount: number;
}

export default function Price(props: PriceProps) {
    return <Button className="ml-1">{props.price} CR</Button>
}