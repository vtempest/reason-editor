import { Router, Request, Response } from 'express';
import { ApiResponse } from '../types';

const router = Router();

// In-memory storage for teams (replace with database in production)
let teams: any[] = [
  {
    id: '1',
    name: 'General',
    description: 'Default team for collaboration',
    members: [
      {
        id: '1',
        name: 'You',
        email: 'you@example.com',
        role: 'owner',
        joinedAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Get all teams
router.get('/', (req: Request, res: Response) => {
  try {
    const response: ApiResponse = {
      success: true,
      data: teams,
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch teams',
    };
    res.status(500).json(response);
  }
});

// Get a single team by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const team = teams.find((t) => t.id === id);

    if (!team) {
      const response: ApiResponse = {
        success: false,
        error: 'Team not found',
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      data: team,
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch team',
    };
    res.status(500).json(response);
  }
});

// Create a new team
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, description, organizationId } = req.body;

    if (!name || !organizationId) {
      const response: ApiResponse = {
        success: false,
        error: 'name and organizationId are required',
      };
      return res.status(400).json(response);
    }

    const newTeam = {
      id: Date.now().toString(),
      name,
      description: description || '',
      members: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    teams.push(newTeam);

    const response: ApiResponse = {
      success: true,
      data: newTeam,
    };
    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create team',
    };
    res.status(500).json(response);
  }
});

// Update a team
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const teamIndex = teams.findIndex((t) => t.id === id);

    if (teamIndex === -1) {
      const response: ApiResponse = {
        success: false,
        error: 'Team not found',
      };
      return res.status(404).json(response);
    }

    teams[teamIndex] = {
      ...teams[teamIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const response: ApiResponse = {
      success: true,
      data: teams[teamIndex],
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update team',
    };
    res.status(500).json(response);
  }
});

// Delete a team
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const teamIndex = teams.findIndex((t) => t.id === id);

    if (teamIndex === -1) {
      const response: ApiResponse = {
        success: false,
        error: 'Team not found',
      };
      return res.status(404).json(response);
    }

    teams.splice(teamIndex, 1);

    const response: ApiResponse = {
      success: true,
      data: { id },
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete team',
    };
    res.status(500).json(response);
  }
});

// Add a member to a team
router.post('/:id/members', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, role } = req.body;

    if (!email || !role) {
      const response: ApiResponse = {
        success: false,
        error: 'email and role are required',
      };
      return res.status(400).json(response);
    }

    const teamIndex = teams.findIndex((t) => t.id === id);

    if (teamIndex === -1) {
      const response: ApiResponse = {
        success: false,
        error: 'Team not found',
      };
      return res.status(404).json(response);
    }

    const newMember = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      role,
      joinedAt: new Date().toISOString(),
    };

    teams[teamIndex].members.push(newMember);
    teams[teamIndex].updatedAt = new Date().toISOString();

    const response: ApiResponse = {
      success: true,
      data: newMember,
    };
    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add member',
    };
    res.status(500).json(response);
  }
});

// Remove a member from a team
router.delete('/:id/members/:memberId', (req: Request, res: Response) => {
  try {
    const { id, memberId } = req.params;

    const teamIndex = teams.findIndex((t) => t.id === id);

    if (teamIndex === -1) {
      const response: ApiResponse = {
        success: false,
        error: 'Team not found',
      };
      return res.status(404).json(response);
    }

    const memberIndex = teams[teamIndex].members.findIndex(
      (m: any) => m.id === memberId
    );

    if (memberIndex === -1) {
      const response: ApiResponse = {
        success: false,
        error: 'Member not found',
      };
      return res.status(404).json(response);
    }

    teams[teamIndex].members.splice(memberIndex, 1);
    teams[teamIndex].updatedAt = new Date().toISOString();

    const response: ApiResponse = {
      success: true,
      data: { id: memberId },
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove member',
    };
    res.status(500).json(response);
  }
});

// Update a member's role
router.put('/:id/members/:memberId', (req: Request, res: Response) => {
  try {
    const { id, memberId } = req.params;
    const { role } = req.body;

    if (!role) {
      const response: ApiResponse = {
        success: false,
        error: 'role is required',
      };
      return res.status(400).json(response);
    }

    const teamIndex = teams.findIndex((t) => t.id === id);

    if (teamIndex === -1) {
      const response: ApiResponse = {
        success: false,
        error: 'Team not found',
      };
      return res.status(404).json(response);
    }

    const memberIndex = teams[teamIndex].members.findIndex(
      (m: any) => m.id === memberId
    );

    if (memberIndex === -1) {
      const response: ApiResponse = {
        success: false,
        error: 'Member not found',
      };
      return res.status(404).json(response);
    }

    teams[teamIndex].members[memberIndex].role = role;
    teams[teamIndex].updatedAt = new Date().toISOString();

    const response: ApiResponse = {
      success: true,
      data: teams[teamIndex].members[memberIndex],
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update member role',
    };
    res.status(500).json(response);
  }
});

export default router;
