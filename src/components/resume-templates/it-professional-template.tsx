
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { Terminal, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TemplateProps {
  data: ResumeData;
  accentColor?: string;
  fontSize?: 'sm' | 'md' | 'lg';
}

export const ItProfessionalTemplate: React.FC<TemplateProps> = ({ data, accentColor: accentColorProp, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, certifications, projects } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  
  const palette = { accent: '#512DA8', accentSoft: '#EFE7FF', text: '#141414', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;

  const hasContent = (arr: any[], ...fields: string[]) => Array.isArray(arr) && arr.some(item => item && fields.some(field => item[field]));
  
  const hasExperience = hasContent(experience, 'role', 'company', 'description');
  const hasEducation = hasContent(education, 'school', 'degree');
  const hasSkills = skills.length > 0;
  const hasCertifications = hasContent(certifications, 'name');
  const hasProjects = hasContent(projects, 'content');

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'yyyy-MM');
    if (isCurrent) return `${start} - current`;
    if (endDate) return `${start} - ${format(endDate, 'yyyy-MM')}`;
    return start;
  };
  
  const Section: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-[var(--fs-h2)] font-bold text-white p-1 mb-2 font-code" style={{ backgroundColor: accentColor }}>$ {title}</h2>
        <div className="pl-2">{children}</div>
      </section>
    );
  };
  
  return (
    <div className={cn("bg-white text-[var(--fs-body)] p-8 w-full h-full font-body", fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-base' : '')}>
        <header className="mb-6">
            <h1 className="text-[var(--fs-name)] font-bold text-black">{fullName || 'Your Name'}</h1>
            <p className="text-[var(--fs-body)]" style={{ color: accentColor }}>
              {personalInfo.email} | {personalInfo.phone}
            </p>
        </header>

        <main className="grid grid-cols-5 gap-x-6 gap-y-4">
            <div className="col-span-3 space-y-4">
                <Section title="summary.txt">
                  {summary ? (
                    <p className="leading-relaxed">{summary}</p>
                  ) : <p className="leading-relaxed text-gray-400 italic"># Your summary will appear here.</p>}
                </Section>
                <Section title="experience.log">
                  <div className="space-y-4">
                  {hasExperience ? (
                    experience.map(job => (
                      <div key={job.id}>
                        <p className="text-[var(--fs-h3)] font-bold text-black">{job.role || 'Job Title'} @ {job.company || 'Company'}</p>
                        <p className="text-[var(--fs-small)]" style={{ color: accentColor }}>{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                          {job.description || '# Your job description will appear here.'}
                        </ReactMarkdown>
                      </div>
                    ))
                  ) : <p className="text-gray-400 italic"># Your work experience will appear here.</p>}
                  </div>
                </Section>
                <Section title="projects.sh">
                  <div className="space-y-3">
                    {hasProjects ? (
                      projects.map(p => (
                         <ReactMarkdown key={p.id} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                          {p.content}
                        </ReactMarkdown>
                      ))
                    ) : <p className="text-gray-400 italic"># Your projects will appear here.</p>}
                  </div>
                </Section>
            </div>
            <div className="col-span-2 space-y-4">
                <Section title="certifications/">
                   {hasCertifications ? (
                    <ul className="text-[var(--fs-small)] space-y-1">
                        {certifications.map(cert => (
                          <li key={cert.id} className="flex items-center gap-2"><CheckCircle size={14} style={{color: accentColor}} />{cert.name}</li>
                        ))}
                    </ul>
                   ) : <p className="text-gray-400 italic text-sm"># Your certifications will appear here.</p>}
                </Section>
                <Section title="skills/">
                   {hasSkills ? (
                    <ul className="text-[var(--fs-small)] space-y-1">
                        {skills.map((skill, i) => <li key={i} className="flex items-center gap-2"><Terminal size={14} style={{color: accentColor}} />{skill}</li>)}
                    </ul>
                   ) : <p className="text-gray-400 italic text-sm"># Your skills will appear here.</p>}
                </Section>
                <Section title="education/">
                   {hasEducation ? (
                    education.map(edu => (
                        <div key={edu.id} className="mb-2">
                            <p className="text-[var(--fs-h3)] font-bold text-black">{edu.school || 'University'}</p>
                            <p className="text-[var(--fs-body)]">{edu.degree || 'Degree'}</p>
                            <p className="text-[var(--fs-small)]" style={{ color: accentColor }}>{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                        </div>
                    ))
                   ) : <p className="text-gray-400 italic text-sm"># Your education details will appear here.</p>}
                </Section>
            </div>
        </main>
    </div>
  );
};
