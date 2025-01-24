import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import clientPromise from '../../../../utils/mongodb';
import redisClient from '@/utils/redis';
import { v4 as uuid } from 'uuid';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return NextResponse.json({ message: 'Missing or invalid Authorization header' }, { status: 401 })
  }

  const base64Credentials = authHeader.split(' ')[1]
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
  const [email, password] = credentials.split(':')

  const client = await clientPromise
  const db = client.db('easyrentals')

  const user = await db.collection('users').findOne({ email })
  if (!user) {
    return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 })
  }
  
  const token = uuid();
  const tokenExpiresIn = 60 * 60; // 1 hour
  await redisClient.set(token, user._id.toString(), { EX: tokenExpiresIn });
  /*await db.collection('properties').insertOne({ userId: user._id, title: 'New Property', price: 0, bedrooms: 0, bathrooms: 0 });*/
  return NextResponse.json({ message: 'Login successful', token });
}