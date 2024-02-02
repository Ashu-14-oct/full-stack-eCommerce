import React, { useState } from "react";
import Login from "../components/Login";
import Product from "../components/Product";

export default function Home() {
  const [logged, isLogged] = useState(false);
  return (
    <div>
       {logged? (<Product/>): (
        <Login/>
       )}
    </div>
  );
}
