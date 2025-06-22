import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';

export interface TemplateProps {
  data: ResumeData;
  accentColor?: string;
  fontSize?: 'sm' | 'md' | 'lg';
}

export const TechnicalTemplate: React.FC<TemplateProps> = ({ data, accentColor: accentColorProp, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, certifications, customSections } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const projects = customSections.filter(s => s.title.toLowerCase().includes('project'));

  const palette = { accent: '#009688', accentSoft: '#E0F5F4', text: '#1D1D1D', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;
  
  const hasContent = (arr: any[], ...fields: string[]) => Array.isArray(arr) && arr.some(item => item && fields.some(field => item[field]));

  const hasExperience = hasContent(experience, 'role', 'company', 'description');
  const hasEducation = hasContent(education, 'school', 'degree');
  const hasSkills = Array.isArray(skills) && skills.some(s => s);
  const hasCertifications = hasContent(certifications, 'name');
  const hasProjects = hasContent(projects, 'content');

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'yyyy');
    if (isCurrent) return `present`;
    if (endDate) return `${start} - ${format(endDate, 'yyyy')}`;
    return start;
  };

  const Section: React.FC<{ title: string; children: React.ReactNode; show?: boolean, className?: string }> = ({ title, children, show = true, className }) => {
    if (!show) return null;
    return (
      <section className={className}>
        <h2 className="text-[var(--fs-h2)] font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>{title}</h2>
        {children}
      </section>
    );
  };
  
  return (
    <div className={cn("bg-white text-[var(--fs-body)] w-full h-full flex font-display-jetbrains-mono", fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-base' : '')}>
      <main className="flex-1 p-8 grid grid-cols-5 gap-8">
        <div className="col-span-3 space-y-6">
            <header className="mb-6">
                <h1 className="text-[1.6rem] leading-tight font-bold" style={{color: accentColor}}>{fullName || 'Your Name'}</h1>
                <p className="text-[var(--fs-h3)]">{experience[0]?.role || 'Technical Professional'}</p>
                <p className="text-[var(--fs-small)] text-gray-500 mt-2">{personalInfo.email} &bull; {personalInfo.phone}</p>
            </header>
            
            {summary ? (
              <p className="leading-relaxed font-body-inter">{summary}</p>
            ) : <p className="leading-relaxed text-gray-400 italic font-body-inter">Your professional summary will appear here.</p>}
            
            <div className="space-y-4">
              <h2 className="text-[var(--fs-h2)] font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Experience</h2>
              {hasExperience ? experience.map(job => (
                <div key={job.id} className="relative pl-5">
                  <div className="absolute left-0 top-1 h-full w-0.5" style={{backgroundColor: accentColor}}></div>
                  <div className="absolute -left-1 top-1.5 w-3 h-3 rounded-full bg-white border-2" style={{borderColor: accentColor}}></div>
                  <p className="text-[var(--fs-small)] text-gray-500 mb-1">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                  <h3 className="text-[var(--fs-h3)] font-bold">{job.role || 'Job Title'}</h3>
                  <p className="font-semibold italic font-body-inter">{job.company || 'Company Name'}</p>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none font-body-inter">
                    {job.description || '* Your job description will appear here.'}
                  </ReactMarkdown>
                </div>
              )) : <p className="text-gray-400 italic font-body-inter">Your work experience will appear here.</p>}
            </div>
        </div>
        
        <div className="col-span-2 space-y-6">
          <Section title="Skills" show={hasSkills}>
            <ul className="text-[var(--fs-small)] space-y-2 font-body-inter">
                {skills.map((skill, i) => (
                  <li key={i}>
                    <p>{skill}</p>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1"><div className="h-1.5 rounded-full" style={{width: `${Math.floor(Math.random() * 50) + 50}%`, backgroundColor: accentColor}}></div></div>
                  </li>
                ))}
            </ul>
          </Section>

          <Section title="Projects" show={hasProjects}>
              {projects.map(p => (
                  <ReactMarkdown key={p.id} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none font-body-inter">
                    {p.content}
                  </ReactMarkdown>
              ))}
          </Section>

          <Section title="Education" show={hasEducation}>
              <div className='font-body-inter'>
                {education.map(edu => (
                    <div key={edu.id} className="mb-2">
                        <h3 className="text-[var(--fs-h3)] font-bold">{edu.school || 'University Name'}</h3>
                        <p className="text-[var(--fs-body)]">{edu.degree || 'Degree'}</p>
                        <p className="text-[var(--fs-small)] text-gray-500">{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                    </div>
                ))}
              </div>
          </Section>

          <Section title="Certifications" show={hasCertifications}>
             <ul className="text-[var(--fs-body)] space-y-1 list-disc list-inside font-body-inter">
                {certifications.map((cert) => <li key={cert.id}>{cert.name}</li>)}
              </ul>
          </Section>
        </div>
      </main>
    </div>
  );
};
