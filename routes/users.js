const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render(
    'users',
    {
      title: 'Hey',
      paragraph: 'This is the users page, It is another route that you may choose to use (or make your own!)',
    }
  );
});

module.exports = router;
