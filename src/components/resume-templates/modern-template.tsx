import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { Mail, Phone, MapPin, Star, Code, Award, CheckCircle } from 'lucide-react';

export interface TemplateProps {
  data: ResumeData;
  accentColor?: string;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ data, accentColor: accentColorProp }) => {
  const { personalInfo, summary, experience, education, skills, certifications, projects, customSections } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const PMP = certifications.find(c => c.name.toLowerCase().includes('pmp'));
  const tools = customSections.filter(s => s.title.toLowerCase().includes('tool'));
  const milestones = customSections.filter(s => s.title.toLowerCase().includes('milestone'));
  
  const palette = { accent: '#3358FF', accentSoft: '#ECF1FF', text: '#121212', muted: '#666666', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;

  const hasContent = (arr: any[], ...fields: string[]) => arr.some(item => fields.some(field => item[field]));

  const hasExperience = hasContent(experience, 'role', 'company', 'description');
  const hasEducation = hasContent(education, 'school', 'degree');
  const hasSkills = skills.length > 0;
  const hasCerts = hasContent(certifications, 'name');
  const hasProjects = hasContent(projects, 'content');
  const hasTools = hasContent(tools, 'content');
  const hasMilestones = hasContent(milestones, 'content');

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'MMM yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'MMM yyyy')}`;
    return start;
  };
  
  const SidebarSection: React.FC<{ title: string; children: React.ReactNode; show?: boolean, icon: React.ElementType }> = ({ title, children, show = true, icon: Icon }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-[var(--fs-h2)] font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{color: accentColor}}>
            <Icon size={18} />
            {title}
        </h2>
        {children}
      </section>
    );
  };
  
  return (
    <div className="bg-white text-[var(--fs-body)] w-full h-full flex font-sans" style={{color: palette.text}}>
      <aside className="w-[18rem] bg-gray-50 p-6 flex flex-col gap-6" style={{backgroundColor: palette.accentSoft}}>
        <SidebarSection title="Contact" icon={MapPin}>
          <div className="space-y-1 text-[var(--fs-small)]" style={{ color: palette.muted }}>
             {personalInfo.email && <p className="flex items-start gap-2"><Mail size={14} className="mt-0.5"/> <span>{personalInfo.email}</span></p>}
             {personalInfo.phone && <p className="flex items-start gap-2"><Phone size={14} className="mt-0.5"/> <span>{personalInfo.phone}</span></p>}
          </div>
        </SidebarSection>

        <SidebarSection title="Skills" icon={Star} show={hasSkills}>
          <ul className="text-[var(--fs-small)] font-semibold space-y-2">
            {skills.map((skill, i) => (
                <li key={i}>
                    <p>{skill}</p>
                    <div className="w-full bg-gray-300 h-1.5 rounded-full mt-1"><div className="h-1.5 rounded-full" style={{width: `${Math.floor(Math.random() * 40) + 60}%`, backgroundColor: accentColor}}></div></div>
                </li>
            ))}
          </ul>
        </SidebarSection>

        <SidebarSection title="Tools" icon={Code} show={hasTools}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                {tools[0]?.content || 'Your tools will appear here.'}
            </ReactMarkdown>
        </SidebarSection>
        
        <SidebarSection title="Certifications" icon={Award} show={hasCerts}>
          <div className="space-y-2 text-[var(--fs-small)]">
            {certifications.map(cert => (
              <div key={cert.id}>
                <p className="font-semibold">{cert.name}</p>
                <p className="text-gray-600">{cert.issuer}, {cert.date}</p>
              </div>
            ))}
          </div>
        </SidebarSection>

        <SidebarSection title="Milestones" icon={CheckCircle} show={hasMilestones}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                {milestones[0]?.content || 'Your milestones will appear here.'}
            </ReactMarkdown>
        </SidebarSection>
      </aside>
      
      <div className="w-1.5" style={{backgroundColor: accentColor}}></div>

      <main className="flex-1 p-8 overflow-y-auto space-y-6">
        <header>
            <h1 className="text-[var(--fs-name)] font-bold" style={{color: accentColor}}>{fullName || 'Your Name'}</h1>
            <div className="flex items-center gap-4">
                <h2 className="text-[var(--fs-h2)] text-gray-700 mt-1">{experience[0]?.role || 'Professional Title'}</h2>
                {PMP && <span className="text-[0.85rem] leading-tight font-semibold text-white px-3 py-1 rounded-full" style={{backgroundColor: accentColor}}>PMP</span>}
            </div>
        </header>

        <section>
            <h2 className="text-[var(--fs-h2)] font-bold mb-2">Summary</h2>
            <p className="leading-relaxed">{summary || 'Your professional summary will appear here.'}</p>
        </section>
        
        <section>
            <h2 className="text-[var(--fs-h2)] font-bold mb-2">Experience</h2>
            <div className="space-y-5">
              {hasExperience ? experience.map(job => (
                <div key={job.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[var(--fs-h3)] font-bold">{job.role || 'Job Title'}</h3>
                    <p className="text-[var(--fs-small)]" style={{color: palette.muted}}>{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                  </div>
                  <p className="font-semibold italic">{job.company || 'Company Name'}</p>
                   <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none mt-1">
                    {job.description || '* Your job description will appear here.'}
                  </ReactMarkdown>
                </div>
              )) : <p className="text-gray-400 italic">Your work experience will appear here.</p>}
            </div>
        </section>

        <section>
            <h2 className="text-[var(--fs-h2)] font-bold mb-2">Projects</h2>
            <div className="space-y-5">
                {hasProjects ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none mt-1">
                        {projects[0].content}
                    </ReactMarkdown>
                ) : <p className="text-gray-400 italic">Your projects will appear here.</p>}
            </div>
        </section>
        
        <section>
            <h2 className="text-[var(--fs-h2)] font-bold mb-2">Education</h2>
            <div className="space-y-3">
            {hasEducation ? education.map(edu => (
             <div key={edu.id}>
               <div className="flex justify-between items-baseline">
                <h3 className="text-[var(--fs-h3)] font-bold">{edu.school || 'School Name'}</h3>
                <p className="text-[var(--fs-small)]" style={{color: palette.muted}}>{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
               </div>
               <p className="italic">{edu.degree || 'Degree'}</p>
             </div>
            )) : <p className="text-gray-400 italic">Your education details will appear here.</p>}
          </div>
        </section>
      </main>
    </div>
  );
};
