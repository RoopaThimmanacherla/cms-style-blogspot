const router = require('express').Router();
const { User } = require('../../models');

//signup new user

router.post('/signup', async (req, res) => {
  try {
    const userData = User.create(req.body);
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
    });
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Login User

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { emaii: req.body.email } });
    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or pasword please try again' });

      return;
    }

    const validPassword =  userData.checkPassword(req.body.password);
    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password Please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: 'You are now logged in !' });
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});
module.exports = router;
