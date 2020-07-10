const { Schema, model } = require('mongoose');
const moment = require('moment');


const ReactionSchema = new Schema(
  {
    // set custom id to avoid confusion with parent comment's _id field
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    reactionBody: {
      type: String,
      required: true,
      max: 280,
      trim: true
    },
    username: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
    }
  },
  {
    toJSON: {
      getters: true
    }
  }
);



const ThoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      // could leave message `required: 'need a username',`
      min: [1 , 'Thoughts must be between 1 and 280 characters!'],
      max: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
    },
    username: {
      type: String,
      required: true
    },
    reactions: [ReactionSchema] 
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
ThoughtSchema.virtual('reactionCount').get(function() {
  return this.thought.reactions.length;
  
  //comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

// create the User model using the UserSchema
const Thought = model('Thought', ThoughtSchema);

// export the User model
module.exports = Thought;