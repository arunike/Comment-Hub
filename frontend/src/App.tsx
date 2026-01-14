import { useState, useEffect } from 'react';
import './index.css';
import type { Comment } from './types';
import { getComments, createComment, updateComment, deleteComment } from './api';
import { CommentList } from './components/CommentList';
import { CommentForm } from './components/CommentForm';
import { MessageSquare } from 'lucide-react';

function App() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const data = await getComments();
      setComments(data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleAddComment = async (text: string) => {
    try {
      const newComment = await createComment(text);
      setComments([newComment, ...comments]);
    } catch (error) {
      console.error("Failed to add comment", error);
      alert("Failed to add comment");
    }
  };

  const handleUpdateComment = async (id: number, text: string) => {
    try {
      const updatedComment = await updateComment(id, text);
      setComments(comments.map(c => c.id === id ? updatedComment : c));
    } catch (error) {
      console.error("Failed to update comment", error);
      alert("Failed to update comment");
    }
  };

  const handleDeleteComment = async (id: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      await deleteComment(id);
      setComments(comments.filter(c => c.id !== id));
    } catch (error) {
      console.error("Failed to delete comment", error);
      alert("Failed to delete comment");
    }
  };

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <MessageSquare size={32} color="#2563eb" />
        <h1 style={{ margin: 0 }}>Comment Hub</h1>
      </header>

      <CommentForm onSubmit={handleAddComment} />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
      ) : (
        <CommentList
          comments={comments}
          onUpdate={handleUpdateComment}
          onDelete={handleDeleteComment}
        />
      )}
    </div>
  );
}

export default App;
