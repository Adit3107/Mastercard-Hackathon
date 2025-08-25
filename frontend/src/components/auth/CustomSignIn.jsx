import { useState } from 'react'
import { useSignIn } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

function CustomSignIn() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

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
      // Start the sign-in process
      const result = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      })

      if (result.status === 'complete') {
        // Save signin data to backend
        try {
          const response = await fetch('http://localhost:5000/api/auth/signin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${result.createdSessionId}`
            },
            body: JSON.stringify({
              clerkId: result.createdUserId
            })
          })

          if (!response.ok) {
            console.error('Failed to save signin to backend:', await response.text())
          }
        } catch (backendErr) {
          console.error('Backend signin save error:', backendErr)
        }

        // Set the user session active
        await setActive({ session: result.createdSessionId })
        navigate('/home')
      } else {
        // Handle multi-factor authentication if needed
        console.log('Sign-in not complete:', result)
      }
    } catch (err) {
      console.error('Error during sign in:', err)
      setError(err.errors?.[0]?.message || 'Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <span className="text-white font-bold text-sm">NGO</span>
          </div>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading || !isLoaded}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/sign-up" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CustomSignIn
