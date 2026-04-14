import { useEffect, useState } from "react";
import axios from "axios";

function Wishlist() {
  const [items, setItems] = useState([]);
  const userId = localStorage.getItem("userId") || 1;

  const fetchWishlist = () => {
    axios.get(`https://ecommerce-scalar-labs-1.onrender.com/wishlist/${userId}`)
      .then(res => setItems(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeItem = (id) => {
    axios.delete(`https://ecommerce-scalar-labs-1.onrender.com/wishlist/${id}`)
      .then(fetchWishlist);
  };

  const addToCart = (productId) => {
    axios.post("https://ecommerce-scalar-labs-1.onrender.com/cart/add", {
      user_id: userId,
      product_id: productId,
      quantity: 1
    });

    alert("Added to cart");
  };

  return (
    <div style={{
      padding: "20px",
      background: "#f3f3f3",
      minHeight: "100vh"
    }}>
      <h2>My Wishlist ❤️</h2>

      {items.length === 0 ? (
        <p>No items in wishlist</p>
      ) : (
        items.map(item => (
          <div key={item.id} style={card}>
            <img src={item.image} alt="" style={img} />

            <div>
              <h4>{item.name}</h4>
              <p>₹{item.price}</p>

              <button onClick={() => addToCart(item.product_id)} style={btn}>
                Add to Cart
              </button>

              <button onClick={() => removeItem(item.id)} style={removeBtn}>
                Remove
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const card = {
  display: "flex",
  gap: "20px",
  background: "#fff",
  padding: "15px",
  marginBottom: "10px",
  borderRadius: "8px",
  alignItems: "center"
};

const img = {
  width: "100px",
  height: "100px",
  objectFit: "cover"
};

const btn = {
  background: "#ffd814",
  padding: "8px",
  border: "none",
  cursor: "pointer",
  marginRight: "10px"
};

const removeBtn = {
  background: "#eee",
  padding: "8px",
  border: "1px solid #ccc",
  cursor: "pointer"
};

export default Wishlist;