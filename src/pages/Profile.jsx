import { useEffect, useState } from 'react';
import Header from '../components/Header';
import PostCard from '../components/PostCard';
import '../components/Profile.css';

export default function Profile() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [posts, setPosts] = useState([]);

  // ✅ New userData state for extra fields
  const [userData, setUserData] = useState({
    address: '',
    phone: '',
    extra_info: ''
  });

  const loadUserData = async () => {
    try {
      const res = await fetch(`/api/users/${user.id}`);
      const data = await res.json();
      setBio(data.bio || '');
      setProfilePic(data.profile_pic || null);
      setUserData({
        address: data.address || '',
        phone: data.phone || '',
        extra_info: data.extra_info || ''
      });
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  };

  const loadUserPosts = async () => {
    try {
      const res = await fetch(`/api/posts?user_id=${user.id}`);
      const postsData = await res.json();
      const userPosts = postsData.filter(post => post.user_id === user.id);
      setPosts(userPosts);
    } catch (err) {
      console.error('Error loading posts:', err);
    }
  };

  useEffect(() => {
    loadUserData();
    loadUserPosts();
  }, [user.id]);

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewPic(URL.createObjectURL(file));
      setProfilePic(file);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('bio', bio);
    formData.append('address', userData.address || '');
    formData.append('phone', userData.phone || '');
    formData.append('extra_info', userData.extra_info || '');

    if (profilePic instanceof File) {
      formData.append('profile_pic', profilePic);
    }

    try {
      const res = await fetch(`/users/${user.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) throw new Error(await res.text());
      alert('Profile updated!');
      setEditMode(false);
      setPreviewPic(null);
      loadUserData();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update failed.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-pic-wrapper">
            <img
              src={
                previewPic
                  ? previewPic
                  : typeof profilePic === 'string' && profilePic
                  ? profilePic
                  : `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`
              }
              alt="Profile"
              className="profile-pic"
            />
            {editMode && (
              <input
                type="file"
                accept="image/*"
                onChange={handlePicChange}
                style={{ marginTop: '10px' }}
              />
            )}
          </div>

          <div className="profile-info">
            <h2>@{user.username}</h2>
            <p><strong>Followers:</strong> 24 | <strong>Following:</strong> 15</p>

            {editMode ? (
              <>
                <label>Bio:</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                />

                <label>Address:</label>
                <input
                  type="text"
                  value={userData.address}
                  onChange={(e) => setUserData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter your address"
                />

                <label>Phone Number:</label>
                <input
                  type="text"
                  value={userData.phone}
                  onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter your phone"
                />

                <label>Extra Info:</label>
                <textarea
                  value={userData.extra_info}
                  onChange={(e) => setUserData(prev => ({ ...prev, extra_info: e.target.value }))}
                  placeholder="Any extra info"
                />
              </>
            ) : (
              <>
                <p>{bio || 'No bio yet.'}</p>
                <p><strong>📍 Address:</strong> {userData.address || '#1 test, test test'}</p>
                <p><strong>📞 Phone:</strong> {userData.phone || '4567382898'}</p>
                <p><strong>📝 Extra Info:</strong> {userData.extra_info || 'working'}</p>
              </>
            )}
          </div>
        </div>

        <div className="profile-actions">
          <button onClick={() => setEditMode(!editMode)}>
            {editMode ? 'Cancel' : 'Edit Profile'}
          </button>
          {editMode && <button onClick={handleSave}>Save</button>}
          <button onClick={handleLogout}>Logout</button>
        </div>

        <h3 style={{ marginTop: '30px' }}>📸 Your Posts</h3>
        {posts.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '1rem' }}>No posts yet.</p>
        ) : (
          posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </>
  );
}
