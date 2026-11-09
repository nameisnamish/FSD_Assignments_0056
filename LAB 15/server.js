require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

const requiredEnvironment = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvironment = requiredEnvironment.filter((key) => !process.env[key]);

if (missingEnvironment.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvironment.join(', ')}`);
}

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

app.get('/api/health', (request, response) => {
  response.json({ success: true, message: 'Authentication API is running.' });
});

app.use((request, response) => {
  response.status(404).json({ success: false, message: 'Endpoint not found.' });
});

app.use((error, request, response, next) => {
  if (error instanceof SyntaxError && error.status === 400 && error.type === 'entity.parse.failed') {
    return response.status(400).json({
      success: false,
      message: 'Request body must be valid JSON.',
    });
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({
      success: false,
      message: Object.values(error.errors).map((item) => item.message).join(', '),
    });
  }

  console.error(error);
  return response.status(500).json({
    success: false,
    message: 'Internal server error.',
  });
});

async function startServer() {
  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, () => {
    console.log(`Authentication API running at http://localhost:${port}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Unable to start authentication API:', error);
    process.exitCode = 1;
  });
}

module.exports = { app, startServer };
