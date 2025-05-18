import { useEffect, useState } from "react";
import axios from "../api/axiosClient";
import "./Home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [userData] = useState({ bio: "", profile_pic: "" });
  const [posts, setPosts] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [comments, setComments] = useState({});
  const [showCommentsFor, setShowCommentsFor] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [popupUser, setPopupUser] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/posts");
        const postsData = await res.json();
        setPosts(postsData);

        postsData.forEach(async (post) => {
          try {
            const res = await axios.get(`/likes/${post.id}?user_id=${user.id}`);
            setLikeCounts((prev) => ({
              ...prev,
              [post.id]: res.data.like_count,
            }));
            setLikedPosts((prev) => ({
              ...prev,
              [post.id]: res.data.liked_by_user,
            }));
          } catch (err) {
            console.error("Error loading like data:", err);
          }
        });
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    const fetchSuggestions = async () => {
      try {
        const res = await axios.get("/users/search");
        setSuggestedUsers(res.data.filter((u) => u.id !== user.id));
      } catch (err) {
        console.error("Suggestion fetch failed:", err);
      }
    };

    fetchPosts();
    fetchSuggestions();
  }, [user.id]);

  const handleLike = async (postId) => {
    try {
      const res = await axios.post("/likes", {
        user_id: user.id,
        post_id: postId,
      });
      setLikedPosts((prev) => ({ ...prev, [postId]: res.data.liked }));
      setLikeCounts((prev) => ({
        ...prev,
        [postId]: res.data.liked
          ? prev[postId] + 1
          : prev[postId] > 0
          ? prev[postId] - 1
          : 0,
      }));

      const btn = document.getElementById(`like-${postId}`);
      if (btn) {
        btn.classList.add("like-animate");
        setTimeout(() => btn.classList.remove("like-animate"), 300);
      }
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const toggleComments = async (postId) => {
    if (showCommentsFor === postId) {
      setShowCommentsFor(null);
    } else {
      try {
        const res = await axios.get(`/comments/${postId}`);
        setComments((prev) => ({ ...prev, [postId]: res.data }));
        setShowCommentsFor(postId);
      } catch (err) {
        console.error("Comment fetch failed:", err);
      }
    }
  };

  const submitComment = async (postId) => {
    if (!newComment.trim()) return;
    try {
      await axios.post("/comments", {
        user_id: user.id,
        post_id: postId,
        comment: newComment,
      });
      const res = await axios.get(`/comments/${postId}`);
      setComments((prev) => ({ ...prev, [postId]: res.data }));
      setNewComment("");
    } catch (err) {
      console.error("Comment failed:", err);
    }
  };

  const handleFollowToggle = (targetId) => {
    alert(`You followed/unfollowed user with ID: ${targetId}`);
  };

  return (
    <>
      <nav>
        <div className="container">
          <h2 className="logo">Sociomate</h2>
          <div className="search-bar">
            <input
              type="search"
              placeholder="Search for creators..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(`/search?user=${e.target.value}`);
                }
              }}
            />
          </div>
          <div className="create">
            <label className="btn btn-primary" onClick={() => navigate("/upload")}>
              Create
            </label>
            <div className="profile-photo" onClick={() => navigate("/profile")}>
              <img
                src={
                  userData.profile_pic ||
                  `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`
                }
                alt="profile"
              />
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="container">
          {/* LEFT */}
          <div className="left">
            <a className="profile">
              <div className="profile-photo">
                <img
                  src={
                    userData.profile_pic ||
                    `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`
                  }
                  alt="profile"
                />
              </div>
              <div className="handle">
                <h4>{user.username}</h4>
                <p className="text-muted">@{user.username}</p>
              </div>
            </a>

            <div className="sidebar">
              <a className="menu-item active"><span>🏠</span><h3>Home</h3></a>
              <a className="menu-item" onClick={() => navigate("/community")}><span>🌐</span><h3>Explore</h3></a>
              <a className="menu-item" onClick={() => navigate("/notifications")}><span>🔔</span><h3>Notifications</h3></a>
              <a className="menu-item" onClick={() => navigate("/profile")}><span>👤</span><h3>Profile</h3></a>
            </div>

            <label className="btn btn-primary" onClick={() => navigate("/upload")}>Create Post</label>
          </div>

          {/* MIDDLE */}
          <div className="middle">
            <form className="create-post">
              <div className="profile-photo">
                <img
                  src={
                    userData.profile_pic ||
                    `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`
                  }
                  alt=""
                />
              </div>
              <input
                type="text"
                placeholder={`What's on your mind, ${user.username}?`}
                disabled
              />
              <input type="submit" className="btn btn-primary" value="Post" disabled />
            </form>

            <div className="feeds">
              {posts.map((post) => (
                <div className="feed" key={post.id}>
                  <div className="head">
                    <div className="user">
                      <div className="profile-photo">
                        <img
                          src={post.profile_pic || `https://api.dicebear.com/7.x/bottts/svg?seed=${post.username}`}
                          alt="user"
                        />
                      </div>
                      <div className="info">
                        <h3>{post.username}</h3>
                        <small>{new Date(post.created_at).toLocaleString()}</small>
                      </div>
                    </div>
                    <span className="edit">⋯</span>
                  </div>

                  <div className="photo">
                    <img src={post.image_url} alt="uploaded" />
                  </div>

                  <div className="action-buttons">
                    <div className="interaction-buttons">
                      <button
                        id={`like-${post.id}`}
                        onClick={() => handleLike(post.id)}
                        className="action-btn"
                      >
                        {likedPosts[post.id] ? "❤️" : "🤍"} {likeCounts[post.id] || 0}
                      </button>
                      <button
                        onClick={() => toggleComments(post.id)}
                        className="action-btn"
                      >
                        💬 {comments[post.id]?.length || 0}
                      </button>
                    </div>
                  </div>

                  {showCommentsFor === post.id && (
                    <div className="comment-popup">
                      <div className="comment-popup-close" onClick={() => setShowCommentsFor(null)}>✖</div>
                      <h4 style={{ marginBottom: "1rem" }}>Comments</h4>
                      {comments[post.id]?.map((cmt) => (
                        <div key={cmt.id} className="comment">
                          <strong>@{cmt.username}</strong>: {cmt.comment}
                        </div>
                      ))}
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                      />
                      <button onClick={() => submitComment(post.id)}>Post</button>
                    </div>
                  )}

                  <div className="caption">
                    <p><b>{post.username}</b> {post.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="right">
            <div className="messages">
              <div className="heading">
                <h4>Messages</h4>
                <span>✏️</span>
              </div>
              <div className="search-bar">
                <input type="search" placeholder="Search messages" />
              </div>
              <div className="category">
                <h6 className="active">Primary</h6>
                <h6>General</h6>
              </div>
              <div className="message">
                <div className="profile-photo">
                  <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=Friend`} alt="" />
                </div>
                <div className="message-body">
                  <h5>System</h5>
                  <p className="text-muted">Feature coming soon</p>
                </div>
              </div>
            </div>

            <div className="friend-requests">
              <h4>Requests</h4>
              {suggestedUsers.map((u) => (
                <div className="request" key={u.id}>
                  <div className="info" onClick={() => setPopupUser(u)} style={{ cursor: "pointer" }}>
                    <div className="profile-photo">
                      <img src={u.profile_pic || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.username}`} alt="" />
                    </div>
                    <div>
                      <h5>{u.username}</h5>
                      <p className="text-muted">@{u.username}</p>
                    </div>
                  </div>
                  <div className="action">
                    <button className="btn btn-primary" onClick={() => handleFollowToggle(u.id)}>Follow</button>
                  </div>
                </div>
              ))}

              {popupUser && (
                <div className="popup-card">
                  <button className="close-btn" onClick={() => setPopupUser(null)}>✖</button>
                  <img
                    src={popupUser.profile_pic || `https://api.dicebear.com/7.x/bottts/svg?seed=${popupUser.username}`}
                    alt="profile"
                    style={{ width: "60px", borderRadius: "50%" }}
                  />
                  <h4>{popupUser.username}</h4>
                  <p style={{ fontSize: "0.9rem" }}>{popupUser.bio || "No bio added yet."}</p>
                  <button className="btn btn-primary" onClick={() => handleFollowToggle(popupUser.id)}>
                    Follow
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
