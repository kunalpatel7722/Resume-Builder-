
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

export const ClassicTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
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

  return (
    <div className={cn("bg-white text-gray-900 p-10 shadow-lg w-full h-full font-serif", fontClasses[fontSize])}>
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold tracking-widest uppercase">{fullName || 'Your Name'}</h1>
        <div className="text-xs text-gray-600 mt-2">
          <span>{fullAddress || 'Address'}</span>
          {(fullAddress && (personalInfo.phone || personalInfo.email)) ? <span className="mx-2">|</span> : ''}
          <span>{personalInfo.phone || 'Phone'}</span>
          {(personalInfo.phone && personalInfo.email) ? <span className="mx-2">|</span> : ''}
          <span>{personalInfo.email || 'Email'}</span>
        </div>
      </header>

      <hr className="border-gray-400 mb-6" />

      <main>
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-2 text-center">Summary</h2>
          {summary ? (
            <p className="text-gray-700 leading-relaxed text-justify">{summary}</p>
          ) : (
            <p className="text-gray-400 italic text-sm text-center">Your summary will appear here.</p>
          )}
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-3 text-center">Experience</h2>
          {hasExperience ? (
            experience.map((job) => {
              const location = [job.city, job.state].filter(Boolean).join(', ');
              return (
                <div key={job.id} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-md font-semibold">{job.role || 'Job Title'}</h3>
                    <p className="text-xs text-gray-600 font-medium">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                  </div>
                  <p className="text-sm font-medium italic text-gray-800">{job.company || 'Company Name'}{location && ` - ${location}`}</p>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none prose-serif text-gray-700">
                      {job.description || '* Your job description will appear here.'}
                  </ReactMarkdown>
                </div>
              )
            })
          ) : (
             <p className="text-gray-400 italic text-sm text-center">Your experience will appear here.</p>
          )}
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-3 text-center">Education</h2>
          {hasEducation ? (
            education.map((edu) => {
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
            })
          ) : (
            <p className="text-gray-400 italic text-sm text-center">Your education will appear here.</p>
          )}
        </section>
        
        {hasAwards && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider mb-3 text-center">Awards & Accomplishments</h2>
            {awards.map((award) => (
              <div key={award.id} className="mb-2 text-center">
                 <p className="text-md font-semibold">{award.name || 'Award Name'} - {award.date || 'Date'}</p>
                 <p className="text-sm italic text-gray-800">{award.description}</p>
              </div>
            ))}
          </section>
        )}
        
        {hasCertifications && (
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

        {hasSkills && (
           <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider mb-2 text-center">Skills</h2>
            <p className="text-gray-700 text-sm text-center">{skills.filter(skill => skill).join(' • ')}</p>
           </section>
        )}

        {hasActivities && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider mb-2 text-center">Activities</h2>
            <p className="text-gray-700 text-sm text-center">{activities.filter(a => a).join(' • ')}</p>
          </section>
        )}
        
        {hasWebsites && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider mb-2 text-center">Links</h2>
            <div className="text-center">
              {websites.map((site) => (
                <a key={site.id} href={site.url} className="hover:underline text-sm mx-2" style={{ color: accentColor }}>{site.label || site.url}</a>
              ))}
            </div>
          </section>
        )}

        {hasCustomSections && customSections.map(section => (
          <section key={section.id} className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider mb-2 text-center">{section.title}</h2>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none prose-serif text-gray-700">
                {section.content}
            </ReactMarkdown>
          </section>
        ))}

        {hasLanguages && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-2 text-center">Languages</h2>
            <p className="text-gray-700 text-sm text-center">
                {languages.map(lang => `${lang.name} (${lang.level})`).join(' • ')}
            </p>
          </section>
        )}

        {showReferences && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-2 text-center">References</h2>
            <p className="text-gray-700 text-sm text-center">Available upon request.</p>
          </section>
        )}
      </main>
    </div>
  );
};
