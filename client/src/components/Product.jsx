import React, { useState, useEffect } from "react";
import axios from "axios";
import "./product.css";
import { useNavigate } from "react-router-dom";

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
        const response = await axios.get("http://localhost:5000/product", config);
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
    const response = await axios.patch(`http://localhost:5000/user/add-cart/${productId}`, {},config);
    navigate('/cart');
  };

  // Function to handle buying product
  const handleBuyProduct = async (productId) => {
    try{
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const response = await axios.patch(`http://localhost:5000/user/order/${productId}`, {}, config);
      console.log(response.data.message);
      navigate('/orders');
    }catch(err){
      console.log(err);
    }
  };

  return (
    <div className="product-container">
      <h1>Products</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product._id} className="product-item">
            <img src={product.photo} alt={product.name} className="product-image" />
            <h3>{product.name}</h3>
            <p>Rs.{product.price}</p>
            <div className="button-container">
              <button onClick={() => handleAddToCart(product._id)}>Add to Cart</button>
              <button onClick={() => handleBuyProduct(product._id)}>Order</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
