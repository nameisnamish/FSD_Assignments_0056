const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, (request, response) => {
  response.json({
    success: true,
    data: { user: request.user },
  });
});

router.get('/admin', authenticate, requireRole('admin'), (request, response) => {
  response.json({
    success: true,
    message: 'Admin-only profile route accessed successfully.',
    data: { user: request.user },
  });
});

module.exports = router;
