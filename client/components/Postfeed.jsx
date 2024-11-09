'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Image as ImageIcon, Upload } from 'lucide-react';

const PostFeed = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ 
    title: '', 
    description: '', 
    content: '',
    image: null 
  });
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to fetch posts');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }

      setNewPost({ ...newPost, image: file });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Create post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!newPost.title || !newPost.description || !newPost.content) {
        setError('Please fill in all required fields');
        return;
      }

      // Validate userId
      if (!userId) {
        setError('User ID is required');
        return;
      }

      // Create FormData object
      const formData = new FormData();
      formData.append('title', newPost.title);
      formData.append('description', newPost.description);
      formData.append('content', newPost.content);
      formData.append('userId', userId);
      if (newPost.image) {
        formData.append('image', newPost.image);
      }

      const response = await axios.post('http://localhost:3001/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Reset form
      setNewPost({ title: '', description: '', content: '', image: null });
      setImagePreview(null);
      setError('');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error.response?.data || error.message);
      setError(error.response?.data?.error || 'Failed to create post');
    }
  };
  
  // Rest of the handlers remain the same...
  const handleLike = async (postId) => {
    try {
      if (!userId) {
        setError('User ID is required');
        return;
      }

      await axios.post(`http://localhost:3001/api/posts/${postId}/like`, { userId });
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
      setError('Failed to like post');
    }
  };

  const handleComment = async (postId) => {
    try {
      if (!userId) {
        setError('User ID is required');
        return;
      }

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
      console.error('Error commenting on post:', error);
      setError('Failed to add comment');
    }
  };

  const toggleComments = (postId) => {
    setComments({ ...comments, [postId]: !comments[postId] });
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Create Post Form */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-2xl font-bold">Create New Post</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreatePost} className="space-y-4">
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
            <div className="flex items-center space-x-2">
              <ImageIcon className="text-gray-400" size={20} />
              <Input
                placeholder="Image URL (optional)"
                value={newPost.imageUrl}
                onChange={(e) => setNewPost({ ...newPost, imageUrl: e.target.value })}
                type="url"
              />
            </div>
            <Button type="submit">Create Post</Button>
          </form>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <h3 className="text-xl font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-500">
                By {post.user?.firstName} {post.user?.lastName}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{post.description}</p>
              {post.imageUrl && (
                <div className="my-4">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="rounded-lg max-h-96 w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-image.jpg'; // Add a placeholder image
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
                  <Heart className={post.Like?.some(like => like.userId === userId) ? 'fill-red-500 stroke-red-500' : ''} />
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
                    <Button onClick={() => handleComment(post.id)}>Comment</Button>
                  </div>
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PostFeed;