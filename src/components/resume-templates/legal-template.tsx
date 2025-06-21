
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Scale, Award, Trophy, Activity, Link as LinkIcon, Pencil, Users, Languages } from 'lucide-react';
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
  sm: 'text-[10pt]',
  md: 'text-[11pt]',
  lg: 'text-[12pt]',
};

export const LegalTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
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
    <div className={cn("bg-white text-black p-10 w-full h-full font-serif", fontClass)}>
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-wider">{fullName || 'Your Name'}</h1>
        <div className="text-sm text-gray-700 mt-2 space-x-3">
          <span>{fullAddress || 'Address'}</span>
          <span>|</span>
          <span>{personalInfo.phone || 'Phone'}</span>
          <span>|</span>
          <span>{personalInfo.email || 'Email'}</span>
        </div>
      </header>

      <div className="w-1/4 h-px bg-black mx-auto mb-6" />

      <main className="space-y-5">
        <section>
          <h2 className="text-lg font-bold tracking-widest text-center mb-2">SUMMARY OF QUALIFICATIONS</h2>
          {summary ? (
            <p className="text-gray-800 leading-relaxed text-justify">{summary}</p>
          ) : (
            <p className="text-gray-400 italic text-sm text-center">Your summary will appear here.</p>
          )}
        </section>

        <section>
          <h2 className="text-lg font-bold tracking-widest text-center mb-3">PROFESSIONAL EXPERIENCE</h2>
          {hasExperience ? (
            experience.map((job) => {
              const location = [job.city, job.state].filter(Boolean).join(', ');
              return (
                <div key={job.id} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-md font-bold">{job.company || 'Law Firm / Company'}{location && `, ${location}`}</h3>
                    <p className="text-sm font-medium">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                  </div>
                  <p className="text-md italic">{job.role || 'Job Title'}</p>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none prose-serif text-gray-800">
                      {job.description || '* Your job description will appear here.'}
                  </ReactMarkdown>
                </div>
              )
            })
          ) : (
            <p className="text-gray-400 italic text-sm text-center">Your experience will appear here.</p>
          )}
        </section>

        <section>
          <h2 className="text-lg font-bold tracking-widest text-center mb-3">EDUCATION</h2>
          {hasEducation ? (
            education.map((edu) => {
              const gradDate = edu.isStillEnrolled 
                ? 'Enrolled' 
                : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
              return (
                <div key={edu.id} className="mb-2">
                   <div className="flex justify-between items-baseline">
                      <h3 className="text-md font-bold">{edu.school || 'Law School Name'}</h3>
                      <p className="text-sm font-medium">{gradDate || 'Date'}</p>
                  </div>
                  <p className="text-md italic">{edu.degree || 'Juris Doctor'}</p>
                </div>
              )
            })
          ) : (
             <p className="text-gray-400 italic text-sm text-center">Your education will appear here.</p>
          )}
        </section>
        
        {hasSkills && (
           <section>
            <h2 className="text-lg font-bold tracking-widest text-center mb-2">ADMISSIONS & SKILLS</h2>
            <p className="text-gray-800 text-sm text-center">{skills.filter(skill => skill).join('; ')}</p>
           </section>
        )}

        {hasAwards && (
          <section>
            <h2 className="text-lg font-bold tracking-widest text-center mb-3">AWARDS & HONORS</h2>
            {awards.map((award) => (
              <div key={award.id} className="mb-2 text-center">
                 <p className="text-md">{award.name || 'Award Name'}, {award.date || 'Date'}</p>
              </div>
            ))}
          </section>
        )}

        {hasCertifications && (
          <section>
            <h2 className="text-lg font-bold tracking-widest text-center mb-3">CERTIFICATIONS</h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-2 text-center">
                 <p className="text-md font-bold">{cert.name || 'Certification Name'}</p>
                 <p className="text-md italic">{cert.issuer || 'Issuing Body'} - {cert.date || 'Date'}</p>
              </div>
            ))}
          </section>
        )}

        {hasActivities && (
          <section>
            <h2 className="text-lg font-bold tracking-widest text-center mb-2">ACTIVITIES</h2>
            <p className="text-gray-800 text-sm text-center">{activities.filter(a => a).join('; ')}</p>
          </section>
        )}

        {hasCustomSections && customSections.map(section => (
          <section key={section.id}>
            <h2 className="text-lg font-bold tracking-widest text-center mb-2">{section.title}</h2>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none prose-serif text-gray-800 text-center">
                {section.content}
            </ReactMarkdown>
          </section>
        ))}

        {hasLanguages && (
          <section>
            <h2 className="text-lg font-bold tracking-widest text-center mb-2">LANGUAGES</h2>
            <p className="text-gray-800 text-sm text-center">
                {languages.map(lang => `${lang.name} (${lang.level})`).join('; ')}
            </p>
          </section>
        )}
        
        {showReferences && (
          <section>
            <h2 className="text-lg font-bold tracking-widest text-center mb-2">REFERENCES</h2>
            <p className="text-gray-800 text-sm text-center">Available upon request.</p>
          </section>
        )}
      </main>
    </div>
  );
};
