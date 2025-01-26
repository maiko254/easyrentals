import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';
import redisClient from '@/utils/redis';
import { ObjectId } from 'mongodb';

async function authenticate(request: NextRequest) {
  const token = request.headers.get('X-Token');
  if (!token) {
    return { status: 401, message: 'Missing token' };
  }

  const session = await redisClient.get(token);
  if (!session) {
    return { status: 401, message: 'Invalid or expired token' };
  }

  const client = await clientPromise;
  const user = await client.db('easyrentals').collection('users').findOne({ _id: new ObjectId(session) });
  if (!user) {
    return { status: 404, message: 'User not found' };
  }

  return { status: 200, user };
}

export async function GET(request: NextRequest) {
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

  const authResult = await authenticate(request);
  if (authResult.status !== 200) {
    return NextResponse.json({ message: authResult.message }, { status: authResult.status });
  }

  const user = authResult.user;
  if (!user) {
    return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
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
  const authResult = await authenticate(request);
  if (authResult.status !== 200) {
    return NextResponse.json({ message: authResult.message }, { status: authResult.status });
  }

  const user = authResult.user;
  if (!user) {
    return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
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

export async function PUT(request: NextRequest) {
  const authResult = await authenticate(request);
  if (authResult.status !== 200) {
    return NextResponse.json({ message: authResult.message }, { status: authResult.status });
  }

  const user = authResult.user;
  if (!user) {
    return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
  }
  const { id, title, description, price, bedrooms, bathrooms, location, image } = await request.json();

  const client = await clientPromise;
  const db = client.db('easyrentals');

  try {
    const updatedProperty = await db.collection('properties').findOneAndUpdate(
      { _id: new ObjectId(id), userId: user._id },
      { $set: { title, description, price: parseFloat(price), bedrooms: parseInt(bedrooms, 10), bathrooms: parseInt(bathrooms, 10), location, image } },
      { returnDocument: 'after' }
    );

    if (!updatedProperty || !updatedProperty.value) {
      return NextResponse.json({ message: 'Property not found or not authorized' }, { status: 404 });
    }

    return NextResponse.json(updatedProperty.value);
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authResult = await authenticate(request);
  if (authResult.status !== 200) {
    return NextResponse.json({ message: authResult.message }, { status: authResult.status });
  }

  const user = authResult.user;
  if (!user) {
    return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
  }
  const { id } = await request.json();

  const client = await clientPromise;
  const db = client.db('easyrentals');

  try {
    const deletedProperty = await db.collection('properties').findOneAndDelete({ _id: new ObjectId(id), userId: user._id });

    if (!deletedProperty || !deletedProperty.value) {
      return NextResponse.json({ message: 'Property not found or not authorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}