import { useState } from 'react'
import { useSignUp } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

function CustomSignUp() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userType: 'donor' // 'donor' or 'ngo'
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [verificationSent, setVerificationSent] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!isLoaded) return

    try {
      // Start the sign-up process
      await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
      })

      // Trigger sending verification code
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      })

      setVerificationSent(true)
    } catch (err) {
      console.error('Error during sign up:', err)
      setError(err.errors?.[0]?.message || 'An error occurred during sign up')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerification = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // ⚡ Always re-check signUp object before verification
      if (!signUp) {
        throw new Error("No active sign-up session found. Please try again.")
      }

      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: e.target.code.value,
      })

      if (completeSignUp.status === 'complete') {
        // Update user profile with first and last name
        if (formData.firstName || formData.lastName) {
          try {
            await signUp.update({
              firstName: formData.firstName,
              lastName: formData.lastName,
            })
          } catch (updateErr) {
            console.log('Could not update name during signup:', updateErr)
          }
        }

        // Save user data to backend
        try {
          const token = await completeSignUp.createdSessionId
          const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              clerkId: completeSignUp.createdUserId,
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              userType: formData.userType
            })
          })

          if (!response.ok) {
            console.error('Failed to save user to backend:', await response.text())
          }
        } catch (backendErr) {
          console.error('Backend save error:', backendErr)
        }
        
        await setActive({ session: completeSignUp.createdSessionId })
        navigate('/home')
      }
    } catch (err) {
      console.error('Error during verification:', err)
      setError(err.errors?.[0]?.message || 'Invalid verification code')
    } finally {
      setIsLoading(false)
    }
  }

  if (verificationSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Verify your email</CardTitle>
            <CardDescription>
              We've sent a verification code to {formData.email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerification} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter verification code"
                />
              </div>
              
              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </Button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setVerificationSent(false)}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Back to sign up
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <span className="text-white font-bold text-sm">NGO</span>
          </div>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Join our platform to make a difference
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="First name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
                I am a
              </label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="donor">Donor</option>
                <option value="ngo">NGO</option>
              </select>
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading || !isLoaded}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/sign-in" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CustomSignUp
