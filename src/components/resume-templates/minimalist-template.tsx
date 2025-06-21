import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';

export interface TemplateProps {
  data: ResumeData;
  accentColor?: string;
}

export const MinimalistTemplate: React.FC<TemplateProps> = ({ data, accentColor: accentColorProp }) => {
  const { personalInfo, summary, experience, education, skills, projects } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');

  const palette = { accent: '#666666', text: '#2A2A2A', muted: '#888888', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;
  
  const hasContent = (arr: any[], ...fields: string[]) => arr.some(item => fields.some(field => item[field]));

  const hasExperience = hasContent(experience, 'role', 'company', 'description');
  const hasEducation = hasContent(education, 'school', 'degree');
  const hasSkills = skills.length > 0;
  const hasProjects = hasContent(projects, 'content');

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'yyyy');
    if (isCurrent) return `present`;
    if (endDate) return `${start} - ${format(endDate, 'yyyy')}`;
    return start;
  };

  const Section: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-[1.05rem] leading-tight font-bold uppercase tracking-[0.3em] mb-3" style={{ color: accentColor }}>{title}</h2>
        <div className="space-y-4">{children}</div>
      </section>
    );
  };

  return (
    <div className="bg-white text-[var(--fs-body)] p-10 w-full h-full" style={{fontFamily: "'Helvetica Neue', sans-serif"}}>
      <header className="mb-10" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        <h1 className="text-[1.3rem] leading-tight font-bold tracking-wider" style={{color: palette.text}}>{fullName || 'Your Name'}</h1>
        <p className="text-[var(--fs-small)] mt-2" style={{color: palette.muted}}>{personalInfo.email} / {personalInfo.phone}</p>
      </header>

      <main className="space-y-8">
        <section>
          <p className="leading-relaxed text-[var(--fs-body)]" style={{color: palette.text}}>
            {summary || 'Your professional summary will appear here.'}
          </p>
        </section>

        <Section title="Experience" show={hasExperience}>
          {experience.map(job => (
            <div key={job.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="text-[var(--fs-h3)] font-bold" style={{color: palette.text}}>{job.role || 'Job Title'} at {job.company || 'Company'}</h3>
                <p className="text-[var(--fs-small)] font-mono" style={{color: palette.muted}}>{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
              </div>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none" style={{color: palette.text}}>
                {job.description || '* Your job description will appear here.'}
              </ReactMarkdown>
            </div>
          ))}
        </Section>
        
        <Section title="Projects" show={hasProjects}>
          {projects.map(p => (
              <div key={p.id}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none" style={{color: palette.text}}>
                  {p.content || '* Your projects will appear here.'}
                </ReactMarkdown>
              </div>
          ))}
        </Section>

        <Section title="Education" show={hasEducation}>
            {education.map(edu => (
                <div key={edu.id} className="flex justify-between items-baseline">
                    <div>
                        <h3 className="text-[var(--fs-h3)] font-bold" style={{color: palette.text}}>{edu.school || 'University Name'}</h3>
                        <p className="text-gray-600">{edu.degree || 'Degree'}</p>
                    </div>
                    <p className="text-[var(--fs-small)] font-mono" style={{color: palette.muted}}>{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                </div>
            ))}
        </Section>
        
        <Section title="Skills" show={hasSkills}>
            <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                    <span key={i} className="text-[var(--fs-small)] border rounded-full px-3 py-1" style={{borderColor: palette.accent}}>
                        {skill}
                    </span>
                ))}
            </div>
        </Section>
      </main>
    </div>
  );
};
