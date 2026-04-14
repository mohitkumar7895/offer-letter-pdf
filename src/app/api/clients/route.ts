import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Client from '@/models/Client';
import { ensureAdminUser } from '@/lib/ensureAdminUser';

// We should probably rely on existing middleware/auth if applicable,
// but for now, we will add basic route handlers. Let's assume standard CRUD.

export async function GET() {
  try {
    await connectDB();
    const clients = await Client.find({}).sort({ createdAt: -1 });
    return NextResponse.json(clients);
  } catch (error: any) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await connectDB();
    const newClient = await Client.create(data);
    return NextResponse.json(newClient, { status: 201 });
  } catch (error: any) {
    console.error('Error creating client:', error);
    return NextResponse.json({ error: error.message || 'Failed to create client' }, { status: 500 });
  }
}
