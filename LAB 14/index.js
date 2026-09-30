const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Import Mongoose Models
const User = require('./models/User');
const Child = require('./models/Child');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL;

// Middleware configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Method Override Middleware — reads _method from BOTH query string AND body
// This ensures DELETE/PATCH work correctly from HTML forms
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body['_method'];
    delete req.body['_method'];
    return method;
  }
  if (req.query && req.query['_method']) {
    return req.query['_method'];
  }
}));

// Helper function to check if request prefers JSON (API clients like Postman/curl)
const isApiRequest = (req) => {
  return (
    req.xhr ||
    (req.headers.accept && req.headers.accept.includes('application/json')) ||
    (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) ||
    req.query.format === 'json'
  );
};

// Helper function to safely send 404
const send404 = (res, req, message = 'Resource Not Found') => {
  if (isApiRequest(req)) {
    return res.status(404).json({ success: false, message });
  }
  return res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
};

// ==========================================
// ROUTES
// ==========================================

// Root redirect to /users
app.get('/', (req, res) => {
  res.redirect('/users');
});

// ------------------------------------------
// 10. BONUS: GET /users — Display all users using EJS
// ------------------------------------------
app.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    // Aggregate child counts for each user
    const childCounts = await Child.aggregate([
      { $group: { _id: '$parentId', count: { $sum: 1 } } },
    ]);

    const childCountMap = {};
    childCounts.forEach((item) => {
      childCountMap[item._id.toString()] = item.count;
    });

    if (isApiRequest(req)) {
      return res.status(200).json({
        success: true,
        count: users.length,
        users: users.map((u) => ({
          ...u.toObject(),
          childCount: childCountMap[u._id.toString()] || 0,
        })),
      });
    }

    res.render('users', { users, childCountMap });
  } catch (error) {
    console.error('Error in GET /users:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving users', error: error.message });
  }
});

// ------------------------------------------
// 10. BONUS: GET /users/search/:name — Search users by first name
// ------------------------------------------
app.get('/users/search/:name', async (req, res) => {
  try {
    const { name } = req.params;
    if (!name || name.trim() === '') {
      return res.redirect('/users');
    }

    const regex = new RegExp(name.trim(), 'i'); // Case-insensitive search
    const users = await User.find({ firstName: regex }).sort({ createdAt: -1 });

    const childCounts = await Child.aggregate([
      { $group: { _id: '$parentId', count: { $sum: 1 } } },
    ]);

    const childCountMap = {};
    childCounts.forEach((item) => {
      childCountMap[item._id.toString()] = item.count;
    });

    if (isApiRequest(req)) {
      return res.status(200).json({
        success: true,
        searchQuery: name,
        count: users.length,
        users,
      });
    }

    res.render('users', { users, childCountMap, searchQuery: name });
  } catch (error) {
    console.error('Error in GET /users/search/:name:', error);
    res.status(500).json({ success: false, message: 'Server error searching users', error: error.message });
  }
});

// ------------------------------------------
// 5. POST /users — Create a new user
// ------------------------------------------
app.post('/users', async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    // Validation Requirements
    if (!firstName || firstName.trim() === '') {
      return res.status(400).json({ success: false, message: 'First name is required and cannot be empty' });
    }
    if (!email || email.trim() === '') {
      return res.status(400).json({ success: false, message: 'User email is required and cannot be empty' });
    }

    const newUser = await User.create({
      firstName: firstName.trim(),
      lastName: lastName ? lastName.trim() : '',
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
    });

    if (isApiRequest(req)) {
      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: newUser,
      });
    }

    // For browser HTML form submissions, redirect to the new user's profile
    res.redirect(`/users/${newUser._id}`);
  } catch (error) {
    console.error('Error in POST /users:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Server error creating user', error: error.message });
  }
});

// Helper GET route to render add-child form page
app.get('/users/:id/add-child', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return send404(res, req, 'Invalid User ID format');
    }
    const user = await User.findById(id);
    if (!user) {
      return send404(res, req, 'User ID does not exist');
    }
    res.render('add-child', { user });
  } catch (error) {
    console.error('Error in GET /users/:id/add-child:', error);
    res.status(500).json({ success: false, message: 'Server error loading add child page' });
  }
});

// ------------------------------------------
// 10. BONUS: GET /users/:id/children/count — Return number of children belonging to user
// ------------------------------------------
app.get('/users/:id/children/count', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid User ID format' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User ID does not exist' });
    }

    const count = await Child.countDocuments({ parentId: id });
    return res.status(200).json({
      success: true,
      userId: id,
      userName: `${user.firstName} ${user.lastName}`.trim(),
      childCount: count,
    });
  } catch (error) {
    console.error('Error in GET /users/:id/children/count:', error);
    res.status(500).json({ success: false, message: 'Server error counting children', error: error.message });
  }
});

