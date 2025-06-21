
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';

export const MinimalistTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills } = data;

  return (
    <div className="bg-white text-gray-800 p-12 w-full h-full font-light tracking-wide text-sm">
      <header className="text-left mb-10">
        <h1 className="text-5xl font-thin tracking-widest uppercase">{personalInfo.name || 'Your Name'}</h1>
        <div className="text-xs text-gray-500 mt-3 space-x-4">
          <span>{personalInfo.address}</span>
          <span>{personalInfo.phone}</span>
          <span>{personalInfo.email}</span>
        </div>
      </header>
      
      <div className="w-full h-px bg-gray-200 mb-10" />

      <main className="space-y-10">
        {summary && (
          <section>
            <p className="text-gray-600 leading-7">{summary}</p>
          </section>
        )}

        {experience.length > 0 && experience[0]?.role && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Experience</h2>
            <div className="space-y-6">
                {experience.map((job) => (
                <div key={job.id}>
                    <div className="flex justify-between items-baseline">
                    <h3 className="text-lg font-normal">{job.role || 'Job Title'}</h3>
                    <p className="text-xs text-gray-500">{job.dates || 'Dates'}</p>
                    </div>
                    <p className="text-md text-gray-600">{job.company || 'Company Name'}</p>
                    <ul className="mt-2 text-gray-600 space-y-1 text-sm list-disc list-outside pl-4 font-light">
                    {job.description.split('\n').filter(line => line.trim() !== '').map((desc, i) => (
                        <li key={i} className="pl-2">{desc.replace(/^•\s*/, '')}</li>
                    ))}
                    </ul>
                </div>
                ))}
            </div>
          </section>
        )}

        {education.length > 0 && education[0]?.school && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Education</h2>
            <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                 <div className="flex justify-between items-baseline">
                    <h3 className="text-lg font-normal">{edu.degree || 'Degree'}</h3>
                    <p className="text-xs text-gray-500">{edu.dates || 'Dates'}</p>
                </div>
                <p className="text-md text-gray-600">{edu.school || 'School Name'}</p>
              </div>
            ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
           <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Skills</h2>
            <p className="text-gray-600 leading-6">{skills.filter(skill => skill).join(', ')}</p>
           </section>
        )}
      </main>
    </div>
  );
};
