import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';
import { Terminal, HardDrive, CheckCircle } from 'lucide-react';

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

export const ItProfessionalTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, certifications, awards, customSections } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const projects = customSections.filter(s => s.title.toLowerCase().includes('project'));

  const hasExperience = experience.some(e => e.role || e.company || e.description);
  const hasEducation = education.some(e => e.school || e.degree || e.fieldOfStudy);
  const hasSkills = skills.some(s => s);
  const hasCertifications = certifications.some(c => c.name);
  const hasProjects = projects.length > 0;

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'yyyy-MM');
    if (isCurrent) return `${start} - current`;
    if (endDate) return `${start} - ${format(endDate, 'yyyy-MM')}`;
    return start;
  };

  const fontClass = fontClasses[fontSize];
  
  const Section: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-base font-bold text-white p-1 mb-2" style={{ backgroundColor: accentColor }}>$ {title}</h2>
        <div className="pl-2">{children}</div>
      </section>
    );
  };
  
  return (
    <div className={cn("bg-gray-900 text-gray-200 p-8 w-full h-full", fontClass)} style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
        <header className="mb-6">
            <h1 className="text-3xl font-bold text-white">{fullName || 'Your Name'}</h1>
            <p className="text-base" style={{ color: accentColor }}>
              {personalInfo.email} | {personalInfo.phone}
            </p>
        </header>

        <main className="grid grid-cols-3 gap-x-6 gap-y-4">
            <div className="col-span-2 space-y-4">
                <Section title="summary.txt">
                  {summary ? (
                    <p className="leading-relaxed">{summary}</p>
                  ) : (
                    <p className="text-gray-500 italic"># Your summary will appear here.</p>
                  )}
                </Section>
                <Section title="experience.log" show={hasExperience}>
                  <div className="space-y-4">
                  {experience.map(job => (
                    <div key={job.id}>
                      <p className="font-bold text-white">{job.role || 'Job Title'} @ {job.company || 'Company'}</p>
                      <p className="text-xs" style={{ color: accentColor }}>{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-300 prose-invert">
                        {job.description || '# Your job description will appear here.'}
                      </ReactMarkdown>
                    </div>
                  ))}
                  </div>
                </Section>
                <Section title="projects.sh" show={hasProjects}>
                  <div className="space-y-3">
                    {projects.map(p => (
                       <ReactMarkdown key={p.id} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-300 prose-invert">
                        {p.content || '# Your projects will appear here.'}
                      </ReactMarkdown>
                    ))}
                  </div>
                </Section>
            </div>
            <div className="col-span-1 space-y-4">
                <Section title="certifications/" show={hasCertifications}>
                   <ul className="text-sm space-y-1">
                      {certifications.map(cert => (
                        <li key={cert.id} className="flex items-center gap-2"><CheckCircle size={14} />{cert.name}</li>
                      ))}
                   </ul>
                </Section>
                <Section title="skills/" show={hasSkills}>
                   <ul className="text-sm space-y-1">
                      {skills.map((skill, i) => <li key={i} className="flex items-center gap-2"><Terminal size={14} />{skill}</li>)}
                   </ul>
                </Section>
                <Section title="education/" show={hasEducation}>
                   {education.map(edu => (
                      <div key={edu.id}>
                          <p className="font-bold text-white">{edu.school || 'University'}</p>
                          <p className="text-sm">{edu.degree || 'Degree'}</p>
                          <p className="text-xs" style={{ color: accentColor }}>{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                      </div>
                  ))}
                </Section>
            </div>
        </main>
    </div>
  );
};
