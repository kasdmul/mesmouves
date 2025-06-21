
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'db.json');

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
  try {
    await fs.access(dbPath);
    const data = await fs.readFile(dbPath, 'utf-8');
    // Merge with initialData to ensure all keys are present even if db.json is from an older version
    return { ...initialData, ...JSON.parse(data) };
  } catch (error) {
    // If file doesn't exist or is invalid, create it and return default data.
    await fs.writeFile(dbPath, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

export async function GET() {
  const data = await getData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    return NextResponse.json({ message: 'Data saved successfully.' });
  } catch (error) {
    console.error('Failed to save data:', error);
    return new NextResponse('Failed to save data', { status: 500 });
  }
}
