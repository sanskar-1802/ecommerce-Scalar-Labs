import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [items, setItems] = useState([]);
  const userId = localStorage.getItem("userId") || 1;
  const navigate = useNavigate();

  const fetchCart = () => {
    axios.get(`https://ecommerce-scalar-labs-1.onrender.com/cart/${userId}`)
      .then(res => setItems(res.data));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQty = (id, quantity) => {
    axios.put("https://ecommerce-scalar-labs-1.onrender.com/cart/update", {
      id,
      quantity,
    }).then(fetchCart);
  };

  const removeItem = (id) => {
    axios.delete(`https://ecommerce-scalar-labs-1.onrender.com/cart/remove/${id}`)
      .then(fetchCart);
  };

  const total = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  return (
    <div style={container}>
      <h2>My Cart 🛒</h2>

      {items.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        items.map((item) => (
          <div key={item.id} style={card}>
            
            <img src={item.image} style={img} />

            <div style={{ flex: 1 }}>
              <h4>{item.name}</h4>
              <p>₹{item.price}</p>

              <input
                type="number"
                value={item.quantity}
                min="1"
                style={qty}
                onChange={(e) =>
                  updateQty(item.id, Number(e.target.value))
                }
              />

              <button onClick={() => removeItem(item.id)} style={removeBtn}>
                Remove
              </button>
            </div>

          </div>
        ))
      )}

      <h3>Total: ₹{total}</h3>

      {items.length > 0 && (
        <button onClick={() => navigate("/checkout")} style={buyBtn}>
          Buy Now
        </button>
      )}
    </div>
  );
}

const container = {
  padding: "20px",
  background: "#f3f3f3",
  minHeight: "100vh"
};

const card = {
  display: "flex",
  gap: "15px",
  background: "#fff",
  padding: "15px",
  marginBottom: "10px",
  borderRadius: "8px",
  alignItems: "center"
};

const img = {
  width: "90px",
  height: "90px",
  objectFit: "cover"
};

const qty = {
  padding: "5px",
  marginTop: "5px",
  width: "60px"
};

const removeBtn = {
  marginTop: "8px",
  background: "#ff4d4d",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  cursor: "pointer",
  borderRadius: "5px"
};

const buyBtn = {
  marginTop: "20px",
  background: "#ffa41c",
  padding: "12px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

export default Cart;