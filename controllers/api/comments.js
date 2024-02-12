const router = require('express').Router();
const { Comment } = require('../models');
const withAuth = require('../utils/auth');

router.post('/:id', withAuth, async (req, res) => {
  try {
    const commentData = await Comment.create({
      user_id: req.session.user_id,
      post_id: req.params.id,
      commnet_text: req.body.commnet_text,
    });

    if (commentData) {
      res.status(200).json(commentData);
    }
    res.status(400).json({ Message: 'Not able to comment!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
