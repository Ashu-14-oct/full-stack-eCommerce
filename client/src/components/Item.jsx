// Item.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import "./item.css";

export default function Item({ itemId }) {
  const [itemData, setItemData] = useState(null);
  const navigate = useNavigate();
  
  // handle buy button
  const handleBuy = async (productId) => {
    try{
      console.log(productId);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const response = await axios.patch(`http://localhost:5000/user/order/${productId}`, {}, config);
      if(response.data.user){
        const removeFromCart = await axios.patch(`http://localhost:5000/user/remove-cart/${productId}`, {}, config);
        navigate('/orders');
        console.log(removeFromCart.data.message);
      }
    }catch(err){
      console.log(err);
    }
  }

  // handle remove button
  const handleRemove = async (productId) => {
    try{ 
      console.log(productId);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const response = await axios.patch(`http://localhost:5000/user/remove-cart/${productId}`, {}, config);
      console.log(response.data.message);
      window.location.reload();
    }catch(err){
      console.log(err);
    }
  }
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
            <div className="button-container">
              <button onClick={() => {handleBuy(itemId)}} >Order</button>
              <button onClick={() => {handleRemove(itemId)}} style={{backgroundColor: "red"}}>Remove</button>
            </div>
          </div>
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>
    </div>
  );
}