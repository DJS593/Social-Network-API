const { User, Thought } = require('../models');

const thoughtController = {
  // create a thought
  addThought({ body, /*params*/ }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(

        { _id: body.userId},
        { $push: { thoughts: _id } },
        { /*returnOriginal: false,*/new: true, upsert: true }
      );
  })
  .then(dbThoughtData => {
    console.log("what is this", dbThoughtData, typeof dbThoughtData);
    if (!dbThoughtData) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }
    res.json(dbThoughtData);
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
  .then(dbThoughtData => {
    if (!dbThoughtData) {
      res.status(404).json({ message: 'No thought found with this id!' });
      return;
    }
    res.json(dbThoughtData);
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
  removeReaction({ params, body }, res) {
    Thought.findByIdAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId }}},
      { new: true, runValidators: true }
    )
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
    .catch(err => res.status(400).json(err))
  },
};


// Exporting controller
module.exports = thoughtController;