// ------------------------------------------
// 9. MAIN THINKING CHALLENGE:
// GET /users/:id/children/:childId
// Display child only when child actually belongs to the requested user!
// ------------------------------------------
app.get('/users/:id/children/:childId', async (req, res) => {
  try {
    const { id, childId } = req.params;

    // Validate MongoDB IDs safely to prevent app crash
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return send404(res, req, 'Invalid User ID format');
    }
    if (!mongoose.Types.ObjectId.isValid(childId)) {
      return res.status(404).json({ success: false, message: 'Child Not Found: Invalid Child ID format' });
    }

    // Find parent user
    const user = await User.findById(id);
    if (!user) {
      return send404(res, req, 'User ID does not exist');
    }

    // Find child
    const child = await Child.findById(childId);
    if (!child) {
      return res.status(404).json({ success: false, message: 'Child Not Found' });
    }

    // Verification check: does child.parentId match requested user._id?
    if (child.parentId.toString() !== user._id.toString()) {
      return res.status(404).json({
        success: false,
        message: `Child Not Found for this user: Child with ID ${childId} does not belong to User ${user.firstName} (ID: ${user._id})`,
      });
    }

    if (isApiRequest(req)) {
      return res.status(200).json({
        success: true,
        message: 'Child verified and belongs to user',
        user,
        child,
      });
    }

    res.render('child', { user, child });
  } catch (error) {
    console.error('Error in GET /users/:id/children/:childId:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving child', error: error.message });
  }
});

// ------------------------------------------
// 5. POST /users/:id/children — Add child with parentId
// ------------------------------------------
app.post('/users/:id/children', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return send404(res, req, 'Invalid User ID format');
    }

    // Check that parent user exists in MongoDB
    const parentUser = await User.findById(id);
    if (!parentUser) {
      return res.status(404).json({
        success: false,
        message: 'Parent user does not exist. A child can only be created for an existing user.',
      });
    }

    const { firstName, lastName, age, email } = req.body;

    // Validation Requirements
    if (!firstName || firstName.trim() === '') {
      return res.status(400).json({ success: false, message: 'Child first name is required' });
    }
    if (age === undefined || age === null || age === '' || isNaN(age)) {
      return res.status(400).json({ success: false, message: 'Child age is required and must be a valid number' });
    }
    if (Number(age) < 0) {
      return res.status(400).json({ success: false, message: 'Child age must be a positive number' });
    }

    // Save child with parentId storing the parent's MongoDB _id
    const newChild = await Child.create({
      firstName: firstName.trim(),
      lastName: lastName ? lastName.trim() : '',
      age: Number(age),
      email: email ? email.trim().toLowerCase() : '',
      parentId: parentUser._id,
    });

    if (isApiRequest(req)) {
      return res.status(201).json({
        success: true,
        message: 'Child created successfully',
        child: newChild,
      });
    }

    // Redirect to parent user's profile page
    res.redirect(`/users/${parentUser._id}`);
  } catch (error) {
    console.error('Error in POST /users/:id/children:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Server error creating child', error: error.message });
  }
});

// ------------------------------------------
// 5. GET /users/:id/children — Return/display only children belonging to user
// ------------------------------------------
app.get('/users/:id/children', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return send404(res, req, 'Invalid User ID format');
    }

    const user = await User.findById(id);
    if (!user) {
      return send404(res, req, 'User ID does not exist');
    }

    // Filter children strictly by parentId
    const children = await Child.find({ parentId: id }).sort({ createdAt: -1 });

    if (isApiRequest(req)) {
      return res.status(200).json({
        success: true,
        userId: user._id,
        count: children.length,
        children,
      });
    }

    res.render('children-list', { user, children });
  } catch (error) {
    console.error('Error in GET /users/:id/children:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving children', error: error.message });
  }
});

// ------------------------------------------
// 6. GET /users/:id — User Profile Page
// ------------------------------------------
app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Safe MongoDB ID validation to prevent crashes
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return send404(res, req, 'Invalid User ID format');
    }

    const user = await User.findById(id);
    if (!user) {
      return send404(res, req, 'User ID does not exist');
    }

    // Dynamically load children belonging to this user from MongoDB
    const children = await Child.find({ parentId: user._id }).sort({ createdAt: -1 });

    if (isApiRequest(req)) {
      return res.status(200).json({
        success: true,
        user,
        children,
      });
    }

    res.render('profile', { user, children });
  } catch (error) {
    console.error('Error in GET /users/:id:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving user profile', error: error.message });
  }
});

// Helper GET route to render edit child form
app.get('/children/:id/edit', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Child Not Found: Invalid ID' });
    }

    const child = await Child.findById(id);
    if (!child) {
      return res.status(404).json({ success: false, message: 'Child Not Found' });
    }

    res.render('edit-child', { child });
  } catch (error) {
    console.error('Error in GET /children/:id/edit:', error);
    res.status(500).json({ success: false, message: 'Server error loading edit child page' });
  }
});

