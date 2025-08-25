# NGO Platform Frontend

A React-based frontend for an NGO platform with Clerk authentication, featuring separate user types for donors and NGOs.

## Features

- **Clerk Authentication**: Secure user authentication with email verification
- **Multi-User Types**: Support for both donors and NGOs
- **Protected Routes**: Secure access to authenticated content
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Clerk account and API keys

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Clerk

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application in your Clerk dashboard
3. Get your publishable key from the Clerk dashboard
4. Update the `CLERK_PUBLISHABLE_KEY` in `src/App.jsx`:

```javascript
const CLERK_PUBLISHABLE_KEY = 'pk_test_your-actual-publishable-key'
```

### 3. Configure Email Verification

In your Clerk dashboard:
1. Go to Email & SMS settings
2. Configure email templates for verification
3. Set up your email provider (SendGrid, SMTP, etc.)

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── CustomSignIn.jsx    # Custom sign-in component
│   │   └── CustomSignUp.jsx    # Custom sign-up component
│   └── ui/                     # shadcn/ui components
├── pages/
│   ├── LandingPage.jsx         # Public landing page
│   └── HomePage.jsx            # Protected home page
└── App.jsx                     # Main app with routing
```

## Authentication Flow

1. **Landing Page**: Public page for non-authenticated users
2. **Sign Up**: Custom form with name, email, password, and user type selection
3. **Email Verification**: Required verification step
4. **Sign In**: Email and password authentication
5. **Protected Home**: Dashboard for authenticated users

## User Types

- **Donor**: Can browse NGOs and make donations
- **NGO**: Can create profiles and receive donations

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your-publishable-key
```

## Deployment

1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Set up environment variables in your hosting platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
