// controllers/postController.js
const prisma = require("../db/index");

// Get all posts with user details, likes, and comments
exports.createPost = async (req, res) => {
    const { title, description, content, imageUrl, userId } = req.body;
    
    try {
      // Validate required fields
      if (!title || !description || !content || !userId) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          details: {
            title: !title ? 'Title is required' : null,
            description: !description ? 'Description is required' : null,
            content: !content ? 'Content is required' : null,
            userId: !userId ? 'User ID is required' : null
          }
        });
      }
  
      // Validate image URL format if provided
      if (imageUrl && !isValidUrl(imageUrl)) {
        return res.status(400).json({ error: 'Invalid image URL format' });
      }
  
      // Verify user exists
      const userExists = await prisma.user.findUnique({
        where: { id: userId }
      });
  
      if (!userExists) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Create post
      const post = await prisma.post.create({
        data: {
          title,
          description,
          content,
          imageUrl,
          userId,
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              username: true,
              profilePicURL: true,
            },
          },
          Like: true,
          Comment: true,
        },
      });
  
      return res.status(201).json(post);
    } catch (error) {
      console.error('Post creation error:', error);
      return res.status(500).json({ 
        error: 'Failed to create post',
        details: error.message 
      });
    }
  };
  
  // Helper function to validate URL
  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }
  
  // Update the getAllPosts controller to include imageUrl
  exports.getAllPosts = async (req, res) => {
    try {
      const posts = await prisma.post.findMany({
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              username: true,
              profilePicURL: true,
            },
          },
          Like: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          Comment: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  username: true,
                  profilePicURL: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  };

// Toggle like on a post
exports.toggleLike = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    // Check if like already exists
    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (existingLike) {
      // Unlike if already liked
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      res.status(200).json({ message: 'Post unliked successfully' });
    } else {
      // Create new like
      await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
      res.status(201).json({ message: 'Post liked successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle like' });
  }
};

// Add comment to a post
exports.addComment = async (req, res) => {
  const { postId } = req.params;
  const { userId, comment } = req.body;

  try {
    const newComment = await prisma.comment.create({
      data: {
        postId,
        userId,
        comment,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
            profilePicURL: true,
          },
        },
      },
    });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

// Get posts by user ID
exports.getUserPosts = async (req, res) => {
  const { userId } = req.params;

  try {
    const posts = await prisma.post.findMany({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
            profilePicURL: true,
          },
        },
        Like: true,
        Comment: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                username: true,
                profilePicURL: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    // First verify if the user owns the post
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        userId,
      },
    });

    if (!post) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    // Delete the post and all related likes and comments (will cascade delete)
    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
};