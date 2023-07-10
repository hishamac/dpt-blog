var router = require("express").Router()
var adminAuth = require('../middleware/auth').adminAuth
const upload = require("../utils/uploadImage");
const postServices = require("../services/post")

router.get('/',postServices.findAll)
router.get('/fake',postServices.fake)
router.get('/:id',postServices.findPost)
router.post('/',[adminAuth,upload],postServices.create)
router.put('/:id',[adminAuth,upload],postServices.update)
router.delete('/:id',[adminAuth,upload],postServices.delete)

module.exports = router