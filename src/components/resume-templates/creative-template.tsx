import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react';

export interface TemplateProps {
  data: ResumeData;
  accentColor?: string;
}

export const CreativeTemplate: React.FC<TemplateProps> = ({ data, accentColor: accentColorProp }) => {
  const { personalInfo, summary, experience, education, skills, awards, websites, projects } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');

  const palette = { accent: '#FF6B35', accentSoft: '#FFE9E2', text: '#1A1A1A', muted: '#666666', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;

  const hasContent = (arr: any[], ...fields: string[]) => arr.some(item => fields.some(field => item[field]));

  const hasExperience = hasContent(experience, 'role', 'company', 'description');
  const hasEducation = hasContent(education, 'school', 'degree');
  const hasSkills = skills.length > 0;
  const hasAwards = hasContent(awards, 'name');
  const hasWebsites = hasContent(websites, 'url');
  const hasProjects = hasContent(projects, 'content');

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'yyyy')}`;
    return start;
  };

  const LeftColumnSection: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-[var(--fs-h2)] font-bold text-white mb-2 uppercase" style={{backgroundColor: accentColor, padding: '0.25rem 0.5rem'}}>{title}</h2>
        {children}
      </section>
    );
  };
  
  const RightColumnSection: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-[var(--fs-h2)] font-bold uppercase tracking-wider border-b-2 pb-1 mb-3" style={{ borderColor: accentColor }}>{title}</h2>
        <div className="space-y-4">{children}</div>
      </section>
    );
  };

  return (
    <div className="bg-white text-[var(--fs-body)] w-full h-full flex" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <aside className="w-[40%] text-black p-6 flex flex-col gap-6" style={{ backgroundColor: palette.accentSoft }}>
        <div className="text-center mt-4">
          <div className="w-24 h-24 rounded-full mx-auto bg-white mb-4 shadow-md flex items-center justify-center">
             <span className="text-4xl font-bold" style={{color: accentColor}}>{personalInfo.firstName?.[0]}{personalInfo.lastName?.[0]}</span>
          </div>
        </div>

        <LeftColumnSection title="Contact">
          <div className="space-y-1 text-[var(--fs-small)]" style={{ color: palette.muted }}>
            {personalInfo.email && <div className="flex items-center gap-2"><Mail size={14} style={{color: accentColor}}/><p>{personalInfo.email}</p></div>}
            {personalInfo.phone && <div className="flex items-center gap-2"><Phone size={14} style={{color: accentColor}}/><p>{personalInfo.phone}</p></div>}
            {personalInfo.city && <div className="flex items-center gap-2"><MapPin size={14} style={{color: accentColor}}/><p>{personalInfo.city}{personalInfo.state && `, ${personalInfo.state}`}</p></div>}
          </div>
        </LeftColumnSection>

        <LeftColumnSection title="Skills" show={hasSkills}>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => <span key={i} className="text-[var(--fs-small)] bg-white px-3 py-1 rounded-full">{skill}</span>)}
          </div>
        </LeftColumnSection>

        <LeftColumnSection title="Links" show={hasWebsites}>
          <div className="space-y-1 text-[var(--fs-small)]">
            {websites.map(site => <div key={site.id} className="flex items-center gap-2"><LinkIcon size={14} style={{color: accentColor}} /><a href={site.url} className="hover:underline truncate" style={{color: palette.text}}>{site.label || site.url}</a></div>)}
          </div>
        </LeftColumnSection>

        <LeftColumnSection title="Awards" show={hasAwards}>
          <ul className="text-[var(--fs-small)] list-disc list-inside">
            {awards.map(award => <li key={award.id}>{award.name}</li>)}
          </ul>
        </LeftColumnSection>
      </aside>

      <main className="w-[60%] p-8 overflow-y-auto" style={{color: palette.text}}>
        <h1 className="text-[var(--fs-name)] font-bold" style={{ color: accentColor }}>{fullName || 'Your Name'}</h1>
        <h2 className="text-[var(--fs-h2)] font-light text-gray-700 mb-4">{experience[0]?.role || 'Professional Title'}</h2>
        
        <RightColumnSection title="Summary">
          <p className="leading-relaxed">{summary || 'Your professional summary will appear here.'}</p>
        </RightColumnSection>

        <RightColumnSection title="Projects" show={hasProjects}>
          {projects.map(p => (
            <div key={p.id}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                {p.content || '* Details about your key projects.'}
              </ReactMarkdown>
            </div>
          ))}
        </RightColumnSection>
        
        <RightColumnSection title="Experience" show={hasExperience}>
          {experience.map(job => (
            <div key={job.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="text-[var(--fs-h3)] font-bold">{job.role || 'Job Title'}</h3>
                <p className="text-[var(--fs-small)]" style={{ color: palette.muted }}>{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
              </div>
              <p className="font-semibold italic">{job.company || 'Company Name'}</p>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                {job.description || '* Your job description will appear here.'}
              </ReactMarkdown>
            </div>
          ))}
        </RightColumnSection>
        
        <RightColumnSection title="Education" show={hasEducation}>
            {education.map(edu => (
                <div key={edu.id}>
                    <h3 className="text-[var(--fs-h3)] font-bold">{edu.school || 'University Name'}</h3>
                    <p className="font-semibold">{edu.degree || 'Degree'}{edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}</p>
                    <p className="text-[var(--fs-small)]" style={{ color: palette.muted }}>{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                </div>
            ))}
        </RightColumnSection>
      </main>
    </div>
  );
};
