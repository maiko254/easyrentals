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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await authenticate(request);
  if (authResult.status !== 200) {
    return NextResponse.json({ message: authResult.message }, { status: authResult.status });
  }

  const user = authResult.user;
  if (!user) {
    return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
  }
  const { title, description, price, bedrooms, bathrooms, location, image } = await request.json();
  const { id } = params;

  const client = await clientPromise;
  const db = client.db('easyrentals');

  try {
    const updatedProperty = await db.collection('properties').findOneAndUpdate(
      { _id: new ObjectId(id), userId: user._id },
      { $set: { title, description, price: parseFloat(price), bedrooms: parseInt(bedrooms, 10), bathrooms: parseInt(bathrooms, 10), location, image } },
      { returnDocument: 'after' }
    );
    
    /*if (!updatedProperty || !updatedProperty.value) {
      return NextResponse.json({ message: 'Property not found or not authorized' }, { status: 404 });
    }**/
    if (updatedProperty && updatedProperty.lastErrorObject && updatedProperty.lastErrorObject.n === 1) {
        console.log('Update was successful:', updatedProperty.value);
    } else {
        console.log('Update failed or no document matched the query filter');
    }

    return NextResponse.json(updatedProperty);
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await authenticate(request);
  if (authResult.status !== 200) {
    return NextResponse.json({ message: authResult.message }, { status: authResult.status });
  }

  const user = authResult.user;
  if (!user) {
    return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
  }
  const { id } = params;

  const client = await clientPromise;
  const db = client.db('easyrentals');

  try {
    const deletedProperty = await db.collection('properties').findOneAndDelete({ _id: new ObjectId(id), userId: user._id });

    /*if (!deletedProperty || !deletedProperty.value) {
      return NextResponse.json({ message: 'Property not found or not authorized' }, { status: 404 });
    }*/

    return NextResponse.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}