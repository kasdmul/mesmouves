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
};

export type Candidate = {
  name: string;
  position: string;
  status: string;
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
  employees: [
    { matricule: 'E001', noms: 'Alice Bernard', email: 'alice.b@example.com', departement: 'Marketing', poste: 'Spécialiste Marketing', salaire: 2800, typeContrat: 'CDI' },
    { matricule: 'E002', noms: 'Bob Leclerc', email: 'bob.l@example.com', departement: 'Ingénierie', poste: 'Développeur Senior', salaire: 3500, typeContrat: 'CDI' },
    { matricule: '20055', noms: 'Trish KALOMBOLA', email: 'trish.k@example.com', departement: 'Finance', poste: 'Directeur Financier', salaire: 4500, typeContrat: 'CDI' },
    { matricule: '21072', noms: 'John TSHIAMALA', email: 'john.t@example.com', departement: 'Ventes', poste: 'Manager', salaire: 3000, typeContrat: 'CDI' },
    { matricule: '22105', noms: 'Bernard BEYA', email: 'bernard.b@example.com', departement: 'Finance', poste: 'Comptable', salaire: 4000, typeContrat: 'CDI' },
    { matricule: 'E003', noms: 'Chloé Dubois', email: 'chloe.d@example.com', departement: 'Ventes', poste: 'Commercial', salaire: 2500, typeContrat: 'CDD' },
  ] as Employee[],

  candidates: [
    { name: 'Jean Dupont', position: 'Développeur Frontend', status: 'Entretien', appliedDate: '2023-10-26' },
    { name: 'Marie Curie', position: 'Chef de projet', status: 'Offre envoyée', appliedDate: '2023-10-22' },
    { name: 'Pierre Martin', position: 'Designer UI/UX', status: 'Nouveau', appliedDate: '2023-11-01' },
    { name: 'Sophie Lambert', position: 'Data Scientist', status: 'Rejeté', appliedDate: '2023-10-15' },
  ] as Candidate[],

  users: [
    { name: 'Admin User', email: 'admin@example.com', role: 'superadmin' },
    { name: 'HR Manager', email: 'hr@example.com', role: 'admin' },
    { name: 'Standard User', email: 'user@example.com', role: 'user' },
  ] as User[],

  salaryHistory: [
    { date: '20/06/2025', matricule: '21072', noms: 'John TSHIAMALA', ancienneValeur: 3000, nouvelleValeur: 3500, motif: 'ajustement salaire' },
  ] as SalaryChange[],

  functionHistory: [
    { date: '20/06/2025', matricule: '20055', noms: 'Trish KALOMBOLA', ancienneValeur: 'Directeur Financier', nouvelleValeur: 'chief driver', motif: 'promotion' },
  ] as FunctionChange[],

  contractHistory: [
    { date: '20/06/2025', matricule: '22105', noms: 'Bernard BEYA', ancienneValeur: 'CDI', nouvelleValeur: 'CDD', motif: 'pas de motif (Département de "Finance" vers "Comm' },
  ] as ContractChange[],
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
