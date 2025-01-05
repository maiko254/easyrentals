'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import Link from 'next/link'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isForgotPassword, setIsForgotPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement login logic here
    console.log('Login attempted with:', { email, password })
    // After successful login, you would typically:
    // 1. Send the credentials to your backend
    // 2. Receive and store the authentication token
    // 3. Update the user state in your app
    // 4. Close the modal
    onClose()
  }

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement forgot password logic here
    console.log('Password reset requested for:', email)
    // After sending reset email:
    // 1. Display a success message to the user
    // 2. Optionally close the modal or switch back to login view
    setIsForgotPassword(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{isForgotPassword ? 'Reset Password' : 'Login'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        {isForgotPassword ? (
          <form onSubmit={handleForgotPassword}>
            <div className="mb-4">
              <label htmlFor="forgotEmail" className="mb-2 block text-sm font-bold text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="forgotEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600 focus:outline-none"
            >
              Reset Password
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="mb-2 block text-sm font-bold text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="mb-2 block text-sm font-bold text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600 focus:outline-none"
            >
              Log In
            </button>
          </form>
        )}
        <div className="mt-4 flex justify-between text-sm">
          <button
            onClick={() => setIsForgotPassword(!isForgotPassword)}
            className="text-blue-500 hover:text-blue-700"
          >
            {isForgotPassword ? 'Back to Login' : 'Forgot Password?'}
          </button>
          <Link href="/register" className="text-blue-500 hover:text-blue-700">
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}