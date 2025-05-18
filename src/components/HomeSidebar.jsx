import './HomeSidebar.css';

export default function HomeSidebar({ user }) {
  const avatar = user.profile_pic
    ? user.profile_pic
    : `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`;

  return (
    <div className="home-sidebar">
      <img src={avatar} alt="avatar" className="home-avatar" />
      <h3>@{user.username}</h3>
      <p className="bio-faded">{user.bio || 'No bio added.'}</p>
    </div>
  );
}
