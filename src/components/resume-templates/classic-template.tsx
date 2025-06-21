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
  sm: 'text-[10pt]',
  md: 'text-[11pt]',
  lg: 'text-[12pt]',
};

export const ClassicTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, languages, certifications, activities, awards, websites, customSections, showReferences } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');

  const hasExperience = experience.some(e => e.role || e.company || e.description);
  const hasEducation = education.some(e => e.school || e.degree || e.fieldOfStudy);
  const hasSkills = skills.some(s => s);
  const hasCustomSections = customSections.some(c => c.title || c.content);

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'MMM yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'MMM yyyy')}`;
    return start;
  };

  const fontClass = fontClasses[fontSize];

  const Section: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-sm font-bold uppercase tracking-[.2em] text-center mb-3">{title}</h2>
        {children}
      </section>
    );
  };

  return (
    <div className={cn("bg-white text-black p-10 w-full h-full font-serif", fontClass)}>
      <header className="text-center mb-4">
        <h1 className="text-3xl font-bold tracking-widest">{fullName || 'Your Name'}</h1>
        <div className="text-xs text-gray-600 mt-2">
          <span>{fullAddress || 'Address'}</span>
          {(fullAddress && (personalInfo.phone || personalInfo.email)) ? <span className="mx-2">|</span> : ''}
          <span>{personalInfo.phone || 'Phone'}</span>
          {(personalInfo.phone && personalInfo.email) ? <span className="mx-2">|</span> : ''}
          <span>{personalInfo.email || 'Email'}</span>
        </div>
      </header>

      <div className="w-full h-px bg-gray-300 my-4" />

      <main className="space-y-4">
        <Section title="Summary">
          {summary ? (
            <p className="text-gray-800 leading-relaxed text-center">{summary}</p>
          ) : (
            <p className="text-gray-400 italic text-center">Your professional summary will appear here.</p>
          )}
        </Section>
        
        <Section title="Experience" show={hasExperience}>
          <div className="space-y-3">
            {experience.map((job) => {
              const location = [job.city, job.state].filter(Boolean).join(', ');
              return (
                <div key={job.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-base font-bold">{job.role || 'Job Title'}</h3>
                    <p className="text-xs text-gray-600 font-medium">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                  </div>
                  <p className="text-sm font-bold italic text-gray-700">{job.company || 'Company Name'}{location && `, ${location}`}</p>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-800">
                    {job.description || '* Your job description will appear here.'}
                  </ReactMarkdown>
                </div>
              );
            })}
          </div>
        </Section>

        <Section title="Education" show={hasEducation}>
          <div className="space-y-2">
            {education.map((edu) => {
              const gradDate = edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
              return (
                <div key={edu.id}>
                   <div className="flex justify-between items-baseline">
                      <h3 className="text-base font-bold">{edu.school || 'School Name'}</h3>
                      <p className="text-xs text-gray-600 font-medium">{gradDate || 'Date'}</p>
                  </div>
                  <p className="text-sm italic">{edu.degree || 'Degree'}{edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}</p>
                </div>
              );
            })}
          </div>
        </Section>

        <Section title="Skills" show={hasSkills}>
          <p className="text-center text-gray-800">{skills.join(' • ')}</p>
        </Section>

        {hasCustomSections && customSections.map(section => (
          <Section key={section.id} title={section.title || 'Custom Section'}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-800">
                {section.content || 'Your custom section content will appear here.'}
            </ReactMarkdown>
          </Section>
        ))}
      </main>
    </div>
  );
};
