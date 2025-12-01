import { Router, Request, Response } from 'express';
import { ApiResponse } from '../types';

const router = Router();

// In-memory storage for organizations (replace with database in production)
let organizations: any[] = [
  {
    id: '1',
    name: 'My Organization',
    slug: 'my-org',
    description: 'Your personal workspace',
    teams: [
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
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Get all organizations
router.get('/', (req: Request, res: Response) => {
  try {
    const response: ApiResponse = {
      success: true,
      data: organizations,
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch organizations',
    };
    res.status(500).json(response);
  }
});

// Get a single organization by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organization = organizations.find((o) => o.id === id);

    if (!organization) {
      const response: ApiResponse = {
        success: false,
        error: 'Organization not found',
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      data: organization,
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch organization',
    };
    res.status(500).json(response);
  }
});

// Create a new organization
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, slug, description } = req.body;

    if (!name || !slug) {
      const response: ApiResponse = {
        success: false,
        error: 'name and slug are required',
      };
      return res.status(400).json(response);
    }

    const newOrganization = {
      id: Date.now().toString(),
      name,
      slug,
      description: description || '',
      teams: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    organizations.push(newOrganization);

    const response: ApiResponse = {
      success: true,
      data: newOrganization,
    };
    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create organization',
    };
    res.status(500).json(response);
  }
});

// Update an organization
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const orgIndex = organizations.findIndex((o) => o.id === id);

    if (orgIndex === -1) {
      const response: ApiResponse = {
        success: false,
        error: 'Organization not found',
      };
      return res.status(404).json(response);
    }

    organizations[orgIndex] = {
      ...organizations[orgIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const response: ApiResponse = {
      success: true,
      data: organizations[orgIndex],
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update organization',
    };
    res.status(500).json(response);
  }
});

// Delete an organization
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const orgIndex = organizations.findIndex((o) => o.id === id);

    if (orgIndex === -1) {
      const response: ApiResponse = {
        success: false,
        error: 'Organization not found',
      };
      return res.status(404).json(response);
    }

    organizations.splice(orgIndex, 1);

    const response: ApiResponse = {
      success: true,
      data: { id },
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete organization',
    };
    res.status(500).json(response);
  }
});

export default router;
