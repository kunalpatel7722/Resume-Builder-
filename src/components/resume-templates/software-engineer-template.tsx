import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Github, Code } from 'lucide-react';

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

export const SoftwareEngineerTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
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
    if (endDate) return `${start}-${format(endDate, 'yyyy')}`;
    return start;
  };

  const fontClass = fontClasses[fontSize];

  const Section: React.FC<{ title: string; children: React.ReactNode; show?: boolean, className?: string }> = ({ title, children, show = true, className }) => {
    if (!show) return null;
    return (
      <section className={className}>
        <h2 className="text-base font-bold uppercase tracking-wider text-gray-700 mb-2" style={{ fontFamily: "'Fira Code', monospace" }}>{title}</h2>
        <div className="space-y-4">{children}</div>
      </section>
    );
  };
  
  return (
    <div className={cn("bg-white text-gray-800 w-full h-full flex", fontClass)} style={{ fontFamily: "'Inter', sans-serif" }}>
      <aside className="w-[35%] bg-gray-50 p-6 flex flex-col gap-6">
        <header>
            <h1 className="text-3xl font-bold">{fullName || 'Your Name'}</h1>
            <h2 className="text-lg" style={{ color: accentColor }}>{hasExperience ? experience[0]?.role : 'Software Engineer'}</h2>
        </header>
        
        <section>
          <div className="space-y-1.5 text-xs text-gray-700">
            <p className="flex items-center gap-2"><Mail size={14}/> {personalInfo.email}</p>
            <p className="flex items-center gap-2"><Phone size={14}/> {personalInfo.phone}</p>
            <p className="flex items-center gap-2"><MapPin size={14}/> {personalInfo.city}{personalInfo.state && `, ${personalInfo.state}`}</p>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2">Tech Stack</h2>
          {hasSkills ? (
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, i) => <span key={i} className="text-xs font-mono bg-gray-200 px-2 py-0.5 rounded">{skill}</span>)}
            </div>
          ) : (
            <p className="text-gray-400 italic text-xs">Your tech stack will appear here.</p>
          )}
        </section>
      </aside>

      <main className="w-[65%] p-8 overflow-y-auto">
        <Section title="Summary">
            {summary ? (
              <p className="text-gray-700 leading-relaxed">{summary}</p>
            ) : (
              <p className="text-gray-400 italic">Your professional summary will appear here.</p>
            )}
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

        <Section title="Experience" show={hasExperience}>
          {experience.map(job => (
            <div key={job.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="text-base font-bold">{job.role || 'Job Title'}</h3>
                <p className="text-xs text-gray-500 font-mono">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
              </div>
              <p className="text-sm font-semibold italic">{job.company || 'Company Name'}</p>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
                {job.description || '* Your job description will appear here.'}
              </ReactMarkdown>
            </div>
          ))}
        </Section>
        
        <Section title="Education" show={hasEducation}>
            {education.map(edu => (
                <div key={edu.id}>
                    <h3 className="text-base font-bold">{edu.school || 'University Name'}</h3>
                    <p className="text-sm font-semibold">{edu.degree || 'Degree'}</p>
                    <p className="text-xs text-gray-500">{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                </div>
            ))}
        </Section>
      </main>
    </div>
  );
};
