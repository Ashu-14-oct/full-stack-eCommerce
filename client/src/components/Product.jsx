import React, { useState, useEffect } from "react";
import axios from "axios";
import "./product.css";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import Today from "./Today";

export default function Product() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(
          "http:/18.209.121.58:5000/product",
          config
        );
        setProducts(response.data.allProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Function to handle adding product to cart
  const handleAddToCart = async (productId) => {
    console.log(`Product ${productId} added to cart`);

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios.patch(
      `http:/18.209.121.58:5000/user/add-cart/${productId}`,
      {},
      config
    );
    navigate("/cart");
  };

  // Function to handle buying product
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
        `http:/18.209.121.58:5000/user/order/${productId}`,
        {},
        config
      );
      const response = await axios.post(
        `http:/18.209.121.58:5000/create-checkout-session/${productId}`,
        {},
        config
      );

      // Load Stripe
      const stripe = await loadStripe(
        "pk_test_51OgreHSGw3aWlDdWT6yzdf48TfPXXRsIvnlxCgJJoBufeIy09akWRxAkPeyHX4d7SHxabr65TqPck7MmEi22LwOZ00chx759sS"
      );

      if (order.data.user) {
        const removeFromCart = await axios.patch(
          `http:/18.209.121.58:5000/user/remove-cart/${productId}`,
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

  return (
    <>
    
      <div className="product-container">
      <Today />
        <h1>Products</h1>
        <div className="product-grid">
          {products.map((product) => (
            <div key={product._id} className="product-item">
              <img
                src={product.photo}
                alt={product.name}
                className="product-image"
              />
              <h3>{product.name}</h3>
              <p>Rs.{product.price}</p>
              <div className="button-container">
                <button onClick={() => handleAddToCart(product._id)}>
                  Add to Cart
                </button>
                <button onClick={() => handleBuyProduct(product._id)}>
                  Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
