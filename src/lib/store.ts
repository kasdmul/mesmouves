
'use client';

import type React from 'react';
import { useState, useEffect } from 'react';

// --- Types ---
export type Employee = {
  matricule: string;
  noms: string;
  email: string;
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
  role: string;
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


// --- Data Store ---
// This acts as our in-memory database.
export const store = {
  employees: [] as Employee[],
  openPositions: [] as OpenPosition[],
  users: [] as User[],
  salaryHistory: [] as SalaryChange[],
  functionHistory: [] as FunctionChange[],
  contractHistory: [] as ContractChange[],
  departmentHistory: [] as DepartmentChange[],
  entityHistory: [] as EntityChange[],
  workLocationHistory: [] as WorkLocationChange[],
  departments: [] as string[],
  entities: [] as string[],
  workLocations: [] as string[],
};

// --- State Management ---
// A simple subscription model to notify components of changes.
let listeners: React.Dispatch<React.SetStateAction<number>>[] = [];

export function useStore() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    listeners.push(forceUpdate);
    return () => {
      listeners = listeners.filter((l) => l !== forceUpdate);
    };
  }, []);
}

export function notify() {
  listeners.forEach((listener) => listener((c) => c + 1));
}
