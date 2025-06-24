
import { NextResponse } from 'next/server';
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

// Function to read from db.json
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
  // For debugging, we are only using db.json
  return readDbJson();
}

export async function GET() {
  const data = await getData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const data = await request.json();

  // For debugging, we only write to db.json
  try {
    const jsonPath = path.join(process.cwd(), 'db.json');
    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
    return NextResponse.json({ message: 'Data saved to db.json successfully.' });
  } catch (error) {
    console.error('Failed to save data to db.json:', error);
    return new NextResponse('Failed to save data', { status: 500 });
  }
}
