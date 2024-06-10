export interface User {
  id: string;
  email: string;
  role: string;
  name: string | null; // Allow name to be null
  createdAt: string; // Change to string
}

// lib/types.ts
export interface Post {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorId: string;
  createdAt: string;
}
