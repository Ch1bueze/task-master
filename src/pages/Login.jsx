import { useNavigate } from "react-router-dom";
import "../css/login.css";
import { useState } from "react";

const Login = () => {
  const apiBase = "http://localhost:3000";
  let token = localStorage.getItem("token");

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true);
    try {
      let data;
      const response = await fetch(apiBase + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Login failed");
      }
      alert("Login successful!");
      console.log("Login successful");
      data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
      } else {
        throw Error("❌ Failed to authenticate...");
      }
      navigate("/dashboard");
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login-card">
        <h2>Log In</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </button>
          <div className="redirects">
            <a href="/register">Not registered? Sign up</a>
            <a href="">Forgot password?</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
