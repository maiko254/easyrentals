import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';

export async function GET(request: NextRequest) {
  const client = await clientPromise;
  const db = client.db('easyrentals');

  try {
    const featuredProperties = await db.collection('properties')
      .aggregate([{ $sample: { size: 3 } }]) // Randomly select 3 properties
      .toArray();

    return NextResponse.json(featuredProperties);
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}