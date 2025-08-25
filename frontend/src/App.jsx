import { ClerkProvider, SignIn, SignUp, SignedIn, SignedOut, useUser } from '@clerk/clerk-react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import CustomSignIn from './components/auth/CustomSignIn'
import CustomSignUp from './components/auth/CustomSignUp'

// Get Clerk publishable key from environment variables
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_your-clerk-publishable-key'

function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useUser()
  
  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }
  
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />
  }
  
  return children
}

function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              <>
                <SignedOut>
                  <LandingPage />
                </SignedOut>
                <SignedIn>
                  <Navigate to="/home" replace />
                </SignedIn>
              </>
            } />
            
            <Route path="/sign-in" element={
              <>
                <SignedOut>
                  <CustomSignIn />
                </SignedOut>
                <SignedIn>
                  <Navigate to="/home" replace />
                </SignedIn>
              </>
            } />
            
            <Route path="/sign-up" element={
              <>
                <SignedOut>
                  <CustomSignUp />
                </SignedOut>
                <SignedIn>
                  <Navigate to="/home" replace />
                </SignedIn>
              </>
            } />
            
            {/* Protected routes */}
            <Route path="/home" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </ClerkProvider>
  )
}

export default App
