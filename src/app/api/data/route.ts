
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

const initialData = {
    employees: [],
    openPositions: [],
    users: [],
    currentUser: null,
    salaryHistory: [],
    functionHistory: [],
    contractHistory: [],
    departmentHistory: [],
    entityHistory: [],
    workLocationHistory: [],
    departments: [],
    entities: [],
    workLocations: [],
};

async function getData() {
  if (!db) {
    console.warn("Firestore is not initialized. Serving initial data. Check server configuration.");
    return initialData;
  }
  
  const docRef = db.collection('appState').doc('data');

  try {
    const doc = await docRef.get();
    if (!doc.exists) {
      await docRef.set(initialData);
      return initialData;
    }
    return { ...initialData, ...doc.data() };
  } catch (error) {
    console.error('Firestore GET error:', error);
    return initialData;
  }
}

export async function GET() {
  const data = await getData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  if (!db) {
    console.error('Firestore is not initialized. Cannot save data. Check server configuration.');
    return new NextResponse('Server configuration error: Firestore not initialized.', { status: 500 });
  }

  const docRef = db.collection('appState').doc('data');
  
  try {
    const data = await request.json();
    await docRef.set(data);
    return NextResponse.json({ message: 'Data saved successfully.' });
  } catch (error) {
    console.error('Failed to save data to Firestore:', error);
    return new NextResponse('Failed to save data', { status: 500 });
  }
}

