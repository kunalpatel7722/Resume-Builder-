
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Scale } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const LegalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');

  return (
    <div className="bg-white text-black p-10 w-full h-full font-serif text-[11pt]">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-wider">{fullName || 'Your Name'}</h1>
        <div className="text-sm text-gray-700 mt-2 space-x-3">
          <span>{fullAddress}</span>
          <span>|</span>
          <span>{personalInfo.phone}</span>
          <span>|</span>
          <span>{personalInfo.email}</span>
        </div>
      </header>

      <div className="w-1/4 h-px bg-black mx-auto mb-6" />

      <main className="space-y-5">
        {summary && (
          <section>
            <h2 className="text-lg font-bold tracking-widest text-center mb-2">SUMMARY OF QUALIFICATIONS</h2>
            <p className="text-gray-800 leading-relaxed text-justify">{summary}</p>
          </section>
        )}

        {experience.length > 0 && experience[0]?.role && (
          <section>
            <h2 className="text-lg font-bold tracking-widest text-center mb-3">PROFESSIONAL EXPERIENCE</h2>
            {experience.map((job) => (
              <div key={job.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-md font-bold">{job.company || 'Law Firm / Company'}</h3>
                  <p className="text-sm font-medium">{job.dates || 'Dates'}</p>
                </div>
                <p className="text-md italic">{job.role || 'Job Title'}</p>
                <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm max-w-none prose-serif text-gray-800">
                    {job.description}
                </ReactMarkdown>
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && education[0]?.school && (
          <section>
            <h2 className="text-lg font-bold tracking-widest text-center mb-3">EDUCATION</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                 <div className="flex justify-between items-baseline">
                    <h3 className="text-md font-bold">{edu.school || 'Law School Name'}</h3>
                    <p className="text-sm font-medium">{edu.dates || 'Dates'}</p>
                </div>
                <p className="text-md italic">{edu.degree || 'Juris Doctor'}</p>
              </div>
            ))}
          </section>
        )}
        
        {skills.length > 0 && (
           <section>
            <h2 className="text-lg font-bold tracking-widest text-center mb-2">ADMISSIONS & SKILLS</h2>
            <p className="text-gray-800 text-sm text-center">{skills.filter(skill => skill).join('; ')}</p>
           </section>
        )}
      </main>
    </div>
  );
};
