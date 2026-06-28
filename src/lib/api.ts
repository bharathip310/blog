const API_BASE = '/api';

export async function fetchPosts() {
  const response = await fetch(`${API_BASE}/posts`);
  if (!response.ok) throw new Error("Failed to fetch");
  return response.json();
}

export async function fetchPost(id: string) {
  const response = await fetch(`${API_BASE}/posts/${id}`);
  if (!response.ok) throw new Error("Failed to fetch post");
  return response.json();
}

export async function createPost(post: { title: string, content: string, authorId: string, authorName: string }) {
  const response = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post)
  });
  return response.json();
}

export async function updatePost(id: string, post: { title: string, content: string }) {
  const response = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post)
  });
  return response.json();
}

export async function deletePost(id: string) {
  const response = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'DELETE'
  });
  return response.json();
}

export async function fetchComments(postId: string) {
  const response = await fetch(`${API_BASE}/posts/${postId}/comments`);
  if (!response.ok) throw new Error("Failed to fetch comments");
  return response.json();
}

export async function createComment(postId: string, comment: { content: string, authorId: string, authorName: string }) {
  const response = await fetch(`${API_BASE}/posts/${postId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment)
  });
  return response.json();
}
