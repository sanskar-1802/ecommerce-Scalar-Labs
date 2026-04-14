import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    axios.get(`https://ecommerce-scalar-labs-1.onrender.com/products/${id}`)
      .then(res => {
        setProduct(res.data); // ✅ use backend images
      })
      .catch(err => console.log(err));
  }, [id]);

  const userId = localStorage.getItem("userId") || 1;

  const addToCart = () => {
    axios.post("https://ecommerce-scalar-labs-1.onrender.com/cart/add", {
      user_id: userId,
      product_id: product.id,
      quantity: 1
    });
    alert("Added to cart");
  };

  if (!product) {
    return <h2 style={{ padding: "20px" }}>Loading...</h2>;
  }

  // ✅ SAFE IMAGE HANDLING
  const images = product.images?.length
    ? product.images
    : [product.image];

  return (
    <div style={{
      padding: "20px",
      background: "#f3f3f3",
      minHeight: "100vh"
    }}>
      <div style={{
        display: "flex",
        gap: "40px",
        background: "#fff",
        padding: "20px",
        borderRadius: "8px"
      }}>

        {/* 🖼 IMAGE CAROUSEL */}
        <div>
          <img
            src={images[currentImg]}
            alt={product.name}
            style={{
              width: "300px",
              height: "300px",
              objectFit: "cover"
            }}
          />

          <div style={{ display: "flex", marginTop: "10px" }}>
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt=""
                onClick={() => setCurrentImg(index)}
                style={{
                  width: "60px",
                  height: "60px",
                  marginRight: "5px",
                  cursor: "pointer",
                  border: currentImg === index
                    ? "2px solid orange"
                    : "1px solid #ccc"
                }}
              />
            ))}
          </div>
        </div>

        {/* 📦 DETAILS */}
        <div>
          <h2>{product.name}</h2>

          <p>{product.description || "No description available"}</p>

          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Stock:</strong> {product.stock}</p>

          <h2>₹{product.price}</h2>

          <p style={{ color: product.stock > 0 ? "green" : "red" }}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>

          <div style={{ marginTop: "20px" }}>
            <button onClick={addToCart} style={cartBtn}>
              Add to Cart
            </button>

            <button
              onClick={() => navigate("/checkout", { state: { product } })}
              style={buyBtn}
            >
              Buy Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

const cartBtn = {
  padding: "10px 20px",
  background: "#ffd814",
  border: "none",
  marginRight: "10px",
  cursor: "pointer",
  borderRadius: "5px"
};

const buyBtn = {
  padding: "10px 20px",
  background: "#ffa41c",
  border: "none",
  cursor: "pointer",
  borderRadius: "5px"
};

export default ProductDetail;