import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';
import { Briefcase, Award, Star, CheckCircle } from 'lucide-react';

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

export const ProjectManagerTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, certifications, customSections } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const projects = customSections.filter(s => s.title.toLowerCase().includes('project'));

  const hasExperience = experience.some(e => e.role || e.company || e.description);
  const hasEducation = education.some(e => e.school || e.degree || e.fieldOfStudy);
  const hasSkills = skills.some(s => s);
  const hasCertifications = certifications.some(c => c.name);
  const hasProjects = projects.length > 0;
  
  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'MMM yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'MMM yyyy')}`;
    return start;
  };

  const fontClass = fontClasses[fontSize];

  const MainSection: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-base font-bold uppercase tracking-wider border-b-2 pb-1 mb-3" style={{ borderColor: accentColor }}>{title}</h2>
        <div className="space-y-4">{children}</div>
      </section>
    );
  };
  
  const SidebarSection: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>{title}</h2>
        {children}
      </section>
    );
  };
  
  return (
    <div className={cn("bg-white text-gray-800 w-full h-full flex", fontClass)} style={{ fontFamily: "'Work Sans', sans-serif" }}>
      <main className="w-[72%] p-8 overflow-y-auto">
        <header className="mb-6 text-left">
            <h1 className="text-4xl font-bold">{fullName || 'Your Name'}</h1>
            <p className="text-lg text-gray-600 mt-1">{hasExperience ? experience[0]?.role : 'Project Manager'}</p>
        </header>

        <div className="space-y-5">
            <MainSection title="Summary">
              {summary ? (
                <p className="text-gray-700 leading-relaxed">{summary}</p>
              ) : (
                <p className="text-gray-400 italic">Your professional summary will appear here.</p>
              )}
            </MainSection>
            
            <MainSection title="Key Projects" show={hasProjects}>
                 <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
                  {projects.map(p => p.content).join('\n\n')}
                </ReactMarkdown>
            </MainSection>

            <MainSection title="Professional Experience" show={hasExperience}>
              {experience.map(job => (
                <div key={job.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-base font-bold">{job.role || 'Job Title'}</h3>
                    <p className="text-xs text-gray-500 font-medium">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                  </div>
                  <p className="text-sm font-semibold italic">{job.company || 'Company Name'}</p>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
                    {job.description || '* Your job description will appear here.'}
                  </ReactMarkdown>
                </div>
              ))}
            </MainSection>
            
            <MainSection title="Education" show={hasEducation}>
                {education.map(edu => (
                    <div key={edu.id}>
                        <h3 className="text-base font-bold">{edu.school || 'University Name'}</h3>
                        <p className="text-sm font-semibold">{edu.degree || 'Degree'}</p>
                        <p className="text-xs text-gray-500">{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                    </div>
                ))}
            </MainSection>
        </div>
      </main>

      <aside className="w-[28%] p-6 flex flex-col gap-6" style={{ backgroundColor: `${accentColor}10` }}>
        <SidebarSection title="Contact">
          <div className="space-y-1 text-xs">
            <p>{personalInfo.phone}</p>
            <p>{personalInfo.email}</p>
            <p>{personalInfo.city}{personalInfo.state && `, ${personalInfo.state}`}</p>
          </div>
        </SidebarSection>
        
        <SidebarSection title="Skills" show={hasSkills}>
          <ul className="text-sm space-y-1">
            {skills.map((skill, i) => <li key={i} className="flex items-center gap-2"><Star size={12}/>{skill}</li>)}
          </ul>
        </SidebarSection>
        
        <SidebarSection title="Tools" show={customSections.some(s => s.title.toLowerCase().includes('tool'))}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
            {customSections.filter(s => s.title.toLowerCase().includes('tool')).map(t => t.content).join('\n')}
          </ReactMarkdown>
        </SidebarSection>
        
        <SidebarSection title="Certifications" show={hasCertifications}>
          <div className="space-y-3 text-sm">
            {certifications.map(cert => (
              <div key={cert.id}>
                <p className="font-bold flex items-center gap-2"><Award size={12}/>{cert.name}</p>
              </div>
            ))}
          </div>
        </SidebarSection>
      </aside>
    </div>
  );
};
