
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';

export interface TemplateProps {
  data: ResumeData;
  accentColor: string;
  fontSize: 'sm' | 'md' | 'lg';
}

const fontClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export const AcademicTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, languages, certifications, activities, awards, websites, customSections, showReferences } = data;
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
    <div className={cn("bg-white text-gray-900 p-10 w-full h-full font-serif", fontClasses[fontSize])}>
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
            {education.map((edu) => {
               const gradDate = edu.isStillEnrolled 
                ? 'Enrolled' 
                : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
              return (
                <div key={edu.id} className="mb-3">
                   <div className="flex justify-between items-baseline">
                      <h3 className="text-md font-semibold">{edu.school || 'School Name'}{edu.location && `, ${edu.location}`}</h3>
                      <p className="text-xs text-gray-600 font-medium">{gradDate || 'Date'}</p>
                  </div>
                  <p className="text-sm italic text-gray-800">{edu.degree || 'Degree'}{edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}</p>
                </div>
              )
            })}
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

        {awards.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700 mb-3">Awards & Accomplishments</h2>
            {awards.map((award) => (
              <div key={award.id} className="mb-2">
                 <h3 className="text-md font-semibold">{award.name || 'Award Name'} <span className="font-normal text-gray-600">- {award.date || 'Date'}</span></h3>
                 <p className="text-sm italic text-gray-800">{award.description}</p>
              </div>
            ))}
          </section>
        )}

        {skills.length > 0 && (
           <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700 mb-2">Areas of Expertise</h2>
            <p className="text-gray-700 text-sm">{skills.filter(skill => skill).join(', ')}</p>
           </section>
        )}
        
        {certifications.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700 mb-3">Certifications</h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-2">
                 <h3 className="text-md font-semibold">{cert.name || 'Certification Name'}</h3>
                 <p className="text-sm italic text-gray-800">{cert.issuer || 'Issuing Body'} - {cert.date || 'Date'}</p>
              </div>
            ))}
          </section>
        )}

        {websites.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700 mb-2">Websites & Links</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {websites.map((site) => (
                <a key={site.id} href={site.url} className="hover:underline text-sm" style={{ color: accentColor }}>{site.label || site.url}</a>
              ))}
            </div>
          </section>
        )}

        {activities.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700 mb-2">Activities</h2>
            <p className="text-gray-700 text-sm">{activities.filter(a => a).join(', ')}</p>
          </section>
        )}
        
        {customSections.map(section => (
          <section key={section.id}>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700 mb-2">{section.title}</h2>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none prose-serif text-gray-700">
                {section.content}
            </ReactMarkdown>
          </section>
        ))}

        {languages.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700 mb-2">Languages</h2>
            <p className="text-gray-700 text-sm">
                {languages.map(lang => `${lang.name} (${lang.level})`).join(', ')}
            </p>
          </section>
        )}

        {showReferences && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700 mb-2">References</h2>
            <p className="text-gray-700 text-sm">Available upon request.</p>
          </section>
        )}
      </main>
    </div>
  );
};
