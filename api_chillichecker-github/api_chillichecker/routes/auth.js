const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const modelMiddleware = require('../middlewares/modelMiddleware');
const modelController = require('../controllers/modelController');
const bookmarkMiddleware = require('../middlewares/bookmarkMiddleware');
const bookmarkController = require('../controllers/bookmarkController')

router.post(
  '/register',
  [
    check('email', 'Email is required').not().isEmpty(),
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    authController.register(req, res, next);
  }
);

router.post(
  '/login',
  [
    check('email', 'Email is required').not().isEmpty(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    authController.login(req, res, next);
  }
);

router.post(
  '/predict', 
  modelMiddleware,
  authMiddleware.authMiddleware,
  modelController.postScanHandler
);

router.post(
  '/bookmark', 
  bookmarkMiddleware,
  authMiddleware.authMiddleware,
  bookmarkController.bookmark
);

router.get(
  '/bookmarklist',
  authMiddleware.authMiddleware,
  bookmarkController.bookmarkList
);

router.delete(
  '/bookmarkdelete',
  authMiddleware.authMiddleware,
  bookmarkController.bookmarkDelete
);

module.exports = router;