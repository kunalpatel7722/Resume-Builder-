
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TemplateProps {
  data: ResumeData;
  accentColor?: string;
  fontSize?: 'sm' | 'md' | 'lg';
}

export const ProjectManagerTemplate: React.FC<TemplateProps> = ({ data, accentColor: accentColorProp, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, certifications, projects, customSections } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const PMP = certifications.find(c => c.name.toLowerCase().includes('pmp'));
  const tools = customSections.filter(s => s.title.toLowerCase().includes('tool'));
  const milestones = customSections.filter(s => s.title.toLowerCase().includes('milestone'));

  const palette = { accent: '#C2185B', accentSoft: '#FFE7F0', text: '#202020', muted: '#666666', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;

  const hasContent = (arr: any[], ...fields: string[]) => Array.isArray(arr) && arr.some(item => item && fields.some(field => item[field]));

  const hasExperience = hasContent(experience, 'role', 'company', 'description');
  const hasEducation = hasContent(education, 'school', 'degree');
  const hasSkills = skills.length > 0;
  const hasTools = hasContent(tools, 'content');
  const hasMilestones = hasContent(milestones, 'content');
  const hasProjects = hasContent(projects, 'content');
  
  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'MMM yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'MMM yyyy')}`;
    return start;
  };

  const MainSection: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-[var(--fs-h2)] font-bold uppercase tracking-wider border-b-2 pb-1 mb-3" style={{ borderColor: accentColor }}>{title}</h2>
        <div className="space-y-4">{children}</div>
      </section>
    );
  };
  
  const SidebarSection: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-[var(--fs-h3)] font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>{title}</h2>
        {children}
      </section>
    );
  };
  
  return (
    <div className={cn("bg-white text-[var(--fs-body)] w-full h-full flex font-body-work-sans", fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-base' : '')}>
      <main className="w-[72%] p-8 overflow-y-auto">
        <header className="mb-6 text-left">
            <h1 className="text-[var(--fs-name)] font-bold" style={{color: accentColor}}>{fullName || 'Your Name'}</h1>
            <div className="flex items-center gap-4">
                <p className="text-[var(--fs-h2)] text-gray-600 mt-1">{experience[0]?.role || 'Project Manager'}</p>
                {PMP && <span className="text-[0.85rem] leading-tight font-semibold text-white px-3 py-1 rounded-full" style={{backgroundColor: accentColor}}>PMP Certified</span>}
            </div>
             <p className="text-[var(--fs-small)]" style={{color: palette.muted}}>{personalInfo.email} &bull; {personalInfo.phone}</p>
        </header>

        <div className="space-y-5">
            <MainSection title="Summary">
              {summary ? (
                <p className="leading-relaxed">{summary}</p>
              ) : <p className="leading-relaxed text-gray-400 italic">Your professional summary will appear here.</p>}
            </MainSection>
            
            <MainSection title="Key Projects">
                 {hasProjects ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                      {projects[0]?.content}
                    </ReactMarkdown>
                 ) : <p className="text-gray-400 italic">Details about your key projects.</p>}
            </MainSection>

            <MainSection title="Professional Experience">
              {hasExperience ? (
                experience.map(job => (
                  <div key={job.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-[var(--fs-h3)] font-bold">{job.role || 'Job Title'}</h3>
                      <p className="text-[var(--fs-small)]" style={{color: palette.muted}}>{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                    </div>
                    <p className="font-semibold italic">{job.company || 'Company Name'}</p>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                      {job.description || '* Your job description will appear here.'}
                    </ReactMarkdown>
                  </div>
                ))
              ) : <p className="text-gray-400 italic">Your work experience will appear here.</p>}
            </MainSection>
            
            <MainSection title="Education">
                {hasEducation ? (
                  education.map(edu => (
                      <div key={edu.id}>
                          <h3 className="text-[var(--fs-h3)] font-bold">{edu.school || 'University Name'}</h3>
                          <p className="font-semibold">{edu.degree || 'Degree'}</p>
                          <p className="text-[var(--fs-small)]" style={{color: palette.muted}}>{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                      </div>
                  ))
                ) : <p className="text-gray-400 italic">Your education details will appear here.</p>}
            </MainSection>
        </div>
      </main>

      <aside className="w-[28%] p-6 flex flex-col gap-6" style={{ backgroundColor: palette.accentSoft }}>
        <SidebarSection title="Tools">
          {hasTools ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
              {tools[0]?.content}
            </ReactMarkdown>
          ) : <p className="text-gray-400 italic text-sm">Your tools will appear here.</p>}
        </SidebarSection>
        
        <SidebarSection title="Skills">
          {hasSkills ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => <span key={i} className="text-[var(--fs-small)] bg-white border px-2 py-0.5 rounded">{skill}</span>)}
            </div>
          ) : <p className="text-gray-400 italic text-sm">Your skills will appear here.</p>}
        </SidebarSection>
        
        <SidebarSection title="Milestones">
          {hasMilestones ? (
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw]}
              className="prose prose-sm max-w-none"
              components={{
                  li: ({children}) => <li className="flex items-start gap-2"><CheckCircle size={14} className="mt-1" style={{color: accentColor}}/><span>{children}</span></li>,
                  ul: ({children}) => <ul className="list-none p-0">{children}</ul>
              }}
            >
              {milestones[0]?.content}
            </ReactMarkdown>
          ) : <p className="text-gray-400 italic text-sm">Your milestones will appear here.</p>}
        </SidebarSection>
      </aside>
    </div>
  );
};
