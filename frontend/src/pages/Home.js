import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { toast } from "react-toastify";

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();


useEffect(() => {
  axios
    .get(`https://ecommerce-scalar-labs-1.onrender.com/products?search=${search}&category=${category}`)
    .then((res) => setProducts(res.data))
    .catch((err) => console.log(err));
}, [search, category]);


  const addToCart = (id) => {
  const userId = localStorage.getItem("userId") || 1;

  axios.post("https://ecommerce-scalar-labs-1.onrender.com/cart/add", {
    user_id: userId,
    product_id: id,
    quantity: 1,
  })
  .then(() => toast.success("Added to cart 🛒"))
  .catch(() => toast.error("Failed to add ❌"));
};

const addToWishlist = (id) => {
  const userId = localStorage.getItem("userId") || 1;

  axios.post("https://ecommerce-scalar-labs-1.onrender.com/wishlist", {
    user_id: userId,
    product_id: id,
  })
  .then(() => toast.success("Added to wishlist ❤️"))
  .catch(() => toast.error("Failed ❌"));
};

  return (
    <div style={container}>
      <h2 style={{ marginBottom: "20px" }}>Products</h2>

      <div style={searchBar}>
        <input
          placeholder="Search products..."
          onChange={(e) => setSearch(e.target.value)}
          style={input}
        />

        <select onChange={(e) => setCategory(e.target.value)} style={select}>
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
        </select>
      </div>

      <div style={grid}>
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            addToCart={addToCart}
            addToWishlist={addToWishlist}
          />
        ))}
      </div>
    </div>
  );
}

const container = {
  padding: "20px",
  background: "#f3f3f3",
  minHeight: "100vh"
};

const searchBar = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
  flexWrap: "wrap"
};

const input = {
  padding: "10px",
  flex: "1",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const select = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px,1fr))",
  gap: "20px"
};

export default Home;