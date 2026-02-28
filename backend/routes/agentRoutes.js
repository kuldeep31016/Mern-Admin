const express = require('express');
const router = express.Router();
const {
  createAgent,
  getAllAgents,
  deleteAgent
} = require('../controllers/agentController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/agents - Get all agents
router.get('/', protect, getAllAgents);

// POST /api/agents - Create new agent
router.post('/', protect, createAgent);

// DELETE /api/agents/:id - Delete agent
router.delete('/:id', protect, deleteAgent);

module.exports = router;
