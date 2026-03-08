import prisma from '../config/database.js';

// Get user's execution history
export const getHistory = async (req, res) => {
  try {
    const { algorithmType, page = 1, limit = 20 } = req.query;

    const where = {
      userId: req.user.id,
      ...(algorithmType && { algorithmType })
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [history, total] = await Promise.all([
      prisma.executionHistory.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
        select: {
          id: true,
          algorithmType: true,
          algorithmName: true,
          inputData: true,
          executionTime: true,
          comparisons: true,
          swaps: true,
          iterations: true,
          timeComplexity: true,
          spaceComplexity: true,
          createdAt: true
        }
      }),
      prisma.executionHistory.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        history,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch execution history.'
    });
  }
};

// Get specific execution details
export const getHistoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    const historyItem = await prisma.executionHistory.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!historyItem) {
      return res.status(404).json({
        success: false,
        message: 'Execution history item not found.'
      });
    }

    res.json({
      success: true,
      data: { historyItem }
    });
  } catch (error) {
    console.error('Get history item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch execution details.'
    });
  }
};

// Delete history entry
export const deleteHistoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    const historyItem = await prisma.executionHistory.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!historyItem) {
      return res.status(404).json({
        success: false,
        message: 'Execution history item not found.'
      });
    }

    await prisma.executionHistory.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'History entry deleted successfully!'
    });
  } catch (error) {
    console.error('Delete history item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete history entry.'
    });
  }
};

// Clear all history for user
export const clearHistory = async (req, res) => {
  try {
    const { algorithmType } = req.query;

    const where = {
      userId: req.user.id,
      ...(algorithmType && { algorithmType })
    };

    const result = await prisma.executionHistory.deleteMany({ where });

    res.json({
      success: true,
      message: `Successfully deleted ${result.count} history entries.`
    });
  } catch (error) {
    console.error('Clear history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear history.'
    });
  }
};

// Get history statistics
export const getHistoryStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [totalExecutions, algorithmCounts] = await Promise.all([
      prisma.executionHistory.count({
        where: { userId }
      }),
      prisma.executionHistory.groupBy({
        by: ['algorithmType'],
        where: { userId },
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        }
      })
    ]);

    const recentActivity = await prisma.executionHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        algorithmName: true,
        createdAt: true,
        executionTime: true
      }
    });

    res.json({
      success: true,
      data: {
        totalExecutions,
        algorithmCounts,
        recentActivity
      }
    });
  } catch (error) {
    console.error('Get history stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch history statistics.'
    });
  }
};
