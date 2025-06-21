
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';

export const SimpleTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return 'Dates';
    const start = format(startDate, 'MMM yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'MMM yyyy')}`;
    return start;
  };

  return (
    <div className="bg-white text-gray-800 p-10 w-full h-full font-sans text-sm">
      <header className="text-left mb-8">
        <h1 className="text-4xl font-bold text-gray-900">{fullName || 'Your Name'}</h1>
        <p className="text-md text-gray-600 mt-1">{experience[0]?.role || 'Professional Title'}</p>
        <div className="text-xs text-gray-500 mt-3 space-x-4 border-t pt-2 mt-2">
          <span>{personalInfo.phone}</span>
          <span>{personalInfo.email}</span>
          <span>{fullAddress}</span>
        </div>
      </header>
      
      <main className="space-y-8">
        {summary && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 mb-2">Summary</h2>
            <p className="text-gray-700 leading-relaxed text-sm">{summary}</p>
          </section>
        )}

        {experience.length > 0 && experience[0]?.role && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 mb-3">Experience</h2>
            <div className="space-y-5">
                {experience.map((job) => {
                  const location = [job.city, job.state].filter(Boolean).join(', ');
                  return (
                    <div key={job.id}>
                        <div className="flex justify-between items-baseline">
                            <div>
                               <h3 className="text-md font-semibold text-gray-800">{job.role || 'Job Title'}</h3>
                               <p className="text-sm text-gray-600">{job.company || 'Company Name'}{location && ` - ${location}`}</p>
                            </div>
                            <p className="text-xs text-gray-500 font-medium">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                        </div>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
                            {job.description}
                        </ReactMarkdown>
                    </div>
                  )
                })}
            </div>
          </section>
        )}

        {education.length > 0 && education[0]?.school && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 mb-3">Education</h2>
            <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                    <h3 className="text-md font-semibold text-gray-800">{edu.degree || 'Degree'}</h3>
                    <p className="text-sm text-gray-600">{edu.school || 'School Name'}</p>
                </div>
                <p className="text-xs text-gray-500 font-medium">{edu.dates || 'Dates'}</p>
              </div>
            ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
           <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 mb-3">Skills</h2>
            <p className="text-gray-700 text-sm leading-6">{skills.filter(skill => skill).join('  ·  ')}</p>
           </section>
        )}
      </main>
    </div>
  );
};
