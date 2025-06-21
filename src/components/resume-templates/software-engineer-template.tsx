import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { Mail, Phone, MapPin, Github } from 'lucide-react';

export interface TemplateProps {
  data: ResumeData;
  accentColor?: string;
}

export const SoftwareEngineerTemplate: React.FC<TemplateProps> = ({ data, accentColor: accentColorProp }) => {
  const { personalInfo, summary, experience, education, skills, projects } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  
  const palette = { accent: '#4E44CE', accentSoft: '#ECECFF', text: '#EDEDED', bg: '#FFFFFF' };
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
    if (endDate) return `${start}-${format(endDate, 'yyyy')}`;
    return start;
  };

  const Section: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-[var(--fs-h2)] font-bold uppercase tracking-wider text-gray-700 mb-2" style={{ fontFamily: "'Fira Code', monospace" }}>{title}</h2>
        <div className="space-y-4">{children}</div>
      </section>
    );
  };
  
  return (
    <div className="bg-white text-[var(--fs-body)] w-full h-full flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      <aside className="w-[35%] p-6 flex flex-col gap-6" style={{backgroundColor: palette.accentSoft}}>
        <header>
            <h1 className="text-[var(--fs-name)] font-bold">{fullName || 'Your Name'}</h1>
            <h2 className="text-[var(--fs-h3)]" style={{ color: accentColor }}>{experience[0]?.role || 'Software Engineer'}</h2>
        </header>
        
        <section>
          <div className="space-y-1.5 text-[var(--fs-small)] text-gray-700">
            <p className="flex items-center gap-2"><Mail size={14}/> {personalInfo.email}</p>
            <p className="flex items-center gap-2"><Phone size={14}/> {personalInfo.phone}</p>
            <p className="flex items-center gap-2"><MapPin size={14}/> {personalInfo.city}{personalInfo.state && `, ${personalInfo.state}`}</p>
            <p className="flex items-center gap-2"><Github size={14}/> github.com/username</p>
          </div>
        </section>

        <section>
          <h2 className="text-[var(--fs-h3)] font-bold uppercase tracking-wider mb-2" style={{ fontFamily: "'Fira Code', monospace" }}>Tech Stack</h2>
          {hasSkills ? (
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, i) => <span key={i} className="text-[var(--fs-small)] font-mono bg-white px-2 py-0.5 rounded shadow-sm">{skill}</span>)}
            </div>
          ) : (
            <p className="text-gray-400 italic text-[var(--fs-small)]">Your tech stack will appear here.</p>
          )}
        </section>
      </aside>

      <main className="w-[65%] p-8 overflow-y-auto">
        <Section title="Summary">
            <p className="leading-relaxed">{summary || 'Your professional summary will appear here.'}</p>
        </Section>
        
        <Section title="Projects" show={hasProjects}>
          {projects.map(p => (
            <div key={p.id}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                {p.content || '* Your projects will appear here.'}
              </ReactMarkdown>
            </div>
          ))}
        </Section>

        <Section title="Experience" show={hasExperience}>
          {experience.map(job => (
            <div key={job.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="text-[var(--fs-h3)] font-bold">{job.role || 'Job Title'}</h3>
                <p className="text-[var(--fs-small)] text-gray-500 font-mono">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
              </div>
              <p className="font-semibold italic">{job.company || 'Company Name'}</p>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                {job.description || '* Your job description will appear here.'}
              </ReactMarkdown>
            </div>
          ))}
        </Section>
        
        <Section title="Education" show={hasEducation}>
            {education.map(edu => (
                <div key={edu.id}>
                    <h3 className="text-[var(--fs-h3)] font-bold">{edu.school || 'University Name'}</h3>
                    <p className="font-semibold">{edu.degree || 'Degree'}</p>
                    <p className="text-[var(--fs-small)] text-gray-500">{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                </div>
            ))}
        </Section>
      </main>
    </div>
  );
};
