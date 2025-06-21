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

export const TechnicalTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, certifications, customSections } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const projects = customSections.filter(s => s.title.toLowerCase().includes('project'));

  const hasExperience = experience.some(e => e.role || e.company || e.description);
  const hasEducation = education.some(e => e.school || e.degree || e.fieldOfStudy);
  const hasSkills = skills.some(s => s);
  const hasCertifications = certifications.some(c => c.name);
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
        <h2 className="text-base font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>{title}</h2>
        {children}
      </section>
    );
  };
  
  return (
    <div className={cn("bg-white text-gray-800 w-full h-full flex", fontClass)} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <aside className="w-[8rem] bg-gray-100 p-4 flex flex-col items-center text-center gap-4">
          <h1 className="text-xl font-bold -rotate-90 whitespace-nowrap mt-16">{fullName || 'Your Name'}</h1>
          <div className="w-px flex-grow bg-gray-200" />
          <div className="text-xs text-gray-500 space-y-1">
             <p>{personalInfo.phone}</p>
             <p className="truncate w-full">{personalInfo.email}</p>
          </div>
      </aside>

      <main className="flex-1 p-8 grid grid-cols-5 gap-8">
        <div className="col-span-3 space-y-6">
          <Section title="Experience" show={hasExperience}>
            <div className="space-y-4">
            {experience.map(job => (
              <div key={job.id} className="relative pl-4">
                <div className="absolute left-0 top-1 h-full w-0.5" style={{backgroundColor: accentColor}}></div>
                <div className="absolute -left-1 top-1 w-2 h-2 rounded-full" style={{backgroundColor: accentColor}}></div>
                <h3 className="text-base font-bold">{job.role || 'Job Title'}</h3>
                <p className="text-sm font-semibold italic">{job.company || 'Company Name'}</p>
                <p className="text-xs text-gray-500 mb-1">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
                  {job.description || '* Your job description will appear here.'}
                </ReactMarkdown>
              </div>
            ))}
            </div>
          </Section>
        </div>
        
        <div className="col-span-2 space-y-6">
           <Section title="Summary">
              {summary ? (
                <p className="text-gray-700 leading-relaxed">{summary}</p>
              ) : (
                <p className="text-gray-400 italic">Your professional summary will appear here.</p>
              )}
          </Section>

          <Section title="Skills" show={hasSkills}>
            <ul className="text-sm space-y-1">
              {skills.map((skill, i) => (
                <li key={i}>
                  <p>{skill}</p>
                  <div className="w-full bg-gray-200 h-1 rounded-full mt-0.5"><div className="h-1 rounded-full" style={{width: `${Math.floor(Math.random() * 50) + 50}%`, backgroundColor: accentColor}}></div></div>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Projects" show={hasProjects}>
            {projects.map(p => (
                <ReactMarkdown key={p.id} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
                  {p.content || '* Your projects will appear here.'}
                </ReactMarkdown>
            ))}
          </Section>

          <Section title="Education" show={hasEducation}>
              {education.map(edu => (
                  <div key={edu.id}>
                      <h3 className="text-sm font-bold">{edu.school || 'University Name'}</h3>
                      <p className="text-xs">{edu.degree || 'Degree'}</p>
                      <p className="text-xs text-gray-500">{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                  </div>
              ))}
          </Section>

          <Section title="Certifications" show={hasCertifications}>
             <ul className="text-sm space-y-1">
              {certifications.map((cert) => <li key={cert.id}>{cert.name}</li>)}
            </ul>
          </Section>
        </div>
      </main>
    </div>
  );
};
