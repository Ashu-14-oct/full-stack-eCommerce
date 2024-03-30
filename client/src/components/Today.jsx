import axios from "axios";
import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import "./today.css";
import { server } from "../keys/keys";

export default function Today() {
  const [product, setProduct] = useState([]);
  const navigate = useNavigate();

  //handle cart button
  const handleAddToCart = async (productId) => {
    console.log(`Product ${productId} added to cart`);

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios.patch(
      `${server}/user/add-cart/${productId}`,
      {},
      config
    );
    navigate("/cart");
  };

  // handlebuy button
  const handleBuyProduct = async (productId) => {
    try {
      console.log(productId);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const order = await axios.patch(
        `${server}/user/order/${productId}`,
        {},
        config
      );
      const response = await axios.post(
        `${server}/create-checkout-session/${productId}`,
        {},
        config
      );

      // Load Stripe
      const stripe = await loadStripe(
        "pk_test_51OgreHSGw3aWlDdWT6yzdf48TfPXXRsIvnlxCgJJoBufeIy09akWRxAkPeyHX4d7SHxabr65TqPck7MmEi22LwOZ00chx759sS"
      );

      if (order.data.user) {
        const removeFromCart = await axios.patch(
          `${server}/user/remove-cart/${productId}`,
          {},
          config
        );
        navigate("/orders");
        console.log(removeFromCart.data.message);
      }

      // Redirect the user to the Stripe Checkout page
      stripe.redirectToCheckout({ sessionId: response.data.sessionId });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${server}/product/todaydeal`
        );
        setProduct(response.data.products);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="today-container">
      <h4 className="display-4">Today's deal</h4> 
        {product.map((product) => (
          <div className="smaller-product" key={product._id}>
            <img src={product.photo} alt={product.name} />
            <h4>{product.name}</h4>
            <p>Rs.{product.price}</p>
            <button onClick={() => handleAddToCart(product._id)}>
              Add to Cart
            </button>
            <button onClick={() => handleBuyProduct(product._id)}>Order</button>
          </div>
        ))}
    </div>
  );
}
