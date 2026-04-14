import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div style={nav}>
      <h2 style={{ margin: 0 }}>Ecommerce</h2>

      <div style={links}>
        <Link to="/" style={btn}>Home</Link>
        <Link to="/wishlist" style={btn}>Wishlist</Link>
        <Link to="/cart" style={btn}>Cart</Link>
        <Link to="/orders" style={btn}>Orders</Link>
        <Link to="/login" style={btn}>Login</Link>
        <Link to="/signup" style={signupBtn}>Signup</Link>
      </div>
    </div>
  );
}

const nav = {
  background: "#131921",
  color: "white",
  padding: "15px 20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap"
};

const links = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap"
};

const btn = {
  background: "#febd69",
  color: "#000",
  padding: "6px 12px",
  borderRadius: "5px",
  textDecoration: "none",
  fontSize: "14px"
};
const signupBtn = {
  background: "#ff9900",
  color: "#000",
  padding: "6px 12px",
  borderRadius: "5px",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "bold"
};

export default Navbar;