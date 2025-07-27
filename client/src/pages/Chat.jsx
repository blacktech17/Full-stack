import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api';

function Chat() {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return navigate('/login');
    fetchMessages();
    // eslint-disable-next-line
  }, [userId]);

  const fetchMessages = async () => {
    try {
      const data = await apiRequest(`/messages/${userId}`, 'GET', null, token);
      setMessages(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      await apiRequest('/messages', 'POST', { receiver: userId, content }, token);
      setContent('');
      fetchMessages();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat</h2>
      <div className="messages-list">
        {messages.map(m => (
          <div key={m._id} className={m.sender === user.id ? 'my-message' : 'their-message'}>
            <b>{m.sender === user.id ? 'Me' : 'Them'}:</b> {m.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend}>
        <input value={content} onChange={e => setContent(e.target.value)} placeholder="Type a message..." required />
        <button type="submit">Send</button>
      </form>
      {error && <p className="error">{error}</p>}
      <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
    </div>
  );
}

export default Chat;