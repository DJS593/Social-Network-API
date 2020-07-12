const { Schema, model } = require('mongoose');
const moment = require('moment');


const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      // could leave message `required: 'need a username',`
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/],  // double check / should I use the regex from last weekedn
    },
    thoughts: [
      { // not sure what to do here
        type: Schema.Types.ObjectId,
        ref: 'Thought'
      }
    ],
    friends: [
      { // not sure what to do for _id
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: {
      virtuals: true,
      getters: true // check
    },
    id: false
  }
);

// total count of friends
UserSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

// total count of thoughts
UserSchema.virtual('thoughtCount').get(function() {
  return this.thoughts.reduce((total, thought) =>
  total + thought.reactions.length + 1, 0);
});

// create the User model using the UserSchema
const User = model('User', UserSchema);

// export the User model
module.exports = User;