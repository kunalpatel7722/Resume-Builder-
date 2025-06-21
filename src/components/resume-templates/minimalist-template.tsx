
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

export const MinimalistTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, languages, certifications, activities, awards, websites, customSections, showReferences } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');

  const hasExperience = experience.some(e => e.role || e.company || e.description);
  const hasEducation = education.some(e => e.school || e.degree || e.fieldOfStudy);
  const hasSkills = skills.some(s => s);
  const hasLanguages = languages.some(l => l.name);
  const hasCertifications = certifications.some(c => c.name);
  const hasActivities = activities.some(a => a);
  const hasAwards = awards.some(a => a.name);
  const hasWebsites = websites.some(w => w.url);
  const hasCustomSections = customSections.some(c => c.title || c.content);

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return 'Dates';
    const start = format(startDate, 'MMM yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'MMM yyyy')}`;
    return start;
  };

  const fontClass = fontClasses[fontSize];

  return (
    <div className={cn("bg-white text-gray-800 p-12 w-full h-full font-light tracking-wide", fontClass)}>
      <header className="text-left mb-10">
        <h1 className="text-5xl font-thin tracking-widest uppercase">{fullName || 'Your Name'}</h1>
        <div className="text-xs text-gray-500 mt-3 space-x-4">
          <span>{fullAddress || 'Address'}</span>
          <span>{personalInfo.phone || 'Phone'}</span>
          <span>{personalInfo.email || 'Email'}</span>
        </div>
      </header>
      
      <div className="w-full h-px bg-gray-200 mb-10" />

      <main className="space-y-10">
        <section>
            {summary ? (
                <p className="text-gray-600 leading-7">{summary}</p>
            ) : (
                <p className="text-gray-400 italic text-sm">Your summary will appear here.</p>
            )}
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Experience</h2>
          {hasExperience ? (
            <div className="space-y-6">
                {experience.map((job) => {
                  const location = [job.city, job.state].filter(Boolean).join(', ');
                  return (
                    <div key={job.id}>
                        <div className="flex justify-between items-baseline">
                        <h3 className="text-lg font-normal">{job.role || 'Job Title'}</h3>
                        <p className="text-xs text-gray-500">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                        </div>
                        <p className="text-md text-gray-600">{job.company || 'Company Name'}{location && ` - ${location}`}</p>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm prose-p:font-light max-w-none text-gray-600">
                          {job.description || '* Your job description will appear here.'}
                        </ReactMarkdown>
                    </div>
                  )
                })}
            </div>
          ) : (
            <p className="text-gray-400 italic text-sm">Your experience will appear here.</p>
          )}
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Education</h2>
          {hasEducation ? (
            <div className="space-y-4">
            {education.map((edu) => {
              const gradDate = edu.isStillEnrolled 
                ? 'Enrolled' 
                : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
              return (
                <div key={edu.id}>
                   <div className="flex justify-between items-baseline">
                      <h3 className="text-lg font-normal">{edu.degree || 'Degree'}{edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}</h3>
                      <p className="text-xs text-gray-500">{gradDate || 'Date'}</p>
                  </div>
                  <p className="text-md text-gray-600">{edu.school || 'School Name'}</p>
                </div>
              )
            })}
            </div>
          ) : (
            <p className="text-gray-400 italic text-sm">Your education will appear here.</p>
          )}
        </section>

        {hasAwards && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Awards</h2>
            <div className="space-y-4">
            {awards.map((award) => (
              <div key={award.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-lg font-normal">{award.name || 'Award Name'}</h3>
                    <p className="text-xs text-gray-500">{award.date || 'Date'}</p>
                  </div>
                  <p className="text-md text-gray-600">{award.description}</p>
              </div>
            ))}
            </div>
          </section>
        )}

        {hasCertifications && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Certifications</h2>
            <div className="space-y-4">
            {certifications.map((cert) => (
              <div key={cert.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-lg font-normal">{cert.name || 'Certification Name'}</h3>
                    <p className="text-xs text-gray-500">{cert.date || 'Date'}</p>
                  </div>
                  <p className="text-md text-gray-600">{cert.issuer || 'Issuing Body'}</p>
              </div>
            ))}
            </div>
          </section>
        )}

        {hasSkills && (
           <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Skills</h2>
            <p className="text-gray-600 leading-6">{skills.filter(skill => skill).join(', ')}</p>
           </section>
        )}

        {hasActivities && (
            <section>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Activities</h2>
                <p className="text-gray-600 leading-6">{activities.filter(a => a).join(', ')}</p>
            </section>
        )}

        {hasWebsites && (
            <section>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Links</h2>
                 <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {websites.map(site => (
                      <a key={site.id} href={site.url} className="hover:underline" style={{ color: accentColor }}>{site.label || site.url}</a>
                    ))}
                </div>
            </section>
        )}
        
        {hasCustomSections && customSections.map(section => (
          <section key={section.id}>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">{section.title}</h2>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm prose-p:font-light max-w-none text-gray-600">
                {section.content}
            </ReactMarkdown>
          </section>
        ))}

        {hasLanguages && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Languages</h2>
            <p className="text-gray-600 leading-6">
              {languages.map(lang => `${lang.name} (${lang.level})`).join(', ')}
            </p>
          </section>
        )}

        {showReferences && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">References</h2>
            <p className="text-gray-600 leading-6">Available upon request.</p>
          </section>
        )}
      </main>
    </div>
  );
};
