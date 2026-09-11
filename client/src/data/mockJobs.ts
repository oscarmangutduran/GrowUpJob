import { Job } from '../types';

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Desarrollador Frontend Senior',
    company: 'TechFlow Solutions',
    location: 'San Francisco, CA',
    salary: '$120k - $150k',
    type: 'Tiempo completo',
    postedAt: 'hace 2h',
    logoColor: 'bg-blue-100 text-blue-700'
  },
  {
    id: '2',
    title: 'Diseñador UX/UI',
    company: 'Creative Studio',
    location: 'Remoto',
    salary: '$90k - $110k',
    type: 'Remoto',
    postedAt: 'hace 5h',
    logoColor: 'bg-purple-100 text-purple-700'
  },
  {
    id: '3',
    title: 'Ingeniero Backend (Node.js)',
    company: 'DataSync',
    location: 'New York, NY',
    salary: '$130k - $160k',
    type: 'Tiempo completo',
    postedAt: 'hace 1d',
    logoColor: 'bg-[#1F9B5E]/10 text-[#1F9B5E]'
  },
  {
    id: '4',
    title: 'Gerente de Producto',
    company: 'InnovateHub',
    location: 'Austin, TX',
    salary: '$110k - $140k',
    type: 'Tiempo completo',
    postedAt: 'hace 2d',
    logoColor: 'bg-orange-100 text-orange-700'
  }
];
