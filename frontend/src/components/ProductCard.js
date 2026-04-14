import { useNavigate } from "react-router-dom";

function ProductCard({ product, addToCart, addToWishlist }) {
  const navigate = useNavigate();

  return (
    <div style={card}>

      {/* ❤️ Wishlist (top right) */}
      <div style={{ textAlign: "right" }}>
        <button onClick={() => addToWishlist(product.id)} style={wishlistBtn}>
          ❤️
        </button>
      </div>

      {/* 🖼 Image (clickable → detail page) */}
      <img
        src={product.image}
        alt={product.name}
        onClick={() => navigate(`/product/${product.id}`)}
        style={image}
      />

      {/* 📦 Name */}
      <h4
        style={{ margin: "5px 0", cursor: "pointer" }}
        onClick={() => navigate(`/product/${product.id}`)}
      >
        {product.name}
      </h4>

      {/* 💰 Price */}
      <p style={price}>₹{product.price}</p>

      {/* 🟢 Stock */}
      <p style={{ color: product.stock > 0 ? "green" : "red" }}>
        {product.stock > 0 ? "In Stock" : "Out of Stock"}
      </p>

      {/* 🛒 Add to cart */}
      <button
        onClick={() => addToCart(product.id)}
        style={cartBtn}
      >
        Add to Cart
      </button>

      {/* 🔍 View Details */}
      <button
        onClick={() => navigate(`/product/${product.id}`)}
        style={detailBtn}
      >
        View Details
      </button>

<button
  onClick={() => navigate("/checkout", { state: { product } })}
  style={{
    padding: "8px",
    background: "#ffa41c",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  width: "100%",
  marginTop: "5px"
  }}
>
  Buy Now
</button>
    </div>
  );
}

const card = {
  border: "1px solid #ddd",
  padding: "15px",
  borderRadius: "8px",
  background: "#fff",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
};

const image = {
  width: "100%",
  height: "150px",
  objectFit: "cover",
  marginBottom: "10px",
  cursor: "pointer"
};

const price = {
  fontWeight: "bold",
  margin: "5px 0"
};

const cartBtn = {
  background: "#ffd814",
  border: "1px solid #fcd200",
  padding: "8px",
  width: "100%",
  cursor: "pointer",
  borderRadius: "5px",
  marginTop: "5px"
};

const detailBtn = {
  background: "#eee",
  border: "1px solid #ccc",
  padding: "8px",
  width: "100%",
  cursor: "pointer",
  borderRadius: "5px",
  marginTop: "5px"
};

const wishlistBtn = {
  background: "white",
  border: "none",
  cursor: "pointer",
  fontSize: "18px"
};

export default ProductCard;