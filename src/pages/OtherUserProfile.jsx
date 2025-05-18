import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../api/axiosClient';
import Header from '../components/Header';

export default function OtherUserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get(`/api/users/${id}`).then(res => setUser(res.data));
    axios.get(`/api/posts/me?user_id=${id}`).then(res => setPosts(res.data));
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <>
      <Header />
      <div style={{ maxWidth: '600px', margin: 'auto', padding: '2rem' }}>
        <h2>@{user.username}</h2>
        <p>{user.bio || 'No bio available.'}</p>
        <img
          src={
            user.profile_pic ||
            `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`
          }
          alt="profile"
          style={{ width: '100px', borderRadius: '50%' }}
        />
        <h3 style={{ marginTop: '20px' }}>Posts</h3>
        {posts.map(post => (
          <div key={post.id}>
            <img src={post.image_url} alt="post" style={{ width: '100%' }} />
            <p>{post.caption}</p>
          </div>
        ))}
      </div>
    </>
  );
}
