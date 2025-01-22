'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'

interface Listing {
  id: string
  title: string
  price: number
  bedrooms: number
  bathrooms: number
}

export default function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('query')
  const [results, setResults] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        try {
          const response = await fetch(`/api/search?query=${query}`)
          if (!response.ok) {
            throw new Error('Failed to fetch search results')
          }
          const data = await response.json()
          setResults(data)
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

      fetchResults()
    }
  }, [query])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

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