
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { CheckCircle, Trophy, Activity, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TemplateProps {
  data: ResumeData;
  accentColor?: string;
  fontSize?: 'sm' | 'md' | 'lg';
}

export const ProjectManagerTemplate: React.FC<TemplateProps> = ({ data, accentColor: accentColorProp, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, certifications, customSections, awards, activities, websites, showReferences } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const PMP = Array.isArray(certifications) ? certifications.find(c => c.name.toLowerCase().includes('pmp')) : undefined;
  const projects = Array.isArray(customSections) ? customSections.filter(s => s.title.toLowerCase().includes('project')) : [];
  const tools = Array.isArray(customSections) ? customSections.filter(s => s.title.toLowerCase().includes('tool')) : [];
  const milestones = Array.isArray(customSections) ? customSections.filter(s => s.title.toLowerCase().includes('milestone')) : [];
  const otherCustomSections = Array.isArray(customSections) ? customSections.filter(s => !/project|tool|milestone/i.test(s.title)) : [];

  const palette = { accent: '#C2185B', accentSoft: '#FFE7F0', text: '#202020', muted: '#666666', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;

  const hasExperience = Array.isArray(experience) && experience.length > 0 && experience.some(e => e.role || e.company || e.description);
  const hasEducation = Array.isArray(education) && education.length > 0 && education.some(e => e.school || e.degree);
  const hasSkills = Array.isArray(skills) && skills.some(s => s);
  const hasTools = Array.isArray(tools) && tools.length > 0 && tools.some(p => p.content);
  const hasMilestones = Array.isArray(milestones) && milestones.length > 0 && milestones.some(p => p.content);
  const hasProjects = Array.isArray(projects) && projects.length > 0 && projects.some(p => p.content);
  const hasAwards = Array.isArray(awards) && awards.length > 0 && awards.some(a => a.name);
  const hasActivities = Array.isArray(activities) && activities.length > 0 && activities.some(a => a);
  const hasWebsites = Array.isArray(websites) && websites.length > 0 && websites.some(w => w.url);
  const hasOtherCustomSections = Array.isArray(otherCustomSections) && otherCustomSections.length > 0;
  
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
                <p className="text-[var(--fs-h2)] text-gray-600 mt-1">{experience?.[0]?.role || 'Project Manager'}</p>
                {PMP && <span className="text-[0.85rem] leading-tight font-semibold text-white px-3 py-1 rounded-full" style={{backgroundColor: accentColor}}>PMP Certified</span>}
            </div>
             <p className="text-[var(--fs-small)]" style={{color: palette.muted}}>{personalInfo.email} &bull; {personalInfo.phone}</p>
        </header>

        <div className="space-y-5">
            <MainSection title="Summary">
              <p className="leading-relaxed">{summary || "Your professional summary will appear here. Highlight your experience in managing projects, leading teams, and delivering results on time and within budget."}</p>
            </MainSection>
            
            <MainSection title="Key Projects" show={hasProjects}>
                 {projects.map(p => (
                    <ReactMarkdown key={p.id} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                      {p.content || "* Describe your key projects, focusing on scope, outcomes, and your specific role."}
                    </ReactMarkdown>
                  ))}
            </MainSection>

            <MainSection title="Professional Experience" show={hasExperience}>
              {experience.map(job => (
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
                ))}
            </MainSection>
            
            <MainSection title="Education" show={hasEducation}>
                {education.map(edu => (
                      <div key={edu.id}>
                          <h3 className="text-[var(--fs-h3)] font-bold">{edu.school || 'University Name'}</h3>
                          <p className="font-semibold">{edu.degree || 'Degree'}</p>
                          <p className="text-[var(--fs-small)]" style={{color: palette.muted}}>{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                      </div>
                  ))}
            </MainSection>

            {hasOtherCustomSections && otherCustomSections.map(section => (
                <MainSection key={section.id} title={section.title}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                        {section.content || ''}
                    </ReactMarkdown>
                </MainSection>
            ))}
        </div>
      </main>

      <aside className="w-[28%] p-6 flex flex-col gap-6" style={{ backgroundColor: palette.accentSoft }}>
        <SidebarSection title="Tools" show={hasTools}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
              {tools?.[0]?.content || "* Jira\n* Asana\n* Trello"}
            </ReactMarkdown>
        </SidebarSection>
        
        <SidebarSection title="Skills" show={hasSkills}>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => <span key={i} className="text-[var(--fs-small)] bg-white border px-2 py-0.5 rounded">{skill}</span>)}
            </div>
        </SidebarSection>
        
        <SidebarSection title="Milestones" show={hasMilestones}>
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw]}
              className="prose prose-sm max-w-none"
              components={{
                  li: ({children}) => <li className="flex items-start gap-2"><CheckCircle size={14} className="mt-1 flex-shrink-0" style={{color: accentColor}}/><span>{children}</span></li>,
                  ul: ({children}) => <ul className="list-none p-0 m-0 space-y-1">{children}</ul>
              }}
            >
              {milestones?.[0]?.content || "* Delivered project 20% under budget.\n* Increased team productivity by 15%."}
            </ReactMarkdown>
        </SidebarSection>

        <SidebarSection title="Awards" show={hasAwards}>
            <ul className="text-[var(--fs-small)] list-none p-0 space-y-1">
              {awards.map(award => <li key={award.id} className="flex items-start gap-2"><Trophy size={14} className="mt-0.5" style={{color: accentColor}}/>{award.name}</li>)}
            </ul>
        </SidebarSection>

        <SidebarSection title="Activities" show={hasActivities}>
            <ul className="text-[var(--fs-small)] list-none p-0 space-y-1">
              {activities.map((activity, i) => <li key={i} className="flex items-start gap-2"><Activity size={14} className="mt-0.5" style={{color: accentColor}}/>{activity}</li>)}
            </ul>
        </SidebarSection>

        <SidebarSection title="Websites" show={hasWebsites}>
            <ul className="text-[var(--fs-small)] list-none p-0 space-y-1">
              {websites.map(site => <li key={site.id} className="flex items-start gap-2"><LinkIcon size={14} className="mt-0.5" style={{color: accentColor}}/><a href={site.url} className="hover:underline">{site.label || site.url}</a></li>)}
            </ul>
        </SidebarSection>
        
        {showReferences && (
            <SidebarSection title="References">
                <p className="italic text-sm">Available upon request.</p>
            </SidebarSection>
        )}
      </aside>
    </div>
  );
};
