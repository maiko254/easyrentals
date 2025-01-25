'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Listing {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  location: string;
  image: string;
}

export default function FeaturedListings() {
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedListings = async () => {
      try {
        const response = await fetch('/api/properties/featured');
        if (!response.ok) {
          throw new Error('Failed to fetch featured listings');
        }
        const data = await response.json();
        setFeaturedListings(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedListings();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold">Featured Listings</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredListings.map((listing, index) => (
            <div key={`${listing.id}-${index}`} className="overflow-hidden rounded-lg bg-gray-100 shadow-md">
              <Image
                src={listing.image}
                alt={listing.title}
                width={400}
                height={300}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="mb-2 text-xl font-semibold">{listing.title}</h3>
                <p className="mb-2 text-lg font-bold text-blue-600">${listing.price}/month</p>
                <p className="text-gray-600">{listing.bedrooms} bed • {listing.bathrooms} bath</p>
                <p className="text-gray-600">{listing.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}