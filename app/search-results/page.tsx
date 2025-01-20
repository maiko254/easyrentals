'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'

interface Listing {
  id: number
  title: string
  price: number
  bedrooms: number
  bathrooms: number
}

export default function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('query')
  const [results, setResults] = useState<Listing[]>([])

  useEffect(() => {
    if (query) {
      // Fetch search results based on the query
      console.log('Fetching results for:', query)
      
      // Mock search results
      const mockResults = [
        { id: 1, title: 'Modern Downtown Apartment', price: 1500, bedrooms: 2, bathrooms: 1 },
        { id: 2, title: 'Spacious Suburban House', price: 2200, bedrooms: 3, bathrooms: 2 },
        { id: 3, title: 'Cozy Studio near University', price: 900, bedrooms: 1, bathrooms: 1 },
      ]
      
      setResults(mockResults)
    }
  }, [query])

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold">Search Results</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((listing) => (
            <div key={listing.id} className="overflow-hidden rounded-lg bg-gray-100 shadow-md">
              <Image
                src="/placeholder.svg?height=300&width=400"
                alt={listing.title}
                width={400}
                height={300}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="mb-2 text-xl font-semibold">{listing.title}</h3>
                <p className="mb-2 text-lg font-bold text-blue-600">${listing.price}/month</p>
                <p className="text-gray-600">
                  {listing.bedrooms} bed • {listing.bathrooms} bath
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}