import React, { useEffect, useState } from 'react'
import axios from "axios"
import OrderedItem from './OrderedItem';

export default function Order() {
  const [orders, setOrders] = useState([]);
  useEffect(()=> {
    async function getOrders(){
      try{
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }

        const response = await axios.get("http:/18.209.121.58:5000/user/order", config);
        setOrders(response.data.orderItems);
      }catch(err){
        console.log(err);
      }
    }

    getOrders();
  }, []);


  return (
    <div className='product-container'>
      {orders.map((productId) => {
        return <OrderedItem key={Math.random()} productId={productId}/>
      })}
    </div>
  )
}
