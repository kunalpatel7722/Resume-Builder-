
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const ClassicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');

  return (
    <div className="bg-white text-gray-900 p-10 shadow-lg w-full h-full font-serif text-sm">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold tracking-widest uppercase">{fullName || 'Your Name'}</h1>
        <div className="text-xs text-gray-600 mt-2">
          <span>{fullAddress}</span>
          {fullAddress && (personalInfo.phone || personalInfo.email) ? <span className="mx-2">|</span> : ''}
          <span>{personalInfo.phone}</span>
          {personalInfo.phone && personalInfo.email ? <span className="mx-2">|</span> : ''}
          <span>{personalInfo.email}</span>
        </div>
      </header>

      <hr className="border-gray-400 mb-6" />

      <main>
        {summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider mb-2 text-center">Summary</h2>
            <p className="text-gray-700 leading-relaxed text-justify">{summary}</p>
          </section>
        )}

        {experience.length > 0 && experience[0]?.role && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider mb-3 text-center">Experience</h2>
            {experience.map((job) => (
              <div key={job.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-md font-semibold">{job.role || 'Job Title'}</h3>
                  <p className="text-xs text-gray-600 font-medium">{job.dates || 'Dates'}</p>
                </div>
                <p className="text-sm font-medium italic text-gray-800">{job.company || 'Company Name'}</p>
                <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm max-w-none prose-serif text-gray-700">
                    {job.description}
                </ReactMarkdown>
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && education[0]?.school && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider mb-3 text-center">Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                 <div className="flex justify-between items-baseline">
                    <h3 className="text-md font-semibold">{edu.degree || 'Degree'}</h3>
                    <p className="text-xs text-gray-600 font-medium">{edu.dates || 'Dates'}</p>
                </div>
                <p className="text-sm font-medium italic text-gray-800">{edu.school || 'School Name'}</p>
              </div>
            ))}
          </section>
        )}

        {skills.length > 0 && (
           <section>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-2 text-center">Skills</h2>
            <p className="text-gray-700 text-sm text-center">{skills.filter(skill => skill).join(' • ')}</p>
           </section>
        )}
      </main>
    </div>
  );
};
