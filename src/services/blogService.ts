import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  orderBy, 
  where, 
  limit, 
  serverTimestamp,
  startAfter,
  increment,
  arrayUnion,
  arrayRemove,
  Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  isVerifiedAuthor: boolean;
  isSystemPost: boolean;
  coverImage?: string;
  tags: string[];
  createdAt: any;
  updatedAt: any;
  likesCount?: number;
  likedBy?: string[];
  commentsCount?: number;
}

export interface BlogComment {
  id?: string;
  postId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  content: string;
  createdAt: any;
}

const POSTS_COLLECTION = 'blog_posts';
const COMMENTS_COLLECTION = 'blog_comments';

export const createPost = async (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
  const postData = {
    ...post,
    likesCount: 0,
    likedBy: [],
    commentsCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, POSTS_COLLECTION), postData);
  return { id: docRef.id, ...postData };
};

export const getPosts = async (
  pageSize: number = 10, 
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  orderField: string = 'createdAt',
  orderDirection: 'asc' | 'desc' = 'desc'
) => {
  let q = query(
    collection(db, POSTS_COLLECTION),
    orderBy(orderField, orderDirection),
    limit(pageSize)
  );

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }
  
  const querySnapshot = await getDocs(q);
  const posts = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as BlogPost[];

  return {
    posts,
    lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1]
  };
};

export const toggleLike = async (postId: string, userId: string, isLiked: boolean) => {
  const docRef = doc(db, POSTS_COLLECTION, postId);
  await updateDoc(docRef, {
    likesCount: increment(isLiked ? -1 : 1),
    likedBy: isLiked ? arrayRemove(userId) : arrayUnion(userId)
  });
};

export const addComment = async (comment: Omit<BlogComment, 'id' | 'createdAt'>) => {
  const commentData = {
    ...comment,
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), commentData);
  
  // Update comment count on post
  const postRef = doc(db, POSTS_COLLECTION, comment.postId);
  await updateDoc(postRef, {
    commentsCount: increment(1)
  });

  return { id: docRef.id, ...commentData };
};

export const getComments = async (postId: string) => {
  const q = query(
    collection(db, COMMENTS_COLLECTION),
    where('postId', '==', postId),
    orderBy('createdAt', 'asc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as BlogComment[];
};

export const getPostBySlug = async (slug: string) => {
  const q = query(
    collection(db, POSTS_COLLECTION),
    where('slug', '==', slug),
    limit(1)
  );
  
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  
  const doc = querySnapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data()
  } as BlogPost;
};

export const updatePost = async (id: string, updates: Partial<BlogPost>) => {
  const docRef = doc(db, POSTS_COLLECTION, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const deletePost = async (id: string) => {
  const docRef = doc(db, POSTS_COLLECTION, id);
  await deleteDoc(docRef);
};
