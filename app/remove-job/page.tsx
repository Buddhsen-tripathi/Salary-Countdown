'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Job = {
  id: string;
  job_name: string;
  employer_name: string;
};

export default function RemoveJob() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;
      const { data } = await supabase
        .from('jobs')
        .select('id, job_name, employer_name')
        .eq('user_id', user.id);
      setJobs((data as Job[]) || []);
    };
    fetchJobs();
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this job?');
    if (!confirm) return;

    await supabase.from('jobs').delete().eq('id', id);
    setJobs(jobs.filter(job => job.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Remove Job</h1>
        {jobs.length === 0 ? (
          <p className="text-gray-500 text-center">No jobs found.</p>
        ) : (
          jobs.map(job => (
            <div key={job.id} className="flex justify-between items-center border-b py-3">
              <div>
                <p className="font-medium">{job.job_name}</p>
                <p className="text-sm text-gray-600">{job.employer_name}</p>
              </div>
              <button
                onClick={() => handleDelete(job.id)}
                className="text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}