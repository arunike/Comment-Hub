import { useState } from 'react';
import { Send } from 'lucide-react';
import styles from './CommentForm.module.css';

interface CommentFormProps {
    onSubmit: (text: string) => Promise<void>;
}

export const CommentForm = ({ onSubmit }: CommentFormProps) => {
    const [text, setText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onSubmit(text);
            setText('');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputWrapper}>
                <img
                    src="https://ui-avatars.com/api/?name=Admin"
                    alt="Current User"
                    className={styles.avatar}
                />
                <div className={styles.container}>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Add a comment..."
                        className={styles.textarea}
                        rows={1}
                    />
                    {text.trim() && (
                        <div className={styles.footer}>
                            <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                                <Send size={16} /> Comment
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
};
