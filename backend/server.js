import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import api from './routes/api.js';
import { notFound, errorHandler } from './middleware/errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from backend directory first, then root if present
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}

const app = express();

// Security headers (relaxed CSP so React SPA and Vite assets load without issues)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration: support single origin, comma-separated list, or allow all if not set
const allowedOrigin = process.env.CLIENT_URL;
app.use(
  cors({
    origin: allowedOrigin
      ? allowedOrigin.includes(',')
        ? allowedOrigin.split(',').map((s) => s.trim())
        : allowedOrigin
      : true,
    credentials: true,
  })
);

app.use(express.json({ limit: '100kb' }));

// Rate limiter for API routes
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Health check endpoint (for Render and uptime monitoring)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main API routes
app.use('/api', api);

// Serve frontend static build if it exists (Render unified deployment / production)
const distPath = path.resolve(__dirname, '../frontend/dist');
const altDistPath = path.resolve(process.cwd(), 'frontend/dist');
const finalDistPath = fs.existsSync(distPath)
  ? distPath
  : fs.existsSync(altDistPath)
  ? altDistPath
  : null;

if (finalDistPath) {
  console.log(`Serving frontend static files from: ${finalDistPath}`);
  app.use(express.static(finalDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(finalDistPath, 'index.html'));
  });
} else {
  console.warn(`WARNING: Frontend build folder not found at ${distPath} or ${altDistPath}`);
  app.get('/', (req, res) => {
    res.send(`
      <div style="font-family:sans-serif;text-align:center;padding:50px;">
        <h2>CareerPilot API is Running!</h2>
        <p>Frontend production build was not found. Please ensure the build command <code>npm run build</code> completed.</p>
        <p><a href="/api/health">Check API Health</a></p>
      </div>
    `);
  });
}

// 404 and Error handling
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`CareerPilot API listening on port ${port}`);
    });
  })
  .catch((e) => {
    console.error('Failed to connect to database:', e.message);
    process.exit(1);
  });
