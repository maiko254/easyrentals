import { NextResponse } from 'next/server'
import clientPromise from '@/utils/mongodb'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const db = client.db('easyrentals')
    const listings = await db
      .collection('listings')
      .find({ location: { $regex: query, $options: 'i' } })
      .toArray()

    return NextResponse.json(listings)
  } catch (error) {
    console.error('Error fetching listings:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}