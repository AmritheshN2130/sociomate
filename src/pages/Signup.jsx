import { useState } from 'react';
import axios from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';


export default function Signup() {
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const navigate = useNavigate();



const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com)$/i;
    const usernameRegex = /^[A-Za-z]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/;

    if (!emailRegex.test(form.email)) {
      alert("Invalid email. Use format: example@domain.com");
      return false;
    }
    if (!usernameRegex.test(form.username)) {
      alert("Username should contain letters only.");
      return false;
    }
    if (!passwordRegex.test(form.password)) {
      alert("Password must include uppercase, lowercase, and special character.");
      return false;
    }
    return true;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
// ✅ Call the validate function here
  if (!validate()) return;

    try {
      await axios.post('/auth/signup', form);
      alert("Yay! Welcome to EchoMate.");
      navigate('/');
    } catch {
      alert("Signup failed. Try again.");
    }
  };

  return (
    <AuthForm title="Create Your EchoMate Account 🌱">
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit" className="animated-btn">Sign Up</button>
        <p onClick={() => navigate('/')}>Already a user? <span>Log in</span></p>
      </form>
    </AuthForm>
  );
}
