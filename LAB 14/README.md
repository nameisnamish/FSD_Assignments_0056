# Mini User & Family Management System
**Full-Stack Assignment | Node.js + Express + EJS + MongoDB + Mongoose**

---

## 1. Project Overview
A full-stack Node.js and Express application utilizing EJS templating, MongoDB, and Mongoose for managing user profiles and their associated children with strict parent-child relational integrity, data validation, and resilient error handling.

---

## 2. Technologies Used
- **Node.js** (Runtime environment)
- **Express.js** (Web framework & REST API)
- **EJS** (Embedded JavaScript templating engine)
- **MongoDB** (NoSQL Database)
- **Mongoose** (Object Data Modeling library)
- **dotenv** (Environment variable management)
- **body-parser** (URL-encoded & JSON request body parser)
- **method-override** (RESTful PATCH & DELETE support in HTML forms)
- **Bootstrap 5 & Bootstrap Icons** (Responsive, modern UI)

---

## 3. Database Design

### User Model (`models/User.js`)
| Field | Type | Required | Description |
|---|---|---|---|
| `firstName` | String | Yes | User's first name (trimmed) |
| `lastName` | String | No | User's last name (trimmed) |
| `email` | String | Yes | User's email (unique/trimmed/lowercase) |
| `phone` | String | No | User's contact number |
| `createdAt` / `updatedAt` | Date | Auto | Timestamps |

### Child Model (`models/Child.js`)
| Field | Type | Required | Description |
|---|---|---|---|
| `firstName` | String | Yes | Child's first name (trimmed) |
| `lastName` | String | No | Child's last name (trimmed) |
| `age` | Number | Yes | Child's age (non-negative integer) |
| `email` | String | No | Child's email (trimmed/lowercase) |
| `parentId` | ObjectId | Yes | **Ref: User** (Stores MongoDB `_id` of parent) |
| `createdAt` / `updatedAt` | Date | Auto | Timestamps |

---

## 4. API & Web Routes

### Core API Routes
| Method | Route | Description |
|---|---|---|
| `POST` | `/users` | Create a new user in MongoDB |
| `GET` | `/users/:id` | Find user by ID and render profile using EJS |
| `POST` | `/users/:id/children` | Verify parent user and save child with `parentId` |
| `GET` | `/users/:id/children` | Return only children belonging to the specified user |
| `PATCH` | `/children/:id` | Update child details (`firstName`, `lastName`, `age`, `email`) |
| `DELETE` | `/children/:id` | Remove a child from MongoDB |

### Main Thinking Challenge Route
| Method | Route | Description |
|---|---|---|
| `GET` | `/users/:id/children/:childId` | Displays the child **only** if `child.parentId === user._id`. If the child belongs to another user, displays a 404 security message. |

### Bonus Challenge Routes
| Method | Route | Description |
|---|---|---|
| `GET` | `/users` | Display all registered users using EJS |
| `GET` | `/users/search/:name` | Search users by first name (case-insensitive regex) |
| `GET` | `/users/:id/children/count` | Return JSON with total number of children for a user |

---

## 5. Main Thinking Challenge Explained
The relationship validation verifies whether the requested child belongs to the requested parent:
```javascript
// Verification: compare child's parentId with user's _id
if (child.parentId.toString() !== user._id.toString()) {
  return res.status(404).json({
    success: false,
    message: `Child Not Found for this user: Child with ID ${childId} does not belong to User ${user.firstName} (ID: ${user._id})`
  });
}
```
If User A (e.g. Danish) attempts to request Child B (belonging to Sonu), the relationship check fails and a 404 status is returned.

---

## 6. Error Handling & Validation
- **Invalid MongoDB ObjectIDs**: Safe checks using `mongoose.Types.ObjectId.isValid(id)` prevent application crashes.
- **User Not Found**: Renders `views/404.html` or returns 404 JSON for non-existent users.
- **Child Not Found**: Returns 404 error response if child ID does not exist.
- **Empty Children List**: Displays friendly message *"No children found for this user."* when a user has no children.
- **Validation**: Enforces required fields (`firstName`, `email` for users; `firstName`, `age` for children).
- **Server Errors**: 500 error middleware catches unhandled exceptions.

---

## 7. Setup & Run Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
MONGODB_URL=your_mongodb_connection_string
PORT=3000
```

### 3. Start the Server
```bash
npm start
```
Visit: [http://localhost:3000](http://localhost:3000)

---

## 8. Submission Checklist Verification
- [x] MongoDB connection working via `.env`
- [x] User creation working (`POST /users`)
- [x] User profile page working (`GET /users/:id`)
- [x] Child creation working with `parentId` (`POST /users/:id/children`)
- [x] Children filtered strictly by `parentId` (`GET /users/:id/children`)
- [x] Child update working (`PATCH /children/:id`)
- [x] Child deletion working (`DELETE /children/:id`)
- [x] Custom 404 page working (`views/404.html`)
- [x] Field validation implemented (required email, required age, no empty fields)
- [x] Safe ObjectId validation prevents app crashes
- [x] Main Thinking Challenge implemented (`GET /users/:id/children/:childId`)
- [x] All Bonus Challenges implemented (Directory, Search, Child count)
