import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ThumbsUp, MessageCircle, Send } from 'lucide-react';

const PostComponent = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    content: ''
  });
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});
  
  // Fetch posts
  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/posts');
      setPosts(response.data);
      
      // Initialize comments state for each post
      const commentsObj = {};
      response.data.forEach(post => {
        commentsObj[post.id] = post.Comment || [];
      });
      setComments(commentsObj);
      
      // Initialize new comments input state
      const newCommentsObj = {};
      response.data.forEach(post => {
        newCommentsObj[post.id] = '';
      });
      setNewComments(newCommentsObj);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle post creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/posts', {
        ...newPost,
        userId
      });
      setNewPost({ title: '', description: '', content: '' });
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  // Handle like functionality
  const handleLike = async (postId) => {
    try {
      await axios.post(`http://localhost:3001/api/posts/${postId}/like`, {
        userId
      });
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  // Handle comment submission
  const handleComment = async (postId) => {
    try {
      await axios.post(`http://localhost:3001/api/posts/${postId}/comment`, {
        userId,
        comment: newComments[postId]
      });
      setNewComments(prev => ({ ...prev, [postId]: '' }));
      fetchPosts();
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Create Post Form */}
      <Card className="bg-white shadow-lg">
        <CardHeader className="text-xl font-bold">Create a New Post</CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Title"
              value={newPost.title}
              onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
              className="w-full"
            />
            <Input
              placeholder="Description"
              value={newPost.description}
              onChange={(e) => setNewPost(prev => ({ ...prev, description: e.target.value }))}
              className="w-full"
            />
            <Textarea
              placeholder="Content"
              value={newPost.content}
              onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              className="w-full"
              rows={4}
            />
            <Button type="submit" className="w-full">
              Post
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Posts Display */}
      <div className="space-y-4">
        {posts.map(post => (
          <Card key={post.id} className="bg-white shadow-lg">
            <CardHeader>
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-500">{post.description}</p>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{post.content}</p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2"
                  onClick={() => handleLike(post.id)}
                >
                  <ThumbsUp className={post.Like?.some(like => like.userId === userId) ? "text-blue-500" : ""} />
                  <span>{post.Like?.length || 0}</span>
                </Button>
                <div className="flex items-center space-x-2">
                  <MessageCircle />
                  <span>{comments[post.id]?.length || 0}</span>
                </div>
              </div>
              
              {/* Comments Section */}
              <div className="w-full space-y-2">
                {comments[post.id]?.map(comment => (
                  <div key={comment.id} className="bg-gray-50 p-2 rounded">
                    <p className="text-sm">{comment.comment}</p>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a comment..."
                    value={newComments[post.id]}
                    onChange={(e) => setNewComments(prev => ({
                      ...prev,
                      [post.id]: e.target.value
                    }))}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => handleComment(post.id)}
                    disabled={!newComments[post.id]}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PostComponent;