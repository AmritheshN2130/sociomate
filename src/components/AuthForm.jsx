import './Auth.css';

export default function AuthForm({ children, title }) {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}
