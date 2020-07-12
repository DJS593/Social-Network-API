const router = require('express').Router();

// controller functions defined in thought-controllers.js
const { 
  getAllThought, 
  getThoughtById, 
  addThought, 
  updateThought, 
  removeThought, 
  addReaction, 
  deleteReaction 
} = require('../../controllers/thought-controllers');


// Set up GET all and POST at /api/thoughts
router
  .route('/')
  .get(getAllThought)

// /api/thoughts/:id
router
  .route('/:id')
  .get(getThoughtById)
  .put(updateThought)
  .delete(removeThought)

// /api/thoughts/<userId>
router
  .route('/:userId')
  .post(addThought);
  
// /api/thoughts/<thoughtsId>/<reactionsId>
router
  .route('/:id/:reactions')
  .post(addReaction)

// /api/thoughts/<thoughtsId>/reactions/<reactionId>  
router
  .route('/:id/reactions/:reactionId')
  .delete(deleteReaction);


  module.exports = router;