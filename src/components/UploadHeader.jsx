import { useNavigate } from 'react-router-dom';
import './UploadHeader.css';

export default function UploadHeader() {
  const navigate = useNavigate();

  return (
    <div className="upload-header">
      <span onClick={() => navigate('/home')}>⬅️</span>
      <h2>Sociomate</h2>
      <div className="upload-header-icons">
        <span onClick={() => navigate('/notifications')}>🔔</span>
        <span onClick={() => navigate('/profile')}>👤</span>
      </div>
    </div>
  );
}
