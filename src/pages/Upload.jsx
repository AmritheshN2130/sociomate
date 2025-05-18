import { useState } from 'react';
import axios from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import UploadHeader from '../components/UploadHeader';
import '../components/Upload.css';

export default function Upload() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [hashtag, setHashtag] = useState('');
  const [showSuccess, setShowSuccess] = useState(false); // ✅ NEW

  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate(); // ✅ NEW

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !caption) {
      alert('Image and caption are required.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('caption', `${caption} #${hashtag}`);
    formData.append('user_id', user.id);

    try {
      await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setShowSuccess(true); // ✅ Trigger popup
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/profile'); // ✅ Redirect
      }, 2000);

      setImage(null);
      setPreview(null);
      setCaption('');
      setHashtag('');
    } catch (err) {
      console.error(err);
      alert('Upload failed.');
    }
  };

  return (
    <div className="upload-page">
      <UploadHeader />
      <div className="upload-form-container">
        <form onSubmit={handleSubmit} className="upload-form">
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && <img src={preview} alt="preview" className="preview-image" />}
          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows="3"
          />
          <input
            type="text"
            placeholder="#hashtag"
            value={hashtag}
            onChange={(e) => setHashtag(e.target.value)}
          />
          <button type="submit" className="upload-button">Post</button>
        </form>

        {showSuccess && (
          <div className="upload-success-popup">
            ✅ Post uploaded successfully!
          </div>
        )}
      </div>
    </div>
  );
}
