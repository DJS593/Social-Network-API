const { User, Thought } = require('../models');

const thoughtController = {
  // add thought to user
  addThought({ params, body }, res) {
    console.log(body);
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
        { _id: params.userId},
        { $push: { thoughts: _id } },
        { new: true }
      );
  })
  .then(dbThoughtData => {
    if (!dbThoughtData) {
      res.status(404).json({ message: 'No thought found with this id!' });
      return;
    }
    res.json(dbThoughtData);
  })
  .catch(err => res.json(err));
},


// add reply
addReply({ params, body }, res) {
  Thought.findOneAndUpdate(
    { _id: params.thoughtId },
    { $push: { replies: body }},
    { new: true, runValidators: true }
  )
  .then(dbThoughtData => {
    if (!dbThoughtData) {
      res.status(404).json({ message: 'No thought found with this id!' });
      return;
    }
    res.json(dbThoughtData);
  })
  .catch(err => res.json(err));
},

  // remove thought
  removeThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then(deletedThought => {
        console.log(deletedThought);
        if (!deletedThought) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { thoughts: params.thoughtId } },
          { new: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  // remove reply 
  removeReply({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { replies: { replyId: params.replyId }}},
      { new: true }
    )
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => res.json(err));
  }
};

module.exports = thoughtController;