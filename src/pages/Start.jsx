import { useNavigate } from 'react-router-dom';
import '../components/Auth.css'; // Reuse the theme

export default function Start() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 style={{ marginBottom: '1rem' }}>🌿 Welcome to SocioMate</h1>
        <p style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button className="animated-btn" onClick={() => navigate('/signup')}>Sign Up</button>
           <button className="animated-btn" onClick={() => navigate('/login')}>Already a User?</button> {/* ✅ this line */}
        </div>
      </div>
    </div>
  );
}
