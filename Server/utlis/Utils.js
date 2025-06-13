// const timeago = require('time-ago')
var ta = require('time-ago')

const mapPostOutput = (post, userId) => {
    return {
        _id: post._id,
        caption: post.caption,
        Image:post.Image,
        Owner:{
            _id: post.Owner._id,
            name: post.Owner.name,
            avatar:post.Owner.avatar
        },
        likesCount: post.likes.length,
        isLiked: post.likes.includes(userId),
        timeago: ta.ago(post.createdAt)

    }
}

module.exports = {
    mapPostOutput,
}