import { useEffect, useState } from 'react';
import axios from '../api/axiosClient';
import './FollowerSuggestions.css';

export default function FollowerSuggestions({ userId }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    axios.get(`/suggestions/${userId}`).then(res => setSuggestions(res.data));
  }, [userId]);

  const handleFollow = async (targetId) => {
    await axios.post('/follow', {
      follower_id: userId,
      following_id: targetId
    });

    // Refresh suggestions after follow
    axios.get(`/suggestions/${userId}`).then(res => setSuggestions(res.data));
  };

  return (
    <div className="follower-suggestions">
      <h4>Suggested to Follow</h4>
      {suggestions.map(user => (
        <div key={user.id} className="suggestion-item">
          <img
            src={user.profile_pic || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
            alt="profile"
          />
          <span>@{user.username}</span>
          <button
  onClick={() => handleFollow(user.id)}
  disabled={user.is_following}
>
  {user.is_following ? 'Following' : 'Follow'}
</button>

        </div>
      ))}
    </div>
  );
}
