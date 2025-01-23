'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

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
  const [sort, setSort] = useState('price')
  const [price, setPrice] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality here
  }

  const handleFilter = () => {
    // Implement filter functionality here
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white py-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between px-4">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              placeholder="Enter location..."
              className="w-full max-w-md rounded-l-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-r-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 focus:outline-none"
            >
              Search
            </button>
          </form>
          <Link href="/login">
            <button className="bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 focus:outline-none">
              Login
            </button>
          </Link>
        </div>
      </header>
      <div className="container mx-auto flex px-4 py-8">
        <aside className="w-1/4 pr-4">
          <h3 className="mb-4 text-xl font-bold">Filters</h3>
          <div className="mb-4">
            <label htmlFor="sort" className="block mb-2 text-sm font-bold text-gray-700">
              Sort by
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="price">Price</option>
              <option value="bedrooms">Bedrooms</option>
              <option value="bathrooms">Bathrooms</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block mb-2 text-sm font-bold text-gray-700">
              Price
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bedrooms" className="block mb-2 text-sm font-bold text-gray-700">
              Bedrooms
            </label>
            <input
              type="number"
              id="bedrooms"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bathrooms" className="block mb-2 text-sm font-bold text-gray-700">
              Bathrooms
            </label>
            <input
              type="number"
              id="bathrooms"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            onClick={handleFilter}
            className="w-full rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600 focus:outline-none"
          >
            Apply Filters
          </button>
        </aside>
        <main className="w-3/4">
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
        </main>
      </div>
    </div>
  )
}