import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axiosClient';
import Header from '../components/Header';
import './SearchResults.css';

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ Required for navigation
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [results, setResults] = useState([]);

  const query = new URLSearchParams(location.search).get('user');

  useEffect(() => {
    if (query) {
      axios.get(`/api/users/search?username=${query}`).then(res => {
        setResults(res.data);
      });
    }
  }, [query]);

  const handleFollow = async (targetId) => {
    await axios.post('/follow', {
      follower_id: currentUser.id,
      following_id: targetId
    });

    // Optional: refetch or update UI
    alert("Followed!");
  };

  return (
    <>
      <Header />
      <div className="search-container">
        <h3>Search results for: <strong>{query}</strong></h3>

        {results.length === 0 ? (
          <p>No users found.</p>
        ) : (
          results.map(user => (
            <div key={user.id} className="search-result">
              <img
                src={user.profile_pic || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
                alt="avatar"
              />
              <span
  style={{ cursor: 'pointer', color: '#007bff' }}
  onClick={() => navigate(`/profile/${user.id}`)}
>
  @{user.username}
</span>
              <button onClick={() => handleFollow(user.id)}>Follow</button>
            </div>
          ))
        )}
      </div>
    </>
  );
}
