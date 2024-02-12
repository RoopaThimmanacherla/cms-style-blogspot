const router = require('express').Router();
const withAuth = require('../../utils/auth');
const { Post, User, Comment } = require('../models');

router.get('/', withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      attributes: ['title', 'post_content'],
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['username', 'id', 'email'],
        },
        {
          model: Comment,
          attributes: ['user_id', 'id', 'post_id', 'comment_text'],
          include: {
            model: User,
            attributes: ['username', 'id', 'email'],
          },
        },
      ],
    });
    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));
    console.log(posts);

    res.status(200).json(posts);
    // Pass serialized data and session flag into template
    //res.render('homepage', { posts, logged_in: req.session.logged_in });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', withAuth, async (req, res) => {
  try {
    const postData = await Post.create({
      title: req.body.title,
      post_content: req.body.post_content,
      user_id: req.session.user_id,
    });
    res.status(200).json(postData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.update(
      {
        title: req.body.title,
        post_content: req.body.post_content,
      },
      {
        where: { id: req.params.id },
      }
    );
    const updatedPost = postData.map((post) => post.get({ plain: true }));
    console.log(updatedPost);
    if (updatedPost) {
      res.status(200).json(updatedPost);
    }
    res.status(400).json({ message: 'No post with the id to update!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const deletedPost = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });
    if (deletedPost) {
      res.status(200).json(deletedPost);
    }
    res.status(400).json({ message: 'No post with the id!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const logged_inUserPostData = await Post.findAll({
      where: {
        user_id: req.session.user_id,
      },
      attributes: ['title', 'post_content'],
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['username', 'id', 'email'],
        },
        {
          model: Comment,
          attributes: ['user_id', 'id', 'post_id', 'comment_text'],
          include: {
            model: User,
            attributes: ['username', 'id', 'email'],
          },
        },
      ],
    });

    if (logged_inUserPostData) {
      res.status(200).json(logged_inUserPostData);
    }
    res.json(400).json({ message: 'No Posts with your id!' });
  } catch (err) {
    res.json(500).json(err);
  }
});

module.exports = router;
