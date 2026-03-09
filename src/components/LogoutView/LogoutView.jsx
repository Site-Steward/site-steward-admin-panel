import { useState } from "react";

import "./LogoutView.css";

export default function LogoutView({ onConfirmed }) {
  // const [value, setValue] = useState("");

  return (
    <>
      <h2>Logout?</h2>
      <button onClick={onConfirmed}>Confirmed</button>
    </>
  );
}
