export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  salaryColor?: string;
  modality: string;
  jornada: string;
  postedAt: string;
  logoColor: string;
  logoInitial?: string;
  tags: string[];
  verified?: boolean;
  badge?: string;
  fastApply?: boolean;
}

