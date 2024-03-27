import axios from "axios";
import React, { useEffect, useState } from "react";
import Item from "./Item";
import "./product.css"


export default function Cart() {
  const [item, setItem] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        "http:/18.209.121.58:5000/user/cart",
        config
      );
      setItem(response.data.cartItems);
    }

    fetchData();
  }, []);
  return (
    <div className="product-container">
    <h1>Shopping Cart</h1>
    {item.map((itemId) => (
      <Item key={itemId} itemId={itemId} />
    ))}
  </div>
  );
}
