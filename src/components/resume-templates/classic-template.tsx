
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { Award, Globe } from 'lucide-react';


export const ClassicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, languages, certifications } = data;
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

        {education.length > 0 && education[0]?.school && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider mb-3 text-center">Education</h2>
            {education.map((edu) => {
               const gradDate = edu.isStillEnrolled 
                ? 'Enrolled' 
                : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
              return (
                <div key={edu.id} className="mb-2">
                   <div className="flex justify-between items-baseline">
                      <h3 className="text-md font-semibold">{edu.degree || 'Degree'}{edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}</h3>
                      <p className="text-xs text-gray-600 font-medium">{gradDate || 'Date'}</p>
                  </div>
                  <p className="text-sm font-medium italic text-gray-800">{edu.school || 'School Name'}{edu.location && `, ${edu.location}`}</p>
                </div>
              )
            })}
          </section>
        )}
        
        {certifications.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider mb-3 text-center">Certifications</h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-2 text-center">
                 <p className="text-md font-semibold">{cert.name || 'Certification Name'}</p>
                 <p className="text-sm italic text-gray-800">{cert.issuer || 'Issuing Body'} - {cert.date || 'Date'}</p>
              </div>
            ))}
          </section>
        )}

        {skills.length > 0 && (
           <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider mb-2 text-center">Skills</h2>
            <p className="text-gray-700 text-sm text-center">{skills.filter(skill => skill).join(' • ')}</p>
           </section>
        )}

        {languages.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-2 text-center">Languages</h2>
            <p className="text-gray-700 text-sm text-center">
                {languages.map(lang => `${lang.name} (${lang.level})`).join(' • ')}
            </p>
          </section>
        )}
      </main>
    </div>
  );
};
