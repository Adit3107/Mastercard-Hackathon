import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">NGO</span>
            </div>
            <span className="text-xl font-bold text-gray-900">NGO Platform</span>
          </div>
          <div className="flex space-x-4">
            <Link to="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Connecting <span className="text-blue-600">Donors</span> with <span className="text-green-600">NGOs</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join our platform to make a difference. Whether you're a donor looking to support meaningful causes 
            or an NGO seeking funding, we're here to connect you.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/sign-up">
              <Button size="lg" className="px-8 py-3">
                Join as Donor
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button size="lg" variant="outline" className="px-8 py-3">
                Join as NGO
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <CardTitle>For Donors</CardTitle>
              <CardDescription>
                Discover and support verified NGOs making real impact in communities worldwide.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Browse verified NGO profiles</li>
                <li>• Track your donations</li>
                <li>• Receive impact reports</li>
                <li>• Tax-deductible contributions</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <CardTitle>For NGOs</CardTitle>
              <CardDescription>
                Showcase your organization and connect with donors who share your mission.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Create detailed profiles</li>
                <li>• Share impact stories</li>
                <li>• Receive secure donations</li>
                <li>• Build donor relationships</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <CardTitle>Transparency</CardTitle>
              <CardDescription>
                Every donation is tracked and verified, ensuring your contributions make real impact.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Verified NGO profiles</li>
                <li>• Transparent reporting</li>
                <li>• Secure transactions</li>
                <li>• Impact tracking</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of donors and NGOs already making an impact on our platform.
          </p>
          <Link to="/sign-up">
            <Button size="lg" className="px-8 py-3">
              Get Started Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
