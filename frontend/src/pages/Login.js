import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = () => {
    axios.post("https://ecommerce-scalar-labs-1.onrender.com/login", { email, password })
      .then(res => {
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("email", email);
        alert("Login successful");
        navigate("/"); // 🔥 redirect to home
      })
      .catch(() => alert("Login failed"));
  };

  return (
    <div style={container}>
      <h2>Login</h2>

      <input style={input} placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input style={input} type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />

      <button style={button} onClick={login}>Login</button>
    </div>
  );
}

const container = {
  display: "flex",
  flexDirection: "column",
  width: "300px",
  margin: "80px auto",
  gap: "10px"
};

const input = {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px"
};

const button = {
  background: "#ffd814",
  padding: "10px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

export default Login;