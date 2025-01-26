'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

interface EditPropertyModalProps {
  isOpen: boolean
  onClose: () => void
  property: Property
  onUpdateProperty: (property: Property) => void
}

interface Property {
  id: string
  title: string
  description: string
  price: number
  bedrooms: number
  bathrooms: number
  location: string
  image: string
}

export default function EditPropertyModal({ isOpen, onClose, property, onUpdateProperty }: EditPropertyModalProps) {
  const [title, setTitle] = useState(property.title)
  const [description, setDescription] = useState(property.description)
  const [price, setPrice] = useState(property.price.toString())
  const [bedrooms, setBedrooms] = useState(property.bedrooms.toString())
  const [bathrooms, setBathrooms] = useState(property.bathrooms.toString())
  const [location, setLocation] = useState(property.location)
  const [image, setImage] = useState(property.image)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    setTitle(property.title)
    setDescription(property.description)
    setPrice(property.price.toString())
    setBedrooms(property.bedrooms.toString())
    setBathrooms(property.bathrooms.toString())
    setLocation(property.location)
    setImage(property.image)
  }, [property])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch(`/api/properties/${property.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Token': token,
        },
        body: JSON.stringify({ title, description, price, bedrooms, bathrooms, location, image }),
      })

      if (!response.ok) {
        throw new Error('Failed to update property')
      }

      const updatedProperty = await response.json()
      onUpdateProperty(updatedProperty)
      onClose()
    } catch (error) {
      console.error('Error updating property:', error)
      setError('Failed to update property. Please try again.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md max-h-full overflow-y-auto rounded-lg bg-white p-8 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Edit Property</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="mb-2 block text-sm font-bold text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="mb-2 block text-sm font-bold text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="mb-2 block text-sm font-bold text-gray-700">
              Price
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bedrooms" className="mb-2 block text-sm font-bold text-gray-700">
              Bedrooms
            </label>
            <input
              type="number"
              id="bedrooms"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bathrooms" className="mb-2 block text-sm font-bold text-gray-700">
              Bathrooms
            </label>
            <input
              type="number"
              id="bathrooms"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="mb-2 block text-sm font-bold text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="image" className="mb-2 block text-sm font-bold text-gray-700">
              Image URL
            </label>
            <input
              type="text"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600 focus:outline-none"
          >
            Update Property
          </button>
        </form>
      </div>
    </div>
  )
}