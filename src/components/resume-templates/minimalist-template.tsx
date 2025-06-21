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
  const { personalInfo, summary, experience, education, skills, customSections } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const projects = customSections.filter(s => s.title.toLowerCase().includes('project'));

  const hasExperience = experience.some(e => e.role || e.company || e.description);
  const hasEducation = education.some(e => e.school || e.degree || e.fieldOfStudy);
  const hasSkills = skills.some(s => s);
  const hasProjects = projects.length > 0;

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'yyyy');
    if (isCurrent) return `present`;
    if (endDate) return `${start} - ${format(endDate, 'yyyy')}`;
    return start;
  };

  const fontClass = fontClasses[fontSize];

  const Section: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-3">{title}</h2>
        <div className="space-y-4">{children}</div>
      </section>
    );
  };

  return (
    <div className={cn("bg-white text-gray-800 p-12 w-full h-full", fontClass)}>
      <header className="mb-10" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        <h1 className="text-3xl font-bold tracking-wider">{fullName || 'Your Name'}</h1>
        <p className="text-sm text-gray-600 mt-2">{personalInfo.email} / {personalInfo.phone}</p>
      </header>

      <main className="space-y-8">
        <section>
          {summary ? (
            <p className="text-gray-700 leading-relaxed text-base">{summary}</p>
          ) : (
            <p className="text-gray-400 italic">Your professional summary will appear here.</p>
          )}
        </section>

        <Section title="Experience" show={hasExperience}>
          {experience.map(job => (
            <div key={job.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="text-base font-bold">{job.role || 'Job Title'} at {job.company || 'Company'}</h3>
                <p className="text-xs text-gray-500 font-mono">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
              </div>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
                {job.description || '* Your job description will appear here.'}
              </ReactMarkdown>
            </div>
          ))}
        </Section>
        
        <Section title="Projects" show={hasProjects}>
          {projects.map(p => (
              <div key={p.id}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
                  {p.content || '* Your projects will appear here.'}
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
                    <p className="text-xs text-gray-500 font-mono">{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                </div>
            ))}
        </Section>
        
        <Section title="Skills" show={hasSkills}>
            <p className="text-gray-700 leading-6 font-mono">{skills.join(' ')}</p>
        </Section>
      </main>
    </div>
  );
};
