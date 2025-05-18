import { useState, useEffect } from 'react';
import axios from '../api/axiosClient';
import './PostCard.css';

export default function PostCard({ post }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    axios.get(`/likes/${post.id}`).then(res => {
      setLikeCount(res.data.like_count || 0);
      setLiked(res.data.liked_by_user || false);
    });
  }, [post.id]);

  const handleLike = async () => {
    try {
      const res = await axios.post('/likes', {
        user_id: user.id,
        post_id: post.id
      });
      setLiked(res.data.liked);
      setLikeCount(prev => res.data.liked ? prev + 1 : prev - 1);
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  const toggleComments = async () => {
    if (!showComments) {
      try {
        const res = await axios.get(`/comments/${post.id}`);
        setComments(res.data);
      } catch (err) {
        console.error('Failed to load comments:', err);
      }
    }
    setShowComments(prev => !prev);
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      await axios.post('/comments', {
        user_id: user.id,
        post_id: post.id,
        comment: commentText
      });
      setCommentText('');
      const res = await axios.get(`/comments/${post.id}`);
      setComments(res.data);
    } catch (err) {
      console.error('Comment failed:', err);
    }
  };

  const renderCaption = (caption) => {
    return caption.split(' ').map((word, index) =>
      word.startsWith('#') ? (
        <span key={index} className="hashtag">{word} </span>
      ) : (
        <span key={index}>{word} </span>
      )
    );
  };

  return (
    <div className="post-card">
      <div className="post-card-header">
        <div className="post-user">
          <img
            src={post.profile_pic || `https://api.dicebear.com/7.x/bottts/svg?seed=${post.username}`}
            alt="user"
            className="post-user-pic"
          />
          <div>
            <strong>@{post.username}</strong>
            <div className="post-bio">{post.bio || ''}</div>
          </div>
        </div>
      </div>

      {post.image_url && (
        <img src={post.image_url} alt="post" className="post-image" />
      )}

      <div className="post-caption">{renderCaption(post.caption)}</div>

      <div className="post-actions">
        <button className="action-btn" onClick={handleLike}>
          {liked ? '❤️' : '🤍'} {likeCount}
        </button>
        <button className="action-btn" onClick={toggleComments}>
          💬 {comments.length}
        </button>
      </div>

      {showComments && (
        <div className="comment-section">
          {comments.map((cmt) => (
            <div key={cmt.id} className="comment">
              <img
                src={cmt.profile_pic || '/default-profile.png'}
                alt="user"
                className="comment-pic"
              />
              <strong>@{cmt.username}</strong>: {cmt.comment}
            </div>
          ))}
          <div className="comment-input">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
            />
            <button onClick={handleCommentSubmit}>Post</button>
          </div>
        </div>
      )}
    </div>
  );
}
