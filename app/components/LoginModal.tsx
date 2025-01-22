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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const credentials = btoa(`${email}:${password}`)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      console.log('Login successful:', data)
      onClose()
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Password reset requested for:', email)
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