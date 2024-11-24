import React, { useState } from 'react';
import { User, Send } from 'lucide-react';

export interface Comment {
  id: string;
  userId: string;
  userEmail: string;
  content: string;
  timestamp: number;
  replies: Comment[];
}

interface CommentsProps {
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => void;
  currentUserEmail: string;
}

export default function Comments({ comments, onAddComment, currentUserEmail }: CommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim(), parentId);
      setNewComment('');
      setReplyTo(null);
    }
  };

  const CommentItem = ({ comment, level = 0 }: { comment: Comment; level?: number }) => (
    <div className={`${level > 0 ? 'ml-8' : ''} mb-4`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm">
            <span className="font-medium text-gray-900">{comment.userEmail}</span>
            <span className="text-gray-500 ml-2">
              {new Date(comment.timestamp).toLocaleString()}
            </span>
          </div>
          <div className="mt-1 text-sm text-gray-700">{comment.content}</div>
          <button
            onClick={() => setReplyTo(comment.id)}
            className="mt-1 text-sm text-blue-600 hover:text-blue-700"
          >
            Reply
          </button>
          
          {replyTo === comment.id && (
            <form onSubmit={(e) => handleSubmit(e, comment.id)} className="mt-2">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 min-w-0 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {comment.replies?.length > 0 && (
        <div className="mt-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <form onSubmit={(e) => handleSubmit(e)} className="mb-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}