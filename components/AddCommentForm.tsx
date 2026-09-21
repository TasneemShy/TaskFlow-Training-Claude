'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface AddCommentFormProps {
  taskId: number;
}

export function AddCommentForm({ taskId }: AddCommentFormProps) {
  const router = useRouter();
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) {
      return;
    }

    setSubmitting(true);
    try {
      await fetch(`/api/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: trimmed }),
      });
      setBody('');
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Add a comment"
        aria-label="Comment body"
        className="rounded border border-gray-300 px-3 py-1.5"
      />
      <button
        type="submit"
        disabled={submitting}
        className="self-start rounded bg-blue-600 px-3 py-1.5 text-white disabled:opacity-50"
      >
        Comment
      </button>
    </form>
  );
}
