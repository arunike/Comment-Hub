import { useState } from 'react';
import { formatDistanceToNow, parseISO, format } from 'date-fns';
import { ThumbsUp, Trash2, Edit2, X, Check } from 'lucide-react';
import type { Comment } from '../types';
import styles from './CommentItem.module.css';

interface CommentItemProps {
    comment: Comment;
    onUpdate: (id: number, text: string) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
}

export const CommentItem = ({ comment, onUpdate, onDelete }: CommentItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.text);

    const handleSave = async () => {
        if (editText.trim() !== comment.text) {
            await onUpdate(comment.id, editText);
        }
        setIsEditing(false);
    };

    const parsedDate = parseISO(comment.date);
    const formattedRelative = formatDistanceToNow(parsedDate, { addSuffix: true });
    const formattedExact = format(parsedDate, 'MMM d, yyyy h:mm a');

    return (
        <div className={styles.card}>
            <img
                src={comment.image || 'https://ui-avatars.com/api/?name=' + comment.author}
                alt={comment.author}
                className={styles.avatar}
            />
            <div className={styles.content}>
                <div className={styles.header}>
                    <span className={styles.author}>{comment.author}</span>
                    <span className={styles.date} title={formattedExact}>{formattedRelative} • {formattedExact}</span>
                </div>

                {isEditing ? (
                    <div className={styles.editContainer}>
                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className={styles.textarea}
                        />
                        <div className={styles.actions}>
                            <button onClick={handleSave} className={styles.saveBtn} aria-label="Save">
                                <Check size={16} /> Save
                            </button>
                            <button onClick={() => { setIsEditing(false); setEditText(comment.text); }} className={styles.cancelBtn} aria-label="Cancel">
                                <X size={16} /> Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className={styles.text}>{comment.text}</p>
                )}

                <div className={styles.footer}>
                    <div className={styles.likes}>
                        <ThumbsUp size={14} />
                        <span>{comment.likes}</span>
                    </div>
                    <div className={styles.controls}>
                        <button onClick={() => setIsEditing(true)} className={styles.actionBtn}>
                            <Edit2 size={14} /> Edit
                        </button>
                        <button onClick={() => onDelete(comment.id)} className={styles.deleteBtn}>
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
