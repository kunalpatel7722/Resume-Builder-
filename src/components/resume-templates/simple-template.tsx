
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

export const SimpleTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
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
  
  const fontClass = fontClasses[fontSize];

  return (
    <div className={cn("bg-white text-gray-800 p-10 w-full h-full font-sans", fontClass)}>
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
            {education.map((edu) => {
              const gradDate = edu.isStillEnrolled 
                ? 'Enrolled' 
                : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
              return (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <div>
                      <h3 className="text-md font-semibold text-gray-800">{edu.degree || 'Degree'}</h3>
                      <p className="text-sm text-gray-600">{edu.school || 'School Name'}</p>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">{gradDate || 'Date'}</p>
                </div>
              )
            })}
            </div>
          </section>
        )}
        
        {awards.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 mb-3">Awards</h2>
            <div className="space-y-4">
            {awards.map((award) => (
              <div key={award.id} className="flex justify-between items-baseline">
                <div>
                    <h3 className="text-md font-semibold text-gray-800">{award.name || 'Award Name'}</h3>
                    <p className="text-sm text-gray-600">{award.description}</p>
                </div>
                <p className="text-xs text-gray-500 font-medium">{award.date || 'Date'}</p>
              </div>
            ))}
            </div>
          </section>
        )}

        {certifications.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 mb-3">Certifications</h2>
            <div className="space-y-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline">
                <div>
                    <h3 className="text-md font-semibold text-gray-800">{cert.name || 'Certification Name'}</h3>
                    <p className="text-sm text-gray-600">{cert.issuer || 'Issuing Body'}</p>
                </div>
                <p className="text-xs text-gray-500 font-medium">{cert.date || 'Date'}</p>
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
        
        {activities.length > 0 && (
           <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 mb-3">Activities</h2>
            <p className="text-gray-700 text-sm leading-6">{activities.filter(a => a).join('  ·  ')}</p>
           </section>
        )}
        
        {websites.length > 0 && (
           <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 mb-3">Links</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
                {websites.map(site => (
                  <a key={site.id} href={site.url} className="hover:underline" style={{ color: accentColor }}>{site.label || site.url}</a>
                ))}
            </div>
           </section>
        )}
        
        {customSections.map(section => (
           <section key={section.id}>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 mb-3">{section.title}</h2>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
                {section.content}
            </ReactMarkdown>
           </section>
        ))}

        {languages.length > 0 && (
           <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 mb-3">Languages</h2>
            <p className="text-gray-700 text-sm leading-6">{languages.map(lang => `${lang.name} (${lang.level})`).join('  ·  ')}</p>
           </section>
        )}

        {showReferences && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 mb-3">References</h2>
            <p className="text-gray-700 text-sm leading-6">Available upon request.</p>
          </section>
        )}
      </main>
    </div>
  );
};
