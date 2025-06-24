
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import path from 'path';
import fs from 'fs/promises';

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

// Function to read from db.json as a fallback
async function readDbJson() {
  try {
    const jsonPath = path.join(process.cwd(), 'db.json');
    const jsonData = await fs.readFile(jsonPath, 'utf-8');
    const parsedData = JSON.parse(jsonData);
    // Ensure all keys from initialData are present
    return { ...initialData, ...parsedData };
  } catch (error) {
    console.error('Failed to read or parse db.json:', error);
    // If db.json is missing or corrupt, return initial data
    return initialData;
  }
}

async function getData() {
  // If Firestore is configured and working, use it.
  if (db) {
    const docRef = db.collection('appState').doc('data');
    try {
      const doc = await doc.get();
      if (!doc.exists) {
        // If the doc doesn't exist in Firestore, try to seed it from db.json
        console.log("No data in Firestore, seeding from db.json...");
        const seedData = await readDbJson();
        await docRef.set(seedData);
        return seedData;
      }
      return { ...initialData, ...doc.data() };
    } catch (error) {
      console.error('Firestore GET error, falling back to db.json:', error);
      return readDbJson();
    }
  }

  // If Firestore is not initialized, use db.json
  console.warn("Firestore is not initialized. Serving data from db.json.");
  return readDbJson();
}

export async function GET() {
  const data = await getData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const data = await request.json();

  // If Firestore is configured and working, use it.
  if (db) {
    const docRef = db.collection('appState').doc('data');
    try {
      await docRef.set(data);
      return NextResponse.json({ message: 'Data saved to Firestore successfully.' });
    } catch (error) {
      console.error('Failed to save data to Firestore, falling back to writing db.json:', error);
    }
  }

  // If Firestore is not available, write to db.json
  try {
    const jsonPath = path.join(process.cwd(), 'db.json');
    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
    return NextResponse.json({ message: 'Data saved to db.json successfully.' });
  } catch (error) {
    console.error('Failed to save data to db.json:', error);
    return new NextResponse('Failed to save data', { status: 500 });
  }
}
