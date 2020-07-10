const { Schema, model } = require('mongoose');
//const { moveMessagePortToContext } = require('worker_threads');
const moment = require('moment');


const UserSchema = new Schema(
  {
    userName: {
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
      match: [/.+@.+\..+/],  // double check
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
      getters: true
    },
    id: false
  }
);

// get total count of comments and replies on retrieval
UserSchema.virtual('friendCount').get(function() {
  return this.user.friends.length;
  
  //comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

// create the User model using the UserSchema
const User = model('User', UserSchema);

// export the User model
module.exports = User;