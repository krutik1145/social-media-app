const Requireuser = require('../middlewares/RequireUser');
const UserController = require('../controllers/UserContorller');
const RequireUser = require('../middlewares/RequireUser');
const router = require('express').Router();

router.post('/follow', RequireUser, UserController.followOrUnfollowUserController);
router.get('/getFeedData', RequireUser, UserController.getPostsOfFollowing);
router.get('/getMyPosts', RequireUser, UserController.getMyPosts);
router.get('/getUserPosts', RequireUser, UserController.getUserPosts);
router.delete('/', RequireUser, UserController.deleteMyProfile);
router.get('/getMyInfo', RequireUser, UserController.getMyInfo);

router.put('/', RequireUser, UserController.updateUserProfile);
router.post('/getUserProfile', RequireUser, UserController.getUserProfile);

module.exports = router;
 