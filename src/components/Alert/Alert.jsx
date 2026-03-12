import { useState } from "react";

import "./Alert.css";

export default function Alert({severity = "info", details}) {
  return (
    details ?
    <div className={`alert ${severity}`}>
      <span>{details}</span>
    </div> : null
  );
}
