import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const signup = () => {
  axios.post("https://ecommerce-scalar-labs-1.onrender.com/signup", {
    name,
    email,
    password
  })
  .then(() => {
    // 🔥 auto login after signup
    return axios.post("https://ecommerce-scalar-labs-1.onrender.com/login", {
      email,
      password
    });
  })
  .then(res => {
    localStorage.setItem("userId", res.data.userId);
    localStorage.setItem("email", email);
    alert("Signup successful");
    navigate("/"); // 🔥 go to home directly
  })
  .catch(() => alert("Signup failed"));
};

  return (
    <div style={container}>
      <h2>Create Account</h2>

      <input style={input} placeholder="Name" onChange={e => setName(e.target.value)} />
      <input style={input} placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input style={input} type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />

      <button style={button} onClick={signup}>Signup</button>
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

export default Signup;