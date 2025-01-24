import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';
import redisClient from '@/utils/redis';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
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
  
  const client = await clientPromise;
  const db = client.db('easyrentals');

  console.log(`User ID: ${user._id}`);
  try {
    const properties = await db.collection('properties').find({ userId: user._id }).toArray();
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } 
}