import { MapPin, Clock, DollarSign, Bookmark } from 'lucide-react';
import { Job } from '../types';

export default function JobCard({ job }: { job: Job }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl ${job.logoColor}`}>
            {job.company.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 leading-tight">{job.title}</h3>
            <p className="text-gray-500 text-sm mt-0.5">{job.company}</p>
          </div>
        </div>
        <button className="text-gray-300 hover:text-[#334195] transition-colors">
          <Bookmark className="w-6 h-6" />
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          {job.type}
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          <DollarSign className="w-3 h-3" />
          {job.salary}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4 mt-2">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4" />
          {job.location}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          {job.postedAt}
        </div>
      </div>
    </div>
  );
}
