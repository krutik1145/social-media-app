const router = require('express').Router();
const PostController = require('../controllers/PostContorller');
const RequireUser = require("../middlewares/RequireUser");

router.post('/', RequireUser,PostController.createPostController);
router.post('/like', RequireUser,PostController.likeAndUnlikePost);
router.put('/',RequireUser,PostController.updatePostController )
router.delete('/',RequireUser,PostController.deletePost )


module.exports = router;
  