import { useState, useEffect } from 'react';
import './index.css';
import type { Comment } from './types';
import { getComments, createComment, updateComment, deleteComment } from './api';
import { CommentList } from './components/CommentList';
import { CommentForm } from './components/CommentForm';
import { MessageSquare, ArrowDown, ArrowUp } from 'lucide-react';

function App() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Initialize from localStorage or default
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(() => {
    return (localStorage.getItem('sortOrder') as 'asc' | 'desc') || 'desc';
  });
  const [sortField, setSortField] = useState<'date' | 'id'>(() => {
    return (localStorage.getItem('sortField') as 'date' | 'id') || 'date';
  });

  // Save to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sortOrder', sortOrder);
  }, [sortOrder]);

  useEffect(() => {
    localStorage.setItem('sortField', sortField);
  }, [sortField]);

  const fetchComments = async () => {
    try {
      const data = await getComments(sortField, sortOrder);
      setComments(data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [sortOrder, sortField]);

  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  }

  const toggleSortField = () => {
    setSortField(prev => prev === 'date' ? 'id' : 'date');
  }

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
      <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={32} color="#2563eb" />
          <h1 style={{ margin: 0 }}>Comment Hub</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={toggleSortField}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#64748b',
            }}
          >
            Sort by: {sortField === 'date' ? 'Date' : 'ID'}
          </button>
          <button
            onClick={toggleSort}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#64748b',
            }}
          >
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            {sortOrder === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          </button>
        </div>
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
