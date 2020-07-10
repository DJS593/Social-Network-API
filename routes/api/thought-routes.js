const router = require('express').Router();
const { addThought, removeThought, addReply, removeReply } = require('../../controllers/thought-controllers');


// Set up GET all and POST at /api/thoughts
router
  .route('/')
  // ADD THESE TO 
  //.get(getAllThoughts)
  //.post(createThoughts);




// /api/thoughts/<thoughtId>
router.route('/:pizzaId').post(addThought);


// /api/thoughts/<thoughtsId>/<reactionsId>
router
  .route('/:thoughtsId/:replyId')
  .put(addReply)
  .delete(removeThought)

  
  router.route('/:pizzaId/commentId/:replyId').delete(removeReply);


  module.exports = router;
