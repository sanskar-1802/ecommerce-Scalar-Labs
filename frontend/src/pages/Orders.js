import { useEffect, useState } from "react";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem("userId") || 1;

  useEffect(() => {
    axios.get(`https://ecommerce-scalar-labs-1.onrender.com/orders/${userId}`)
      .then(res => setOrders(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map(order => (
          <div key={order.id} style={card}>
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Total:</strong> ₹{order.total}</p>
            <p><strong>Address:</strong> {order.address}</p>
          </div>
        ))
      )}
    </div>
  );
}

const card = {
  border: "1px solid #ddd",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "5px"
};

export default Orders;