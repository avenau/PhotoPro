import React from "react";

interface Props {
  message: string;
}
export default function NoContent(props: Props) {
  return (
    <div style={{ marginBottom: "40px", marginTop: "12px" }}>
      <p>{props.message}</p>
    </div>
  );
}
