import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/utils/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  console.log('Received ID:', id) // Log the received ID
  const client = await clientPromise
  const db = client.db('easyrentals')

  try {
    const property = await db.collection('properties').findOne({ _id: new ObjectId(id) })
    if (!property) {
      console.log('Property not found') // Log if property is not found
      return NextResponse.json({ message: 'Property not found' }, { status: 404 })
    }
    property.id = property._id
    /*delete property._id*/
    console.log('Property found:', property) // Log the found property
    return NextResponse.json(property)
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}