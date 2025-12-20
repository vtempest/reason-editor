import { TreeItemData } from './types';

export const sampleTreeData: TreeItemData = {
  id: 'root',
  name: 'Root',
  isFolder: true,
  isOpen: true,
  children: [
    {
      id: '1',
      name: 'Getting Started',
      isFolder: true,
      isOpen: true,
      children: [
        {
          id: '1-1',
          name: 'Introduction.md',
          isFolder: false,
        },
        {
          id: '1-2',
          name: 'Quick Start Guide.md',
          isFolder: false,
        },
      ],
    },
    {
      id: '2',
      name: 'Projects',
      isFolder: true,
      isOpen: false,
      children: [
        {
          id: '2-1',
          name: 'Project Alpha',
          isFolder: true,
          isOpen: false,
          children: [
            {
              id: '2-1-1',
              name: 'Overview.md',
              isFolder: false,
            },
            {
              id: '2-1-2',
              name: 'Tasks.md',
              isFolder: false,
            },
          ],
        },
        {
          id: '2-2',
          name: 'Project Beta',
          isFolder: true,
          isOpen: false,
          children: [
            {
              id: '2-2-1',
              name: 'Requirements.md',
              isFolder: false,
            },
          ],
        },
      ],
    },
    {
      id: '3',
      name: 'Notes',
      isFolder: true,
      isOpen: false,
      children: [
        {
          id: '3-1',
          name: 'Meeting Notes.md',
          isFolder: false,
        },
        {
          id: '3-2',
          name: 'Ideas.md',
          isFolder: false,
        },
      ],
    },
    {
      id: '4',
      name: 'Archive',
      isFolder: true,
      isOpen: false,
      children: [],
    },
    {
      id: '5',
      name: 'README.md',
      isFolder: false,
    },
  ],
};
