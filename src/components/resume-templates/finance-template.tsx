
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Star, TrendingUp } from 'lucide-react';

export const FinanceTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills } = data;

  return (
    <div className="bg-white text-gray-800 w-full h-full font-sans flex text-xs">
        <aside className="w-1/3 bg-gray-50 p-6 flex flex-col">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">{personalInfo.name || 'Your Name'}</h1>
                <h2 className="text-md text-primary">{experience[0]?.role || 'Finance Analyst'}</h2>
            </header>
            
            <div className="space-y-6">
                <section>
                    <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-2">Contact</h3>
                    <div className="space-y-2 text-xs text-gray-600">
                        {personalInfo.email && <p>{personalInfo.email}</p>}
                        {personalInfo.phone && <p>{personalInfo.phone}</p>}
                        {personalInfo.address && <p>{personalInfo.address}</p>}
                    </div>
                </section>

                {skills.length > 0 && (
                    <section>
                        <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-2">Skills</h3>
                        <ul className="space-y-1">
                            {skills.filter(skill => skill).map((skill, index) => (
                                <li key={index} className="text-gray-700">{skill}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {education.length > 0 && education[0]?.school && (
                    <section>
                        <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-2">Education</h3>
                        {education.map((edu) => (
                          <div key={edu.id} className="text-gray-700">
                             <h4 className="font-semibold">{edu.school || 'University Name'}</h4>
                             <p>{edu.degree || 'Degree'}</p>
                             <p className="text-gray-500">{edu.dates || 'Dates'}</p>
                          </div>
                        ))}
                    </section>
                )}
            </div>
        </aside>

        <main className="w-2/3 p-8">
            {summary && (
              <section className="mb-6">
                <h2 className="text-lg font-bold text-gray-800 pb-1 border-b-2 border-gray-200 mb-2">Career Objective</h2>
                <p className="text-gray-600 leading-relaxed">{summary}</p>
              </section>
            )}

            {experience.length > 0 && experience[0]?.role && (
              <section>
                <h2 className="text-lg font-bold text-gray-800 pb-1 border-b-2 border-gray-200 mb-3">Professional Experience</h2>
                <div className="space-y-4">
                  {experience.map((job) => (
                    <div key={job.id}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-base font-bold text-gray-900">{job.role || 'Job Title'}</h3>
                        <p className="text-xs text-gray-500 font-medium">{job.dates || 'Dates'}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-700">{job.company || 'Company Name'}</p>
                      <ul className="mt-2 text-gray-600 space-y-1 text-sm list-disc list-outside pl-4">
                        {job.description.split('\n').filter(line => line.trim() !== '').map((desc, i) => (
                          <li key={i}>{desc.replace(/^•\s*/, '')}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}
        </main>
    </div>
  );
};
