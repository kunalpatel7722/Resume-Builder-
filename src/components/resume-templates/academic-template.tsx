
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';

export const AcademicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
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
    <div className="bg-white text-gray-900 p-10 w-full h-full font-serif text-sm">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold">{fullName || 'Your Name'}</h1>
        <p className="text-md text-gray-700 mt-1">{experience[0]?.role || 'Professional Title'}</p>
        <div className="text-xs text-gray-600 mt-3">
          <span>{fullAddress}</span>
          {fullAddress && (personalInfo.phone || personalInfo.email) ? <span className="mx-2">·</span> : ''}
          <span>{personalInfo.phone}</span>
          {personalInfo.phone && personalInfo.email ? <span className="mx-2">·</span> : ''}
          <span>{personalInfo.email}</span>
        </div>
      </header>

      <hr className="border-gray-300 mb-6" />

      <main className="space-y-6">
        {summary && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700 mb-2">Professional Summary</h2>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </section>
        )}

        {education.length > 0 && education[0]?.school && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700 mb-3">Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3">
                 <div className="flex justify-between items-baseline">
                    <h3 className="text-md font-semibold">{edu.school || 'School Name'}</h3>
                    <p className="text-xs text-gray-600 font-medium">{edu.dates || 'Dates'}</p>
                </div>
                <p className="text-sm italic text-gray-800">{edu.degree || 'Degree'}</p>
              </div>
            ))}
          </section>
        )}

        {experience.length > 0 && experience[0]?.role && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700 mb-3">Professional Experience</h2>
            {experience.map((job) => {
              const location = [job.city, job.state].filter(Boolean).join(', ');
              return (
                <div key={job.id} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-md font-semibold">{job.role || 'Job Title'}</h3>
                    <p className="text-xs text-gray-600 font-medium">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                  </div>
                  <p className="text-sm font-medium italic text-gray-800">{job.company || 'Company Name'}{location && ` - ${location}`}</p>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none prose-serif text-gray-700">
                      {job.description}
                  </ReactMarkdown>
                </div>
              )
            })}
          </section>
        )}

        {skills.length > 0 && (
           <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700 mb-2">Areas of Expertise</h2>
            <p className="text-gray-700 text-sm">{skills.filter(skill => skill).join(', ')}</p>
           </section>
        )}
      </main>
    </div>
  );
};
