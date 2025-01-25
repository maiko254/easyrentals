'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export default function SearchBar() {
  const [location, setLocation] = useState('')
  const [price, setPrice] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Navigate to the search results page with the query parameters
    router.push(`/search-results?query=${location}&price=${price}`)
  }

  const handleViewAllListings = () => {
    // Navigate to the search results page without any query parameters
    router.push(`/search-results`)
  }

  return (
    <div className="bg-white py-8 shadow-md">
      <div className="container mx-auto px-4">
        <form onSubmit={handleSearch} className="flex items-center justify-center">
          <input
            type="text"
            placeholder="Enter location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full max-w-md rounded-l-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Max price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full max-w-md rounded-l-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none ml-2"
          />
          <button
            type="submit"
            className="rounded-r-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 focus:outline-none"
          >
            <Search className="h-5 w-5" />
          </button>
        </form>
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleViewAllListings}
            className="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 focus:outline-none"
          >
            View All Listings
          </button>
        </div>
      </div>
    </div>
  )
}