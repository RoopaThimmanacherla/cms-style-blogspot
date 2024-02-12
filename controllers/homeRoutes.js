const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

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

module.exports = router;
