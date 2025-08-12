export interface Favorite {
  id: string;
  postId: string;
  userId: string;
  createdAt: string;
}

export interface FavoritePost {
  id: string;
  post: {
    id: string;
    title: string;
    content: string;
    author: {
      id: string;
      name: string;
    };
    images?: string[];
    createdAt: string;
  };
  createdAt: string;
}
