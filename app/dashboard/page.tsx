'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import NewPropertyModal from '../components/NewPropertyModal'

interface Property {
  id: string
  title: string
  description: string
  price: number
  bedrooms: number
  bathrooms: number
}

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchProperties = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const response = await fetch('/api/properties', {
          headers: {
            'X-Token': token,
          },
        })
        if (!response.ok) {
          throw new Error(`Failed to fetch properties ${response.status}`)
        }
        const data = await response.json()
        setProperties(data)
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError('An unknown error occurred')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Unauthorized')
      }

      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
        headers: {
          'X-Token': token,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to delete property')
      }
      // Refresh the properties list after deletion
      setProperties((prevProperties) => prevProperties.filter((property) => property.id !== id))
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white py-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between px-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 focus:outline-none"
          >
            Add New Property
          </button>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        <h2 className="mb-4 text-xl font-bold">Your Properties</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <div key={property.id} className="overflow-hidden rounded-lg bg-gray-100 shadow-md">
              <div className="p-4">
                <h3 className="mb-2 text-xl font-semibold">{property.title}</h3>
                <p className="mb-2 text-lg font-bold text-blue-600">${property.price}/month</p>
                <p className="text-gray-600">
                  {property.bedrooms} bed • {property.bathrooms} bath
                </p>
                <p className="text-gray-600">{property.description}</p>
                <div className="mt-4 flex justify-between">
                  <Link href={`/properties/edit/${property.id}`}>
                    <button className="bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600 focus:outline-none">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <NewPropertyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}