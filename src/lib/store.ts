
'use client';

import type React from 'react';
import { useState, useEffect } from 'react';

// --- Types ---
export type Employee = {
  matricule: string;
  noms: string;
  email: string;
  sexe: 'Homme' | 'Femme' | 'N/A';
  entite: string;
  departement: string;
  poste: string;
  lieuTravail: string;
  salaire: number;
  typeContrat: string;
  dateEmbauche: string; // "Date de Début"
  periodeEssai: number; // in months
  status: 'Actif' | 'Parti';
  dateDepart?: string;
};

export type OpenPosition = {
  id: string;
  title: string;
  type: 'Remplacement' | 'Création';
  openingDate: string;
  filledDate?: string;
  description: string;
  status: 'Ouvert' | 'Pourvu' | 'Annulé';
  cost?: number;
};

export type User = {
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'membre';
  password?: string;
};

export type SalaryChange = {
  date: string;
  matricule: string;
  noms: string;
  ancienneValeur: number;
  nouvelleValeur: number;
  motif: string;
};

export type FunctionChange = {
  date: string;
  matricule: string;
  noms: string;
  ancienneValeur: string;
  nouvelleValeur: string;
  motif: string;
};

export type ContractChange = {
  date: string;
  matricule: string;
  noms: string;
  ancienneValeur: string;
  nouvelleValeur: string;
  motif: string;
};

export type DepartmentChange = {
  date: string;
  matricule: string;
  noms:string;
  ancienneValeur: string;
  nouvelleValeur: string;
  motif: string;
};

export type EntityChange = {
  date: string;
  matricule: string;
  noms: string;
  ancienneValeur: string;
  nouvelleValeur: string;
  motif: string;
};

export type WorkLocationChange = {
  date: string;
  matricule: string;
  noms: string;
  ancienneValeur: string;
  nouvelleValeur: string;
  motif: string;
  droitPrimeEloignement: boolean;
  pourcentagePrime?: number;
  dureeAffectationMois?: number;
};

type StoreType = {
  employees: Employee[];
  openPositions: OpenPosition[];
  users: User[];
  currentUser: User | null;
  salaryHistory: SalaryChange[];
  functionHistory: FunctionChange[];
  contractHistory: ContractChange[];
  departmentHistory: DepartmentChange[];
  entityHistory: EntityChange[];
  workLocationHistory: WorkLocationChange[];
  departments: string[];
  entities: string[];
  workLocations: string[];
};


// --- Data Store ---
const initialData: StoreType = {
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

export let store: StoreType = { ...initialData };

// --- State Management ---
let listeners: React.Dispatch<React.SetStateAction<number>>[] = [];
let dataIsLoaded = false;
let dataIsLoading = false;
let saveTimeout: NodeJS.Timeout | null = null;

async function loadData() {
  if (dataIsLoaded || dataIsLoading) return;
  dataIsLoading = true;
  try {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error('Failed to fetch data');
    const dataFromServer = await response.json();
    store = dataFromServer;
    // Always reset the current user on initial load to force login
    store.currentUser = null;
    dataIsLoaded = true;
  } catch (error) {
    console.error("Couldn't load data from server, using initial data.", error);
    store = { ...initialData };
    // We still mark as loaded to prevent infinite loading on error
    dataIsLoaded = true;
  } finally {
    dataIsLoading = false;
    // Notify components that data is available
    listeners.forEach((listener) => listener((c) => c + 1));
  }
}

async function saveData() {
  try {
    // Create a copy of the store but explicitly set currentUser to null before saving.
    // This prevents the user's session from being persisted.
    const dataToSave = { ...store, currentUser: null };
    
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSave, null, 2),
    });
  } catch (error) {
    console.error("Couldn't save data to server.", error);
  }
}

const debouncedSave = () => {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveData();
  }, 500); // Debounce saves by 500ms
};


export function useStore() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    listeners.push(forceUpdate);
    if (!dataIsLoaded && !dataIsLoading) {
      loadData();
    }
    return () => {
      listeners = listeners.filter((l) => l !== forceUpdate);
    };
  }, []);

  return { store, isLoaded: dataIsLoaded };
}

export function notify(shouldSave = true) {
  if (shouldSave && dataIsLoaded) {
    debouncedSave();
  }
  listeners.forEach((listener) => listener((c) => c + 1));
}
