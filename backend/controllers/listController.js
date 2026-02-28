const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const XLSX = require('xlsx');
const Agent = require('../models/Agent');
const DistributedList = require('../models/DistributedList');

// @desc    Upload and distribute contacts to agents
// @route   POST /api/lists/upload
// @access  Private
const uploadAndDistribute = async (req, res, next) => {
  try {
    // Step 1: Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();

    // Step 2: Validate file extension
    const allowedExtensions = ['.csv', '.xlsx', '.xls'];
    if (!allowedExtensions.includes(fileExtension)) {
      // Delete invalid file
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: 'Invalid file format. Only .csv, .xlsx, and .xls files are allowed'
      });
    }

    let rows = [];

    // Step 3: Parse file based on extension
    if (fileExtension === '.csv') {
      // Parse CSV file
      rows = await new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => resolve(results))
          .on('error', (error) => reject(error));
      });
    } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
      // Parse Excel file
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0]; // Read first sheet
      const worksheet = workbook.Sheets[sheetName];
      rows = XLSX.utils.sheet_to_json(worksheet);
    }

    // Step 4: Normalize column names and map to standard format
    const normalizedRows = rows.map((row) => {
      // Create a case-insensitive key lookup
      const normalizedRow = {};
      Object.keys(row).forEach((key) => {
        normalizedRow[key.toLowerCase().trim()] = row[key];
      });

      return {
        firstName: normalizedRow['firstname'] || normalizedRow['first name'] || '',
        phone: normalizedRow['phone'] || normalizedRow['phonenumber'] || normalizedRow['mobile'] || '',
        notes: normalizedRow['notes'] || normalizedRow['note'] || ''
      };
    });

    // Step 5: Validate rows
    if (normalizedRows.length === 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: 'File is empty or contains no valid data'
      });
    }

    // Validate that each row has required fields
    const invalidRows = normalizedRows.filter(
      (row) => !row.firstName || !row.phone
    );

    if (invalidRows.length > 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: 'File contains rows without required fields (firstName, phone)'
      });
    }

    // Step 6: Get all agents
    const agents = await Agent.find().select('_id name email');

    if (agents.length === 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: 'No agents found. Please add agents before uploading lists'
      });
    }

    // Step 7: Distribution algorithm - Round-robin distribution
    // Create empty bucket (array) for each agent
    const agentBuckets = agents.map((agent) => ({
      agentId: agent._id,
      agentName: agent.name,
      agentEmail: agent.email,
      items: []
    }));

    // Distribute contacts using round-robin algorithm
    // Example: 26 contacts, 5 agents → distribution [6, 6, 6, 5, 3]
    // Contact index 0 goes to agent 0, index 1 to agent 1, etc.
    // When we reach the last agent, we wrap back to the first agent
    normalizedRows.forEach((row, index) => {
      const agentIndex = index % agents.length; // Round-robin: cycles through 0, 1, 2, ..., n-1
      agentBuckets[agentIndex].items.push(row);
    });

    // Step 8: Delete all existing distributed lists (fresh distribution)
    await DistributedList.deleteMany({});

    // Step 9: Create and save new distributed lists
    const uploadBatch = Date.now().toString(); // Unique batch ID for this upload
    const distributedLists = [];

    for (const bucket of agentBuckets) {
      if (bucket.items.length > 0) {
        const distributedList = await DistributedList.create({
          agentId: bucket.agentId,
          agentName: bucket.agentName,
          agentEmail: bucket.agentEmail,
          items: bucket.items,
          uploadBatch
        });
        distributedLists.push(distributedList);
      }
    }

    // Step 10: Delete uploaded file from disk
    fs.unlinkSync(filePath);

    // Step 11: Return success with summary
    const summary = distributedLists.map((list) => ({
      agentName: list.agentName,
      itemCount: list.items.length
    }));

    res.status(200).json({
      success: true,
      message: 'File uploaded and contacts distributed successfully',
      totalContacts: normalizedRows.length,
      totalAgents: agents.length,
      distribution: summary
    });
  } catch (error) {
    // Ensure file is deleted on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// @desc    Get all distributed lists
// @route   GET /api/lists
// @access  Private
const getDistributedLists = async (req, res, next) => {
  try {
    // Fetch all distributed lists sorted by agent name
    const lists = await DistributedList.find().sort({ agentName: 1 });

    res.status(200).json({
      success: true,
      count: lists.length,
      lists
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadAndDistribute,
  getDistributedLists
};
