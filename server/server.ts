import express from 'express';
import cors from 'cors';
import path from 'path';
import { apiReference } from '@scalar/express-api-reference';
import documentsRouter from './routes/documents';
import teamsRouter from './routes/teams';
import organizationsRouter from './routes/organizations';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Vite default port and alternative
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Documentation with Scalar
app.use(
  '/api/docs',
  apiReference({
    spec: {
      url: '/openapi.yaml',
    },
    theme: 'purple',
    layout: 'modern',
    darkMode: true,
    defaultHttpClient: {
      targetKey: 'javascript',
      clientKey: 'fetch',
    },
  })
);

// Serve OpenAPI spec
app.get('/openapi.yaml', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'openapi.yaml'));
});

// Routes
app.use('/api/documents', documentsRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/organizations', organizationsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation at http://localhost:${PORT}/api/docs`);
  console.log(`📝 Documents API: http://localhost:${PORT}/api/documents`);
  console.log(`👥 Teams API: http://localhost:${PORT}/api/teams`);
  console.log(`🏢 Organizations API: http://localhost:${PORT}/api/organizations`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});

export default app;
