"use client";
import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
export default function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get("/api/orders").then((response) => {
     setOrders(response.data);
    });
  }, []);
  return (
    <Layout>
      <h1>Orders</h1>
      <table className="products">
        <thead>
          <tr>
            <th>Date</th>
            <th>Paid</th>
            <th>Recipient</th>
            <th>Product</th>
          </tr>
        </thead> 
        <tbody>
        {orders.length>0 && orders.map((order) => ( 
          <tr key={order._id}>
            <td>{(new Date(order.createdAt)).toLocaleString()} {orders.length}</td>
            <td className={order.paid?'text-green-500':'text-red-500'}>{order.paid ? "Yes" : "No"}</td>
            <td>{order.name} ({order.email})<br/>
            {order.city} {order.postalCode}<br/> 
            {order.country} {order.streetAddress}

            </td>
            <td>{order.items.map((item) => (
              <div key={item.productId}>{item.title} x {item.quantity}</div>
            ))}</td>  
          </tr>
        ))};
        </tbody>
      </table>
    </Layout>
  );
}