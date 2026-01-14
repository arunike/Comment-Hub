import type { Comment } from '../types';
import { CommentItem } from './CommentItem';

interface CommentListProps {
    comments: Comment[];
    onUpdate: (id: number, text: string) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
}

export const CommentList = ({ comments, onUpdate, onDelete }: CommentListProps) => {
    if (comments.length === 0) {
        return <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No comments yet. Be the first!</div>;
    }

    return (
        <div>
            {comments.map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};