// ------------------------------------------
// 5. PATCH /children/:id — Update child information
// ------------------------------------------
app.patch('/children/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Child Not Found: Invalid ID format' });
    }

    const child = await Child.findById(id);
    if (!child) {
      return res.status(404).json({ success: false, message: 'Child Not Found' });
    }

    const { firstName, lastName, age, email } = req.body;

    // Validation
    if (firstName !== undefined) {
      if (firstName.trim() === '') {
        return res.status(400).json({ success: false, message: 'First name cannot be empty' });
      }
      child.firstName = firstName.trim();
    }

    if (lastName !== undefined) {
      child.lastName = lastName.trim();
    }

    if (age !== undefined) {
      if (age === '' || isNaN(age) || Number(age) < 0) {
        return res.status(400).json({ success: false, message: 'Valid child age is required' });
      }
      child.age = Number(age);
    }

    if (email !== undefined) {
      child.email = email.trim().toLowerCase();
    }

    await child.save();

    if (isApiRequest(req)) {
      return res.status(200).json({
        success: true,
        message: 'Child updated successfully',
        child,
      });
    }

    // Redirect back to parent's profile page
    res.redirect(`/users/${child.parentId}`);
  } catch (error) {
    console.error('Error in PATCH /children/:id:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Server error updating child', error: error.message });
  }
});

// ------------------------------------------
// 5. DELETE /children/:id — Delete a child from MongoDB
// ------------------------------------------
app.delete('/children/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Child Not Found: Invalid ID format' });
    }

    const child = await Child.findById(id);
    if (!child) {
      return res.status(404).json({ success: false, message: 'Child Not Found' });
    }

    const parentId = child.parentId;
    await Child.findByIdAndDelete(id);

    if (isApiRequest(req)) {
      return res.status(200).json({
        success: true,
        message: 'Child deleted successfully',
        deletedChildId: id,
      });
    }

    // Redirect to parent profile if parentId is provided or found
    const redirectId = req.body.parentId || parentId;
    res.redirect(`/users/${redirectId}`);
  } catch (error) {
    console.error('Error in DELETE /children/:id:', error);
    res.status(500).json({ success: false, message: 'Server error deleting child', error: error.message });
  }
});

// ------------------------------------------
// DELETE /users/:id — Delete a user and all their children from MongoDB
// ------------------------------------------
const handleUserDelete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return send404(res, req, 'Invalid User ID format');
    }

    const user = await User.findById(id);
    if (!user) {
      return send404(res, req, 'User ID does not exist');
    }

    // Cascade delete: remove all children belonging to this user
    await Child.deleteMany({ parentId: id });
    await User.findByIdAndDelete(id);

    if (isApiRequest(req)) {
      return res.status(200).json({
        success: true,
        message: 'User and all associated children deleted successfully',
        deletedUserId: id,
      });
    }

    // Redirect to all users directory
    res.redirect('/users');
  } catch (error) {
    console.error('Error in deleting user:', error);
    res.status(500).json({ success: false, message: 'Server error deleting user', error: error.message });
  }
};

app.delete('/users/:id', handleUserDelete);
app.post('/users/:id/delete', handleUserDelete);
app.get('/users/:id/delete', handleUserDelete);

const handleChildDelete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Child Not Found: Invalid ID format' });
    }

    const child = await Child.findById(id);
    if (!child) {
      return res.status(404).json({ success: false, message: 'Child Not Found' });
    }

    const parentId = child.parentId;
    await Child.findByIdAndDelete(id);

    if (isApiRequest(req)) {
      return res.status(200).json({
        success: true,
        message: 'Child deleted successfully',
        deletedChildId: id,
      });
    }

    // Redirect to parent profile if parentId is provided or found
    const redirectId = req.body.parentId || parentId;
    res.redirect(`/users/${redirectId}`);
  } catch (error) {
    console.error('Error in deleting child:', error);
    res.status(500).json({ success: false, message: 'Server error deleting child', error: error.message });
  }
};

app.post('/children/:id/delete', handleChildDelete);
app.get('/children/:id/delete', handleChildDelete);

// ------------------------------------------
// 404 Handler for undefined routes
// ------------------------------------------
app.use((req, res) => {
  send404(res, req, 'Route Not Found');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid ID format' });
  }
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? null : err.message,
  });
});

// ==========================================
// START SERVER AND CONNECT TO MONGODB
// ==========================================
if (!MONGODB_URL) {
  console.error('ERROR: MONGODB_URL is not set in the .env file.');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log('Connected successfully to MongoDB Database!');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
  });

module.exports = app;
