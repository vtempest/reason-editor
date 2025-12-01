# Yana API Documentation

A comprehensive REST API for the Yana note-taking application with full OpenAPI 3.0 specification and interactive Scalar UI documentation.

## 🚀 Quick Start

### Start the API Server

```bash
npm run server
```

The server will start on `http://localhost:3001`

### View Interactive API Documentation

Once the server is running, visit:

**📚 [http://localhost:3001/api/docs](http://localhost:3001/api/docs)**

This provides a beautiful, interactive API documentation powered by Scalar UI where you can:
- Browse all available endpoints
- View request/response schemas
- Try out API calls directly from the browser
- See example requests and responses
- Copy code snippets in multiple languages

## 📋 API Overview

### Base URL
```
http://localhost:3001
```

### Available Resources

#### 1. Documents API (`/api/documents`)
Manage hierarchical note documents with full CRUD operations.

**Endpoints:**
- `GET /api/documents` - Get all documents
- `GET /api/documents/:id` - Get a specific document
- `POST /api/documents` - Create a new document
- `PUT /api/documents/:id` - Update a document
- `DELETE /api/documents/:id` - Delete a document
- `POST /api/documents/:id/duplicate` - Duplicate a document
- `POST /api/documents/move` - Move a document in the hierarchy
- `GET /api/documents/search/:query` - Search documents
- `POST /api/documents/bulk` - Bulk update documents

#### 2. Teams API (`/api/teams`)
Manage teams and team members for collaboration.

**Endpoints:**
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get a specific team
- `POST /api/teams` - Create a new team
- `PUT /api/teams/:id` - Update a team
- `DELETE /api/teams/:id` - Delete a team
- `POST /api/teams/:id/members` - Add a member to a team
- `DELETE /api/teams/:id/members/:memberId` - Remove a member
- `PUT /api/teams/:id/members/:memberId` - Update member role

#### 3. Organizations API (`/api/organizations`)
Manage organizations that contain teams.

**Endpoints:**
- `GET /api/organizations` - Get all organizations
- `GET /api/organizations/:id` - Get a specific organization
- `POST /api/organizations` - Create a new organization
- `PUT /api/organizations/:id` - Update an organization
- `DELETE /api/organizations/:id` - Delete an organization

#### 4. Health Check (`/health`)
Check API server status.

**Endpoint:**
- `GET /health` - Returns server health status

## 🔧 Example Requests

### Create a Document

```bash
curl -X POST http://localhost:3001/api/documents \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Note",
    "content": "<p>This is my note content</p>",
    "parentId": null
  }'
```

### Search Documents

```bash
curl http://localhost:3001/api/documents/search/meeting
```

### Create a Team

```bash
curl -X POST http://localhost:3001/api/teams \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Engineering Team",
    "description": "Team for engineering collaboration",
    "organizationId": "1"
  }'
```

### Add a Team Member

```bash
curl -X POST http://localhost:3001/api/teams/1/members \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "role": "member"
  }'
```

## 📖 Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message here"
}
```

## 🎨 Data Models

### Document
```typescript
{
  id: string;
  title: string;
  content: string;  // HTML content
  parentId: string | null;
  children?: Document[];
  isExpanded?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
```

### Team
```typescript
{
  id: string;
  name: string;
  description?: string;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
}
```

### TeamMember
```typescript
{
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  avatarUrl?: string;
  joinedAt: string;
}
```

### Organization
```typescript
{
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  teams: Team[];
  createdAt: string;
  updatedAt: string;
}
```

## 🔐 Authentication

> **Note:** Authentication is not yet implemented. This is a local development API.
> In production, you would add JWT or session-based authentication.

## 🛠️ Development

### View OpenAPI Specification

The raw OpenAPI spec is available at:
```
http://localhost:3001/openapi.yaml
```

### Modify the API

1. **Add new endpoints**: Edit files in `server/routes/`
2. **Update the spec**: Edit `openapi.yaml`
3. **Restart the server**: The Scalar UI will automatically reflect changes

### Tech Stack

- **Framework**: Express.js
- **Documentation**: OpenAPI 3.0 + Scalar UI
- **Language**: TypeScript
- **Storage**: In-memory (replace with database in production)

## 📝 Features

- ✅ Full OpenAPI 3.0 specification
- ✅ Interactive API documentation with Scalar UI
- ✅ RESTful endpoint design
- ✅ Hierarchical document structure
- ✅ Team and organization management
- ✅ Full-text search
- ✅ Bulk operations
- ✅ CORS enabled for frontend integration
- ✅ Request/response logging
- ✅ Consistent error handling

## 🌐 Integration with Frontend

The API is configured to work with the Vite development server:

```javascript
// CORS origins
['http://localhost:5173', 'http://localhost:3000']
```

To use the API in your frontend:

```javascript
const response = await fetch('http://localhost:3001/api/documents');
const { success, data } = await response.json();

if (success) {
  console.log('Documents:', data);
}
```

## 📚 Additional Resources

- [OpenAPI Specification](https://swagger.io/specification/)
- [Scalar UI Documentation](https://github.com/scalar/scalar)
- [Express.js Documentation](https://expressjs.com/)

---

For more details, visit the interactive documentation at [http://localhost:3001/api/docs](http://localhost:3001/api/docs)
