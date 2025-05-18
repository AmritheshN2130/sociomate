import { useState } from "react";
import "./Notifications.css";

import "./Home.css";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
      const navigate = useNavigate();

  const [notifications] = useState([
    {
      id: 1,
      user: "achu",
      message: "liked your post",
      type: "like",
      time: "Just now",
      profile: `https://api.dicebear.com/7.x/bottts/svg?seed=achu`
    },
    {
      id: 2,
      user: "achu",
      message: "commented: 'Awesome!'",
      type: "comment",
      time: "2 mins ago",
      profile: `https://api.dicebear.com/7.x/bottts/svg?seed=achu`
    },
    {
      id: 3,
      user: "aaa",
      message: "followed you",
      type: "follow",
      time: "10 mins ago",
      profile: `https://api.dicebear.com/7.x/bottts/svg?seed=aaa`
    },
    {
      id: 4,
      user: "aaa",
      message: "is online now",
      type: "online",
      time: "20 mins ago",
      profile: `https://api.dicebear.com/7.x/bottts/svg?seed=aaa`
    }
  ]);

  return (
    
    <div className="notification-container">
      <h2>🔔 Notifications</h2>
      <div className="notification-list">
        {notifications.map((n) => (
          <div key={n.id} className={`notification-card ${n.type}`}>
            <div className="profile-photo">
              <img src={n.profile} alt={n.user} />
            </div>
            <div className="notification-content">
              <p>
                <strong>{n.user}</strong> {n.message}
              </p>
              <small className="time">{n.time}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="sidebar">
              <a className="menu-item" onClick={() => navigate("/Home")}><span>🏠</span><h3>Home</h3></a>
              <a className="menu-item" onClick={() => navigate("/profile")}><span>👤</span><h3>Profile</h3></a>
            </div>

    </div>
  );
}
