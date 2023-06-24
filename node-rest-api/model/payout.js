const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Payout = new Schema({
  total: {
    type: Number
  },
  equalShare: {
    type: Number
  },
  payouts: [{
    owes: {
        type: String
    },
    owed: {
        type: String
    },
    amount: {
        type: Number
    },
  }]
}, {
  collection: 'payouts'
})
module.exports = mongoose.model('Payout', Payout)