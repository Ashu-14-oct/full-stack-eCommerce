// Item.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js';
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
      const order = await axios.patch(`http://18.209.121.58:5000/user/order/${productId}`, {}, config);
      const response = await axios.post(`http://18.209.121.58:5000/create-checkout-session/${itemId}`, {}, config);
      
      // Load Stripe
      const stripe = await loadStripe('pk_test_51OgreHSGw3aWlDdWT6yzdf48TfPXXRsIvnlxCgJJoBufeIy09akWRxAkPeyHX4d7SHxabr65TqPck7MmEi22LwOZ00chx759sS');

      

      if(order.data.user){
        const removeFromCart = await axios.patch(`http://18.209.121.58:5000/user/remove-cart/${productId}`, {}, config);
        navigate('/orders');
        console.log(removeFromCart.data.message);
      }

      // Redirect the user to the Stripe Checkout page
      stripe.redirectToCheckout({ sessionId: response.data.sessionId });
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
      const response = await axios.patch(`http://18.209.121.58:5000/user/remove-cart/${productId}`, {}, config);
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
          `http://18.209.121.58:5000/product-id/${itemId}`
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