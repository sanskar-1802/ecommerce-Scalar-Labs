import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Checkout() {
  const [address, setAddress] = useState("");
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
const directProduct = location.state?.product;

  const userId = localStorage.getItem("userId") || 1;

 useEffect(() => {
  if (directProduct) {
    // ✅ BUY NOW FLOW
    setItems([{ ...directProduct, quantity: 1 }]);
  } else {
    // ✅ CART FLOW
    axios.get(`http://localhost:5000/cart/${userId}`)
      .then(res => setItems(res.data))
      .catch(err => console.log(err));
  }
}, [directProduct, userId]);

  const total = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const placeOrder = () => {
    if (!address) {
      alert("Please enter address");
      return;
    }

    axios.post("http://localhost:5000/order", {
      user_id: userId,
      total,
      address,
      email:"sanskarpersonalgrowth@gmail.com"
    })
    .then(res => {
      // 🔥 redirect to success page
      navigate("/success", { state: { orderId: res.data.orderId } });
    })
    .catch(() => alert("Order failed"));
  };

  return (
    <div style={{
      padding: "20px",
      background: "#f3f3f3",
      minHeight: "100vh"
    }}>
      <h2>Checkout</h2>

      {/* 📦 Order Summary */}
      <div style={card}>
        <h3>Order Summary</h3>

        {items.map(item => (
          <div key={item.id} style={itemRow}>
            <p>{item.name}</p>
            <p>₹{item.price} × {item.quantity}</p>
          </div>
        ))}

        <h3>Total: ₹{total}</h3>
      </div>

      {/* 📍 Address */}
      <div style={card}>
        <h3>Shipping Address</h3>

        <input
          placeholder="Enter full address"
          onChange={(e) => setAddress(e.target.value)}
          style={input}
        />
      </div>

      {/* 🛒 Button */}
      <button style={button} onClick={placeOrder}>
        Place Order
      </button>
    </div>
  );
}

const card = {
  background: "#fff",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "8px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
};

const itemRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "5px"
};

const input = {
  padding: "10px",
  width: "100%",
  borderRadius: "5px",
  border: "1px solid #ccc"
};

const button = {
  background: "#ffd814",
  padding: "12px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  width: "200px"
};

export default Checkout;