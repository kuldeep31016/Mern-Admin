const mongoose = require('mongoose');

const distributedListSchema = new mongoose.Schema({
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    required: true
  },
  agentName: {
    type: String,
    required: true
  },
  agentEmail: {
    type: String,
    required: true
  },
  items: [
    {
      firstName: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      },
      notes: {
        type: String,
        default: ''
      }
    }
  ],
  uploadBatch: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DistributedList', distributedListSchema);
