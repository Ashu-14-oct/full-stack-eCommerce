import React, { useEffect, useState } from 'react'
import axios from "axios"
import OrderedItem from './OrderedItem';
import { server } from '../keys/keys';

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

        const response = await axios.get(`${server}/user/order`, config);
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
