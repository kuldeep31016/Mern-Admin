const Agent = require('../models/Agent');
const DistributedList = require('../models/DistributedList');

// @desc    Create new agent
// @route   POST /api/agents
// @access  Private
const createAgent = async (req, res, next) => {
  try {
    const { name, email, mobileNumber, password } = req.body;

    // Validate all fields are present
    if (!name || !email || !mobileNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, mobileNumber, password'
      });
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Check if agent with email already exists
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({
        success: false,
        message: 'Agent with this email already exists'
      });
    }

    // Create new agent (password will be hashed by pre-save hook)
    const agent = await Agent.create({
      name,
      email,
      mobileNumber,
      password
    });

    // Return agent without password
    res.status(201).json({
      success: true,
      message: 'Agent created successfully',
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        mobileNumber: agent.mobileNumber,
        createdAt: agent.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all agents
// @route   GET /api/agents
// @access  Private
const getAllAgents = async (req, res, next) => {
  try {
    // Get all agents sorted by creation date (newest first)
    const agents = await Agent.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: agents.length,
      agents
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete agent
// @route   DELETE /api/agents/:id
// @access  Private
const deleteAgent = async (req, res, next) => {
  try {
    const agent = await Agent.findById(req.params.id);

    // Check if agent exists
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    // Delete the agent
    await Agent.findByIdAndDelete(req.params.id);

    // Delete all distributed lists for this agent
    await DistributedList.deleteMany({ agentId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Agent and associated lists deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAgent,
  getAllAgents,
  deleteAgent
};
