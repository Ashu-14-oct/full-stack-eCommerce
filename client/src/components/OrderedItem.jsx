import axios from 'axios';
import React, { useEffect, useState } from 'react'


export default function OrderedItem({productId}) {
    const [product, setProduct] = useState(null);

    const cancelOrder = async () => {
      try{
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        const response = await axios.patch(`http:/18.209.121.58:5000/user/order-delete/${productId}`,{},config);
        console.log(response.data.message);
        if(response.data.message){
          window.location.reload();
        }
      }catch(err){
        console.log(err);
      }
    }
    useEffect(() => {
        async function fetchOrders(){
            try{
                const token = localStorage.getItem("token");
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

                const response = await axios.get(`http:/18.209.121.58:5000/product-id/${productId}`, config);
                setProduct(response.data.product);
            }catch(err){
                console.log(err);
            }
        }
        fetchOrders();
    }, [productId]);
    return (
        <div className="container">
          <div className="item-container">
            {product ? (
              <div className="container">
                <img
                  src={product.photo}
                  alt={product.name}
                  className="item-image"
                />
                <h2 className="item-title">{product.name}</h2>
                <p className="item-description">{product.description}</p>
                <p className="item-price">Price: Rs.{product.price}</p>
                <div className="button-container">
                  <button onClick={() => {cancelOrder()}} style={{backgroundColor: "red"}}>Cancel your order</button>
                </div>
              </div>
            ) : (
              <p>Your cart is empty</p>
            )}
          </div>
        </div>
      );
}
