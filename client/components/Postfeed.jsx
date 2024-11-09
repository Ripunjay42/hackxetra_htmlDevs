'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, MessageCircle, Trash2, X, Plus } from 'lucide-react';

const CreatePostForm = ({ onSubmit, onClose }) => {
  const [newPost, setNewPost] = useState({ 
    title: '', 
    description: '', 
    content: '',
    image: null 
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPost({ ...newPost, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setNewPost({ ...newPost, image: null });
    setImagePreview(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row justify-between items-center">
          <h2 className="text-2xl font-bold">Create New Post</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              placeholder="Title"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              required
            />
            <Input
              placeholder="Description"
              value={newPost.description}
              onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
              required
            />
            <Textarea
              placeholder="Content"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              required
            />
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1"
                />
                {imagePreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleRemoveImage}
                    className="p-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {imagePreview && (
                <div className="relative w-full h-48">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Create Post</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const PostFeed = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      formData.append('userId', userId);
      
      await axios.post('http://localhost:3001/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setShowCreatePost(false);
      setError('');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.response?.data?.error || 'Failed to create post');
    }
  };

  const handleDeletePost = async (postId) => {
    if (isDeleting[postId]) return;
    
    try {
      setIsDeleting(prev => ({ ...prev, [postId]: true }));
      setError('');
      
      const numericUserId = parseInt(userId);
      
      if (!postId || !numericUserId) {
        throw new Error('Invalid post or user ID');
      }

      const response = await axios.delete(
        `http://localhost:3001/api/posts/${postId}`,
        {
          data: { userId: numericUserId }
        }
      );

      if (response.status === 200) {
        setPosts(currentPosts => 
          currentPosts.filter(post => post.id !== postId)
        );
      }
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage = error.response?.data?.error || 
                          error.message || 
                          'Failed to delete post';
      setError(errorMessage);
    } finally {
      setIsDeleting(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`http://localhost:3001/api/posts/${postId}/like`, { userId });
      fetchPosts();
    } catch (error) {
      setError('Failed to like post');
    }
  };

  const handleComment = async (postId) => {
    try {
      if (!newComments[postId]?.trim()) {
        setError('Comment cannot be empty');
        return;
      }

      await axios.post(`http://localhost:3001/api/posts/${postId}/comment`, {
        userId,
        comment: newComments[postId]
      });
      setNewComments({ ...newComments, [postId]: '' });
      fetchPosts();
    } catch (error) {
      setError('Failed to add comment');
    }
  };

  const toggleComments = (postId) => {
    setComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription className="flex justify-between items-center">
            <span>{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError('')}
              className="h-8 px-2 hover:bg-red-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-6">
        <Button
          onClick={() => setShowCreatePost(true)}
          className="w-full flex items-center justify-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Create New Post</span>
        </Button>
      </div>

      {showCreatePost && (
        <CreatePostForm
          onSubmit={handleCreatePost}
          onClose={() => setShowCreatePost(false)}
        />
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="text-center p-4">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center p-4">No posts yet</div>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="flex flex-row justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{post.title}</h3>
                  <p className="text-sm text-gray-500">
                    By {post.user?.username} on {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {parseInt(userId) === post.userId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePost(post.id)}
                    disabled={isDeleting[post.id]}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    {isDeleting[post.id] && <span className="ml-2">Deleting...</span>}
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{post.description}</p>
                {post.imageUrl && (
                  <div className="my-4">
                    <img 
                      src={`http://localhost:3001${post.imageUrl}`}
                      alt={post.title}
                      className="rounded-lg max-h-96 w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                )}
                <p className="mt-2">{post.content}</p>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="flex space-x-4">
                  <Button
                    variant="ghost"
                    onClick={() => handleLike(post.id)}
                    className="flex items-center space-x-2"
                  >
                    <Heart 
                      className={post.Like?.some(like => like.userId === parseInt(userId)) 
                        ? 'fill-red-500 stroke-red-500' 
                        : ''
                      } 
                    />
                    <span>{post.Like?.length || 0}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center space-x-2"
                  >
                    <MessageCircle />
                    <span>{post.Comment?.length || 0}</span>
                  </Button>
                </div>

                {comments[post.id] && (
                  <div className="w-full space-y-4">
                    {post.Comment?.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 p-2 rounded">
                        <p className="text-sm font-semibold">
                          {comment.user?.firstName} {comment.user?.lastName}
                        </p>
                        <p>{comment.comment}</p>
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a comment..."
                        value={newComments[post.id] || ''}
                        onChange={(e) => setNewComments({
                          ...newComments,
                          [post.id]: e.target.value
                        })}
                      />
                      <Button onClick={() => handleComment(post.id)}>
                        Comment
                      </Button>
                    </div>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PostFeed;