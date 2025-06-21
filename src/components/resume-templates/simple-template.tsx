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
  const { personalInfo, summary, experience, education, skills } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');

  const hasExperience = experience.some(e => e.role || e.company || e.description);
  const hasEducation = education.some(e => e.school || e.degree || e.fieldOfStudy);
  const hasSkills = skills.some(s => s);

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
        <h2 className="text-sm font-bold uppercase tracking-[.2em] text-gray-600 mb-2">{title}</h2>
        <div className="space-y-4">{children}</div>
      </section>
    );
  };
  
  return (
    <div className={cn("bg-white text-gray-800 p-10 w-full h-full", fontClass)} style={{ fontFamily: "'Open Sans', sans-serif" }}>
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold">{fullName || 'Your Name'}</h1>
        <p className="text-lg text-gray-600 mt-1">{hasExperience ? experience[0]?.role : 'Professional Title'}</p>
        <p className="text-xs text-gray-500 mt-3">{personalInfo.phone} &bull; {personalInfo.email} &bull; {fullAddress}</p>
      </header>
      
      <main className="space-y-6">
        <Section title="Summary">
          {summary ? (
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          ) : (
            <p className="text-gray-400 italic">Your professional summary will appear here.</p>
          )}
        </Section>

        <Section title="Experience" show={hasExperience}>
          {experience.map(job => (
            <div key={job.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="text-base font-bold">{job.role || 'Job Title'}</h3>
                <p className="text-xs text-gray-500 font-medium">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
              </div>
              <p className="text-sm font-semibold italic text-gray-600">{job.company || 'Company Name'}</p>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
                {job.description || '* Your job description will appear here.'}
              </ReactMarkdown>
            </div>
          ))}
        </Section>
        
        <Section title="Education" show={hasEducation}>
            {education.map(edu => (
                <div key={edu.id} className="flex justify-between items-baseline">
                    <div>
                        <h3 className="text-base font-bold">{edu.school || 'University Name'}</h3>
                        <p className="text-sm text-gray-600">{edu.degree || 'Degree'}</p>
                    </div>
                    <p className="text-xs text-gray-500">{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                </div>
            ))}
        </Section>
        
        <Section title="Skills" show={hasSkills}>
            <p className="text-gray-700">{skills.join(' | ')}</p>
        </Section>
      </main>
    </div>
  );
};
