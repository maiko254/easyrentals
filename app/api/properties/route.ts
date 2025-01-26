import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';
import redisClient from '@/utils/redis';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  const token = request.headers.get('X-Token');
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const sort = searchParams.get('sort') || 'price';
  const price = searchParams.get('price');
  const bedrooms = searchParams.get('bedrooms');
  const bathrooms = searchParams.get('bathrooms');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const skip = (page - 1) * limit;

  const client = await clientPromise;
  const db = client.db('easyrentals');

  if (query) {
    try {
      const filters: any = { location: { $regex: query, $options: 'i' } };
      if (price) filters.price = { $lte: parseFloat(price) };
      if (bedrooms) filters.bedrooms = parseInt(bedrooms, 10);
      if (bathrooms) filters.bathrooms = parseInt(bathrooms, 10);

      const properties = await db.collection('properties')
        .find(filters)
        .sort({ [sort]: 1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      const total = await db.collection('properties').countDocuments(filters);
      const totalPages = Math.ceil(total / limit);

      // Map _id to id
      const mappedProperties = properties.map(property => ({
        ...property,
        id: property._id,
        _id: undefined
      }));

      return NextResponse.json({ properties: mappedProperties, totalPages, currentPage: page });
    } catch (error) {
      console.error('Error fetching properties:', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }

  if (!token) {
    return NextResponse.json({ message: 'Missing token' }, { status: 401 });
  }

  const session = await redisClient.get(token);
  if (!session) {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }

  const user = await client.db('easyrentals').collection('users').findOne({ _id: new ObjectId(session) });
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  try {
    const properties = await db.collection('properties').find({ userId: user._id }).toArray();

    // Map _id to id
    const mappedProperties = properties.map(property => ({
        ...property,
        id: property._id,
        _id: undefined
      }));

    return NextResponse.json(mappedProperties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const token = request.headers.get('X-Token');
  if (!token) {
    return NextResponse.json({ message: 'Missing token' }, { status: 401 });
  }

  const session = await redisClient.get(token);
  if (!session) {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }

  const user = await clientPromise.then(client => client.db('easyrentals').collection('users').findOne({ _id: new ObjectId(session) }));
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const { title, description, price, bedrooms, bathrooms, location, image } = await request.json();

  const client = await clientPromise;
  const db = client.db('easyrentals');

  const newProperty = {
    userId: user._id,
    title,
    description,
    price: parseFloat(price),
    bedrooms: parseInt(bedrooms, 10),
    bathrooms: parseInt(bathrooms, 10),
    location,
    image,
    createdAt: new Date(),
  };

  try {
    await db.collection('properties').insertOne(newProperty);
    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    console.error('Error adding property:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}