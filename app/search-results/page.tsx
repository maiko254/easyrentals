'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Listing {
  id: string
  title: string
  description: string
  price: number
  bedrooms: number
  bathrooms: number
  location: string
  image: string
}

export default function SearchResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('query')
  const price = searchParams.get('price')
  const [results, setResults] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sort, setSort] = useState('price')
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [location, setLocation] = useState(query || '')
  const [maxPrice, setMaxPrice] = useState(price || '')

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/properties?query=${query || ''}&sort=${sort}&price=${price || ''}&bedrooms=${bedrooms}&bathrooms=${bathrooms}&page=${page}`)
        if (!response.ok) {
          throw new Error('Failed to fetch search results')
        }
        const data = await response.json()
        setResults(data.properties)
        setTotalPages(data.totalPages)
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
  }, [query, price, sort, bedrooms, bathrooms, page])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    router.push(`/search-results?query=${location}&price=${maxPrice}`)
  }

  const handleFilter = () => {
    setPage(1)
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
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full max-w-md rounded-l-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full max-w-md rounded-l-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none ml-2"
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
              value={price || ''}
              onChange={(e) => setMaxPrice(e.target.value)}
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
            {results.map((listing, index) => (
              <div
                key={`${listing.id}-${index}`}
                className="relative overflow-hidden rounded-lg bg-gray-100 shadow-md transition-transform transform hover:scale-105 hover:border-blue-500"
              >
                <div className="p-4">
                  <h3 className="mb-2 text-xl font-semibold">{listing.title}</h3>
                  <p className="mb-2 text-lg font-bold text-blue-600">${listing.price}/month</p>
                  <p className="text-gray-600">{listing.bedrooms} bed • {listing.bathrooms} bath</p>
                  <p className="text-gray-600">{listing.description}</p>
                  <p className="text-gray-600">{listing.location}</p>
                  <p className="text-gray-600">ID: {listing.id}</p>
                  <img src={listing.image} alt={listing.title} className="w-full h-48 object-cover mt-2" />
                  <div className="absolute bottom-4 right-4">
                    <Link href={`/properties/view/${listing.id}`}>
                      <button className="bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none">
                        View Property
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 mx-1">{page} of {totalPages}</span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}