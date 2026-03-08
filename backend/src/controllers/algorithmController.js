import prisma from '../config/database.js';
import algorithmService from '../services/algorithmService.js';

// Get all available algorithms
export const getAlgorithms = async (req, res) => {
  try {
    const algorithms = await prisma.algorithm.findMany({
      orderBy: [
        { category: 'asc' },
        { difficulty: 'asc' }
      ]
    });

    res.json({
      success: true,
      data: { algorithms }
    });
  } catch (error) {
    console.error('Get algorithms error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch algorithms.'
    });
  }
};

// Execute algorithm with visualization
export const executeAlgorithm = async (req, res) => {
  try {
    const { algorithmType, input } = req.body;

    if (!algorithmType || !input) {
      return res.status(400).json({
        success: false,
        message: 'Algorithm type and input are required.'
      });
    }

    const startTime = Date.now();
    const result = algorithmService.execute(algorithmType, input);
    const executionTime = Date.now() - startTime;

    // Save to execution history if user is authenticated
    if (req.user) {
      const algorithm = await prisma.algorithm.findUnique({
        where: { type: algorithmType }
      });

      await prisma.executionHistory.create({
        data: {
          userId: req.user.id,
          algorithmType,
          algorithmName: algorithm?.name || algorithmType,
          inputData: input,
          steps: result.steps,
          executionTime,
          comparisons: result.comparisons || 0,
          swaps: result.swaps || 0,
          iterations: result.steps.length,
          spaceComplexity: result.spaceComplexity,
          timeComplexity: result.timeComplexity
        }
      });
    }

    res.json({
      success: true,
      data: {
        ...result,
        executionTime
      }
    });
  } catch (error) {
    console.error('Execute algorithm error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to execute algorithm.'
    });
  }
};

// Save algorithm configuration
export const saveAlgorithm = async (req, res) => {
  try {
    const { algorithmType, name, description, configuration } = req.body;

    if (!algorithmType || !name || !configuration) {
      return res.status(400).json({
        success: false,
        message: 'Algorithm type, name, and configuration are required.'
      });
    }

    const savedAlgorithm = await prisma.savedAlgorithm.create({
      data: {
        userId: req.user.id,
        algorithmType,
        name,
        description: description || '',
        configuration
      }
    });

    res.status(201).json({
      success: true,
      message: 'Algorithm configuration saved successfully!',
      data: { savedAlgorithm }
    });
  } catch (error) {
    console.error('Save algorithm error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save algorithm configuration.'
    });
  }
};

// Get user's saved algorithms
export const getSavedAlgorithms = async (req, res) => {
  try {
    const { algorithmType } = req.query;

    const where = {
      userId: req.user.id,
      ...(algorithmType && { algorithmType })
    };

    const savedAlgorithms = await prisma.savedAlgorithm.findMany({
      where,
      orderBy: { updatedAt: 'desc' }
    });

    res.json({
      success: true,
      data: { savedAlgorithms }
    });
  } catch (error) {
    console.error('Get saved algorithms error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch saved algorithms.'
    });
  }
};

// Get specific saved algorithm
export const getSavedAlgorithm = async (req, res) => {
  try {
    const { id } = req.params;

    const savedAlgorithm = await prisma.savedAlgorithm.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!savedAlgorithm) {
      return res.status(404).json({
        success: false,
        message: 'Saved algorithm not found.'
      });
    }

    res.json({
      success: true,
      data: { savedAlgorithm }
    });
  } catch (error) {
    console.error('Get saved algorithm error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch saved algorithm.'
    });
  }
};

// Update saved algorithm
export const updateSavedAlgorithm = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, configuration } = req.body;

    const savedAlgorithm = await prisma.savedAlgorithm.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!savedAlgorithm) {
      return res.status(404).json({
        success: false,
        message: 'Saved algorithm not found.'
      });
    }

    const updated = await prisma.savedAlgorithm.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(configuration && { configuration })
      }
    });

    res.json({
      success: true,
      message: 'Algorithm configuration updated successfully!',
      data: { savedAlgorithm: updated }
    });
  } catch (error) {
    console.error('Update saved algorithm error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update algorithm configuration.'
    });
  }
};

// Delete saved algorithm
export const deleteSavedAlgorithm = async (req, res) => {
  try {
    const { id } = req.params;

    const savedAlgorithm = await prisma.savedAlgorithm.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!savedAlgorithm) {
      return res.status(404).json({
        success: false,
        message: 'Saved algorithm not found.'
      });
    }

    await prisma.savedAlgorithm.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Algorithm configuration deleted successfully!'
    });
  } catch (error) {
    console.error('Delete saved algorithm error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete algorithm configuration.'
    });
  }
};
