import { Job } from '../types';

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechFlow Solutions',
    location: 'San Francisco, CA',
    salary: '$120k - $150k',
    type: 'Full-time',
    postedAt: '2h ago',
    logoColor: 'bg-blue-100 text-blue-700'
  },
  {
    id: '2',
    title: 'UX/UI Designer',
    company: 'Creative Studio',
    location: 'Remote',
    salary: '$90k - $110k',
    type: 'Remote',
    postedAt: '5h ago',
    logoColor: 'bg-purple-100 text-purple-700'
  },
  {
    id: '3',
    title: 'Backend Engineer (Node.js)',
    company: 'DataSync',
    location: 'New York, NY',
    salary: '$130k - $160k',
    type: 'Full-time',
    postedAt: '1d ago',
    logoColor: 'bg-[#1F9B5E]/10 text-[#1F9B5E]'
  },
  {
    id: '4',
    title: 'Product Manager',
    company: 'InnovateHub',
    location: 'Austin, TX',
    salary: '$110k - $140k',
    type: 'Full-time',
    postedAt: '2d ago',
    logoColor: 'bg-orange-100 text-orange-700'
  }
];
