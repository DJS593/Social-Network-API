const { User, Thought } = require('../models');

const thoughtController = {
  // create a thought
  addThought({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.userId},
          { $push: { thoughts: _id } },
          { new: true, runValidators: true }
      );
  })
  .then(dbUserData => {
    console.log("what is this", dbUserData, typeof dbUserData);
    if (!dbUserData) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }
    res.json(dbUserData);
  })
  .catch(err => res.status(400).json(err));
},

// get all thoughts
getAllThought(req, res) {
  Thought.find({})
    .select('-__v') // remove?
    .sort({ _id: -1 })
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
},

// get a thought by id
getThoughtById({ params }, res) {
  Thought.findOne({ _id: params.id })
    .populate({
      path: 'reactions',
      select: '-__v'
    })
    .select('-__v')
    .then(dbThoughtData => {
      if(!dbThoughtData) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.status(400).json(err));
},

// update a thought by id
updateThought({ params, body }, res) {
  Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
    .populate({
      path: 'reactions',
      select: '-__v'
    })
    .select('-__v')
    .then(dbThoughtData => {
      if(!dbThoughtData) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.status(400).json(err));
},

// create a reaction
addReaction({ params, body }, res) {
  Thought.findOneAndUpdate(
    { _id: params.id },
    { $push: { reactions: body }},
    { new: true, runValidators: true }
  )
  .populate({
    path: 'reactions',
    select: '-__v'
  })
  .select('-__v')
  .then(dbReactionData => {
    console.log('reaction data', dbReactionData)
    if (!dbReactionData) {
      res.status(404).json({ message: 'No thought found with this id!' });
      return;
    }
    res.json(dbReactionData);
  })
  .catch(err => res.status(400).json(err));
},

  // remove thought
  removeThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then(deletedThought => {
        if (!deletedThought) {
          res.status(404).json({ message: 'No thought with this id!' });
          return;
        }
        res.json(deletedThought);
      })
      .catch(err => res.status(400).json(err));
  },

  // remove reaction
  deleteReaction({ params, body }, res) {
    Thought.findByIdAndUpdate(
      { _id: params.id },
      { $pull: { reactions: { reactionId: params.reactionId }}},
      { new: true, runValidators: true }
    )
    .then(dbReactionData => {
      if(!dbReactionData) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      res.json(dbReactionData);
    })
    .catch(err => res.status(400).json(err))
  },
};


// exporting controller
module.exports = thoughtController;
