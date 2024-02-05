// Item.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./item.css";

export default function Item({ itemId }) {
  const [itemData, setItemData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/product-id/${itemId}`
        );
        setItemData(response.data.product);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [itemId]);

  return (
    <div className="container">
      <div className="item-container">
        {itemData ? (
          <div className="container">
            <img
              src={itemData.photo}
              alt={itemData.name}
              className="item-image"
            />
            <h2 className="item-title">{itemData.name}</h2>
            <p className="item-description">{itemData.description}</p>
            <p className="item-price">Price: Rs.{itemData.price}</p>
          </div>
        ) : (
          <p>Loading item data...</p>
        )}
      </div>
    </div>
  );
}