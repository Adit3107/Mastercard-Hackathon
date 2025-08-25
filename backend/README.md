# NGO Platform Backend

A Node.js/Express backend for the NGO platform with Clerk authentication, MongoDB database, and comprehensive user management.

## Features

- **Clerk Authentication Integration**: Secure user authentication with JWT tokens
- **MongoDB Database**: User data storage with Mongoose ODM
- **User Management**: Complete CRUD operations for users
- **Role-based Access**: Donor and NGO user types with different permissions
- **NGO Verification System**: Admin-controlled NGO verification process
- **Webhook Support**: Clerk webhook integration for real-time user updates
- **Error Handling**: Comprehensive error handling and logging
- **API Documentation**: RESTful API with proper status codes and responses

## Project Structure

```
backend/
├── config/
│   ├── database.js      # MongoDB connection configuration
│   └── clerk.js         # Clerk authentication configuration
├── controllers/
│   ├── authController.js # Authentication operations
│   └── userController.js # User management operations
├── middleware/
│   ├── auth.js          # Authentication middleware
│   └── errorHandler.js  # Error handling middleware
├── models/
│   └── User.js          # User data model
├── routes/
│   ├── auth.js          # Authentication routes
│   └── users.js         # User management routes
├── server.js            # Main application file
└── package.json
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- Clerk account and API keys

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   CLERK_SECRET_KEY=your_clerk_secret_key
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/signup` | Create new user account | Public |
| POST | `/signin` | User sign in | Public |
| GET | `/profile` | Get user profile | Private |
| PUT | `/profile` | Update user profile | Private |
| PUT | `/verify-email` | Update email verification status | Private |
| DELETE | `/account` | Delete user account | Private |
| POST | `/webhook` | Clerk webhook handler | Public |

### User Management Routes (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/ngos` | Get all NGOs | Public |
| GET | `/ngos/verified` | Get verified NGOs only | Public |
| GET | `/ngos/:id` | Get specific NGO | Public |
| GET | `/search` | Search users | Public |
| GET | `/:id` | Get user by ID | Private |
| GET | `/` | Get all users (admin) | Admin |
| GET | `/stats` | Get user statistics | Admin |
| PUT | `/ngos/:id/verify` | Verify/unverify NGO | Admin |
| PUT | `/:id/status` | Update user status | Admin |

## User Model

The User model includes:

### Basic Information
- `clerkId`: Clerk user ID (unique)
- `firstName`, `lastName`: User name
- `email`: Email address (unique)
- `userType`: 'donor' or 'ngo'
- `emailVerified`: Email verification status

### Profile Information
- `profile`: Phone, address, avatar, bio
- `lastLogin`: Last login timestamp
- `lastActivity`: Last activity timestamp
- `isActive`: Account status

### NGO-specific Fields
- `ngoDetails`: Organization information
  - `organizationName`: NGO name
  - `registrationNumber`: Legal registration
  - `website`: Organization website
  - `mission`: NGO mission statement
  - `category`: NGO category
  - `verified`: Verification status
  - `documents`: Uploaded documents

### Donor-specific Fields
- `donorDetails`: Donor preferences
  - `preferredCategories`: Preferred NGO categories
  - `totalDonations`: Total donation amount
  - `anonymousDonations`: Anonymous donation preference

## Authentication Flow

1. **User signs up** through Clerk frontend
2. **Clerk webhook** sends user data to backend
3. **Backend creates** user record in MongoDB
4. **User signs in** with Clerk credentials
5. **Backend verifies** Clerk JWT token
6. **User accesses** protected routes with token

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port | No (default: 5000) |
| `MONGO_URI` | MongoDB connection string | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key for JWT verification | Yes |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key | Yes |

## Available Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm test`: Run tests (not implemented yet)

## Error Handling

The application includes comprehensive error handling:

- **Validation Errors**: Mongoose validation errors
- **Authentication Errors**: JWT verification failures
- **Database Errors**: MongoDB connection issues
- **Not Found Errors**: 404 for undefined routes
- **Custom Error Messages**: User-friendly error responses

## Security Features

- **JWT Token Verification**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for different user types
- **Input Validation**: Request data validation
- **CORS Configuration**: Cross-origin resource sharing setup
- **Environment Variables**: Secure configuration management

## Database Indexes

The User model includes optimized indexes for:
- `clerkId` (unique)
- `email` (unique)
- `userType` and `email` (compound)
- `ngoDetails.verified` (for NGO queries)
- `createdAt` (for sorting)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
