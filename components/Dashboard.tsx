'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { differenceInDays } from 'date-fns';
import Link from 'next/link';

type Job = {
    id: string;
    job_name: string;
    employer_name: string;
    salary: number;
    due_date: string;
    user_id: string;
    currency: string;
};

export default function Dashboard() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState<string | null>(null);

    const fetchJobs = async () => {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) return;
        const { data } = await supabase
            .from('jobs')
            .select('*')
            .eq('user_id', user.id);
        setJobs((data as Job[]) || []);
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleDelete = async (id: string) => {
        const confirm = window.confirm('Are you sure you want to delete this job?');
        if (!confirm) return;

        setLoading(id);
        await supabase.from('jobs').delete().eq('id', id);
        setJobs(jobs.filter((job) => job.id !== id));
        setLoading(null);
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Your Jobs</h1>
                <Link
                    href="/add-job"
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-700 transition"
                >
                    ➕ Add Job
                </Link>
            </div>

            {jobs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl shadow-md">
                    <p className="text-gray-600 text-lg mb-4">No jobs found</p>
                    <Link
                        href="/add-job"
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                        Add your first job
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {jobs.map((job) => {
                        const days = differenceInDays(new Date(job.due_date), new Date());
                        return (
                            <div
                                key={job.id}
                                className="bg-white rounded-xl shadow-md p-5 flex justify-between items-center"
                            >
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        {job.job_name}{' '}
                                        <span className="text-gray-500">@ {job.employer_name}</span>
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        💰 Salary: {job.currency}{job.salary}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm text-gray-400">Due in</p>
                                    <p
                                        className={`text-lg font-semibold ${days <= 0 ? 'text-red-500' : 'text-blue-600'
                                            }`}
                                    >
                                        {days > 0 ? `${days} days` : '💸 Already Due!'}
                                    </p>
                                    <button
                                        className="text-red-500 text-sm mt-2 hover:underline"
                                        onClick={() => handleDelete(job.id)}
                                        disabled={loading === job.id}
                                    >
                                        {loading === job.id ? 'Removing...' : '🗑️ Remove'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}