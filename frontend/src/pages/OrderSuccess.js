import { useLocation, useNavigate } from "react-router-dom";

function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>🎉 Order Placed Successfully!</h2>

      <p>Your Order ID:</p>
      <h3>{state?.orderId}</h3>

      <button onClick={() => navigate("/")} style={btn}>
        Go to Home
      </button>
    </div>
  );
}

const btn = {
  padding: "10px",
  background: "#ffd814",
  border: "none",
  cursor: "pointer",
  borderRadius: "5px"
};

export default OrderSuccess;