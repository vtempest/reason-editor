# Document Management API

A REST API for managing hierarchical documents with full CRUD operations.

## Getting Started

### Installation

```bash
npm install
```

### Running the API Server

```bash
# Start the server (production mode)
npm run server

# Start with auto-reload (development mode)
npm run server:watch
```

The API will be available at `http://localhost:3001/api`

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
PORT=3001
VITE_API_URL=http://localhost:3001/api
```

## API Endpoints

### Base URL

```
http://localhost:3001/api
```

### Documents

#### Get All Documents

```http
GET /documents
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Welcome",
      "content": "# Welcome to the Note App",
      "parentId": null,
      "isExpanded": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Single Document

```http
GET /documents/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Welcome",
    "content": "# Welcome",
    "parentId": null,
    "isExpanded": true
  }
}
```

#### Create Document

```http
POST /documents
```

**Request Body:**
```json
{
  "title": "New Document",
  "content": "Document content",
  "parentId": null
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1234567890",
    "title": "New Document",
    "content": "Document content",
    "parentId": null,
    "isExpanded": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update Document

```http
PUT /documents/:id
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "isExpanded": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Updated Title",
    "content": "Updated content",
    "parentId": null,
    "isExpanded": true,
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Delete Document

Deletes a document and all its children recursively.

```http
DELETE /documents/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1"
  }
}
```

#### Duplicate Document

Creates a copy of a document (without children).

```http
POST /documents/:id/duplicate
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1234567890",
    "title": "Document Title (Copy)",
    "content": "Original content",
    "parentId": null,
    "isExpanded": false
  }
}
```

#### Move Document

Moves a document to a new position in the tree.

```http
POST /documents/move
```

**Request Body:**
```json
{
  "draggedId": "123",
  "targetId": "456",
  "position": "child"
}
```

**Positions:**
- `before`: Insert before the target
- `after`: Insert after the target
- `child`: Make it a child of the target

**Response:**
```json
{
  "success": true,
  "data": {
    "draggedId": "123",
    "targetId": "456",
    "position": "child"
  }
}
```

#### Search Documents

Search documents by title or content.

```http
GET /documents/search/:query
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Welcome",
      "content": "Welcome to the app",
      "parentId": null
    }
  ]
}
```

#### Bulk Update

Sync all documents from client to server.

```http
POST /documents/bulk
```

**Request Body:**
```json
{
  "documents": [
    {
      "id": "1",
      "title": "Document 1",
      "content": "Content",
      "parentId": null
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": [...]
}
```

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Client Usage

The frontend includes a pre-configured API client at `src/lib/api.ts`:

```typescript
import { documentsApi } from '@/lib/api';

// Get all documents
const documents = await documentsApi.getAll();

// Create a document
const newDoc = await documentsApi.create({
  title: 'New Note',
  content: '# Hello',
  parentId: null
});

// Update a document
await documentsApi.update('123', {
  title: 'Updated Title'
});

// Delete a document
await documentsApi.delete('123');

// Duplicate a document
const copy = await documentsApi.duplicate('123');

// Move a document
await documentsApi.move('123', '456', 'child');

// Search
const results = await documentsApi.search('query');
```

## Running Both Frontend and Backend

```bash
# Terminal 1 - Start the API server
npm run server:watch

# Terminal 2 - Start the Vite dev server
npm run dev
```

The frontend will be at `http://localhost:5173` and API at `http://localhost:3001`
