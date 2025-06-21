'use client';

import type React from 'react';
import { useState, useEffect } from 'react';

// --- Types ---
export type Employee = {
  matricule: string;
  noms: string;
  email: string;
  departement: string;
  poste: string;
  salaire: number;
  typeContrat: string;
  dateEmbauche: string;
  periodeEssai: number;
  status: 'Actif' | 'Parti';
  dateDepart?: string;
};

export type Candidate = {
  name: string;
  position: string;
  status: 'Entretien' | 'Offre envoyée' | 'Nouveau' | 'Rejeté';
  appliedDate: string;
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

// --- Data Store ---
// This acts as our in-memory database.
export const store = {
  employees: [] as Employee[],
  candidates: [] as Candidate[],
  users: [] as User[],
  salaryHistory: [] as SalaryChange[],
  functionHistory: [] as FunctionChange[],
  contractHistory: [] as ContractChange[],
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
