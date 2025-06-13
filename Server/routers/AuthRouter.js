const router = require('express').Router();
const AuthController = require('../controllers/AuthController');


router.post('/signup', AuthController.signupController);
router.post('/login', AuthController.loginController);
router.post('/logout', AuthController.logoutController);
router.get("/refresh", AuthController.refreshAccessTokenController);
module.exports = router;
  