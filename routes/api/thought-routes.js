const router = require('express').Router();

// controller functions defined in thought-controllers.js
const { 
  getAllThought, 
  getThoughtById, 
  addThought, 
  updateThought, 
  removeThought, 
  addReaction, 
  removeReaction 
} = require('../../controllers/thought-controllers');


// Set up GET all and POST at /api/thoughts
router
  .route('/')
  .get(getAllThought)
  .post(addThought)

// /api/thoughts/:id
router
  .route('/:id')
  .get(getThoughtById)
  .put(updateThought)
  .delete(removeThought)

// /api/thoughts/<userId>
router
  .route('/:userId')
  .post(addThought)

  // /api/thoughts/<userId>/<reactionsId>
router
  .route('/:id/:reactions')
  .post(addReaction)

router
  .route('/:id/reactions/:reactionId')
  .delete(removeReaction);


  module.exports = router;