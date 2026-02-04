// src/data/samplePatients.js
import { v4 as uuidv4 } from 'uuid';

/**
 * Sample patients for demo/testing
 */
export const samplePatients = [
  {
    id: 'patient-1',
    firstName: 'John',
    lastName: 'Smith',
    dateOfBirth: '1985-03-15',
    gender: 'male',
    bloodGroup: 'O+',
    phone: '+1 (555) 123-4567',
    email: 'john.smith@email.com',
    address: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
    },
    allergies: ['Penicillin'],
    medicalHistory: [
      { condition: 'Hypertension', diagnosedDate: '2020-01-15', status: 'active' },
    ],
    registrationDate: '2024-01-10',
  },
  {
    id: 'patient-2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    dateOfBirth: '1990-07-22',
    gender: 'female',
    bloodGroup: 'A+',
    phone: '+1 (555) 234-5678',
    email: 'sarah.j@email.com',
    address: {
      street: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90001',
      country: 'USA',
    },
    allergies: [],
    medicalHistory: [],
    registrationDate: '2024-02-05',
  },
  {
    id: 'patient-3',
    firstName: 'Emma',
    lastName: 'Williams',
    dateOfBirth: '2018-11-08',
    gender: 'female',
    bloodGroup: 'B+',
    phone: '+1 (555) 345-6789',
    email: 'williams.family@email.com',
    address: {
      street: '789 Pine Road',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60601',
      country: 'USA',
    },
    allergies: ['Sulfa'],
    medicalHistory: [
      { condition: 'Asthma', diagnosedDate: '2022-05-20', status: 'active' },
    ],
    registrationDate: '2024-01-20',
  },
  {
    id: 'patient-4',
    firstName: 'Michael',
    lastName: 'Brown',
    dateOfBirth: '1975-02-28',
    gender: 'male',
    bloodGroup: 'AB-',
    phone: '+1 (555) 456-7890',
    email: 'm.brown@email.com',
    address: {
      street: '321 Elm Street',
      city: 'Houston',
      state: 'TX',
      postalCode: '77001',
      country: 'USA',
    },
    allergies: ['Aspirin', 'Ibuprofen'],
    medicalHistory: [
      { condition: 'Diabetes', diagnosedDate: '2015-08-10', status: 'active' },
      { condition: 'Hypertension', diagnosedDate: '2018-03-22', status: 'active' },
    ],
    registrationDate: '2023-12-01',
  },
  {
    id: 'patient-5',
    firstName: 'Priya',
    lastName: 'Patel',
    dateOfBirth: '1988-09-14',
    gender: 'female',
    bloodGroup: 'O-',
    phone: '+1 (555) 567-8901',
    email: 'priya.patel@email.com',
    address: {
      street: '555 Maple Drive',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94101',
      country: 'USA',
    },
    allergies: [],
    medicalHistory: [
      { condition: 'PCOS', diagnosedDate: '2019-04-15', status: 'active' },
    ],
    registrationDate: '2024-01-25',
  },
];

export default samplePatients;