var router = require("express").Router()
var auth = require('../middleware/auth').auth
const commentServices = require("../services/comment")


router.post('/post/:id/comment', [auth], commentServices.create)
router.delete('/comment/:id/delete', [auth], commentServices.delete)
router.put('/comment/:id/update', [auth], commentServices.update)
router.get('/comment/:id', [auth], commentServices.findComment)


module.exports = router