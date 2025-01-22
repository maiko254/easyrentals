import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import clientPromise from '../../../../utils/mongodb'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  const client = await clientPromise
  const db = client.db('easyrentals')

  const existingUser = await db.collection('users').findOne({ email })
  if (existingUser) {
    return NextResponse.json({ message: 'User already exists' }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  await db.collection('users').insertOne({ email, password: hashedPassword })

  return NextResponse.json({ message: 'User registered successfully' }, { status: 201 })
}