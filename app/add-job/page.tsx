'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AddJob() {
  const [job, setJob] = useState({
    job_name: '',
    employer_name: '',
    salary: '',
    due_date: '',
    currency: '$', // Default currency
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!job.job_name || !job.employer_name || !job.salary || !job.due_date || !job.currency) {
      alert('Please fill in all fields.');
      return;
    }

    setLoading(true);
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    await supabase.from('jobs').insert([
      {
        ...job,
        salary: Number(job.salary),
        user_id: user.id,
      },
    ]);

    setLoading(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Add a New Job</h1>
        <input
          placeholder="Job name"
          className="w-full px-4 py-2 border rounded-md mb-3 focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setJob({ ...job, job_name: e.target.value })}
        />
        <input
          placeholder="Employer name"
          className="w-full px-4 py-2 border rounded-md mb-3 focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setJob({ ...job, employer_name: e.target.value })}
        />
        <div className="flex gap-2 mb-3">
          <select
            value={job.currency}
            className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setJob({ ...job, currency: e.target.value })}
          >
            <option value="$">💵 USD ($)</option>
            <option value="₹">🇮🇳 INR (₹)</option>
          </select>
          <input
            placeholder="Salary"
            type="number"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setJob({ ...job, salary: e.target.value })}
          />
        </div>
        <input
          placeholder="Due date"
          type="date"
          className="w-full px-4 py-2 border rounded-md mb-4 focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setJob({ ...job, due_date: e.target.value })}
        />
        <button
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Job'}
        </button>
      </div>
    </div>
  );
}