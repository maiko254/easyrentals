'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Edit, Trash } from 'lucide-react'
import EditPropertyModal from '../../../components/EditPropertyModal'

interface Property {
  id: string
  title: string
  description: string
  price: number
  bedrooms: number
  bathrooms: number
  location: string
  image: string
  userId: string
}

export default function PropertyDetail() {
  const { id } = useParams()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/view/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch property details')
        }
        const data = await response.json()
        setProperty(data)
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

    fetchProperty()
  }, [id])

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Missing token')
      }

      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
        headers: {
          'X-Token': token,
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete property')
      }
      router.push('/search-results')
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unknown error occurred')
      }
    }
  }

  const handleUpdateProperty = (updatedProperty: Property) => {
    setProperty(updatedProperty)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!property) {
    return <div>Property not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white py-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between px-4">
          <h1 className="text-2xl font-bold">{property.title}</h1>
          <Link href="/search-results">
            <button className="bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 focus:outline-none">
              Back to Search Results
            </button>
          </Link>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative overflow-hidden rounded-lg bg-gray-100 shadow-md">
            <img src={property.image} alt={property.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="mb-2 text-xl font-semibold">{property.title}</h3>
              <p className="mb-2 text-lg font-bold text-blue-600">${property.price}/month</p>
              <p className="text-gray-600">{property.bedrooms} bed • {property.bathrooms} bath</p>
              <p className="text-gray-600">{property.description}</p>
              <p className="text-gray-600">{property.location}</p>
              <div className="mt-4 flex space-x-4">
                <Link href={`/contact-owner/${property.userId}`}>
                  <div title="Contact Property Owner">
                    <Mail className="text-green-500 hover:text-green-600 cursor-pointer" />
                  </div>
                </Link>
                <div title="Edit Property" onClick={() => setIsEditModalOpen(true)}>
                  <Edit className="text-yellow-500 hover:text-yellow-600 cursor-pointer" />
                </div>
                <div title="Delete Property" onClick={handleDelete}>
                  <Trash className="text-red-500 hover:text-red-600 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EditPropertyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        property={property}
        onUpdateProperty={handleUpdateProperty}
      />
    </div>
  )
}