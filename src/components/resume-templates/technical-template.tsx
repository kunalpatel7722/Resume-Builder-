
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
  const { personalInfo, summary, experience, education, skills, certifications, customSections, awards, websites, activities, showReferences } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const projects = Array.isArray(customSections) ? customSections.filter(s => s.title.toLowerCase().includes('project')) : [];
  const otherCustomSections = Array.isArray(customSections) ? customSections.filter(s => !s.title.toLowerCase().includes('project')) : [];


  const palette = { accent: '#009688', accentSoft: '#E0F5F4', text: '#1D1D1D', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;
  
  const hasExperience = Array.isArray(experience) && experience.length > 0 && experience.some(e => e.role || e.company || e.description);
  const hasEducation = Array.isArray(education) && education.length > 0 && education.some(e => e.school || e.degree);
  const hasSkills = Array.isArray(skills) && skills.some(s => s);
  const hasCertifications = Array.isArray(certifications) && certifications.length > 0 && certifications.some(c => c.name);
  const hasProjects = Array.isArray(projects) && projects.length > 0 && projects.some(p => p.content);
  const hasAwards = Array.isArray(awards) && awards.length > 0 && awards.some(a => a.name);
  const hasWebsites = Array.isArray(websites) && websites.length > 0 && websites.some(w => w.url);
  const hasActivities = Array.isArray(activities) && activities.length > 0 && activities.some(a => a);
  const hasOtherCustomSections = Array.isArray(otherCustomSections) && otherCustomSections.length > 0;

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
    <div className={cn("bg-white text-[var(--fs-body)] w-full h-full flex font-display-jetbrains-mono", fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-base' : '')}
      style={{'--fs-name': '1.6rem / 1.2'} as React.CSSProperties}>
      <main className="flex-1 p-8 grid grid-cols-5 gap-8">
        <div className="col-span-3 space-y-6">
            <header className="mb-6">
                <h1 className="font-bold" style={{color: accentColor, fontSize: 'var(--fs-name)'}}>{fullName || 'Your Name'}</h1>
                <p className="text-[var(--fs-h3)]">{experience?.[0]?.role || 'Technical Professional'}</p>
                <p className="text-[var(--fs-small)] text-gray-500 mt-2">{personalInfo.email} &bull; {personalInfo.phone}</p>
            </header>
            
            <p className="leading-relaxed font-body-inter">{summary || "Your professional summary will appear here. Keep it brief and highlight your core technical competencies."}</p>
            
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
            
            {hasOtherCustomSections && otherCustomSections.map(section => (
                <Section key={section.id} title={section.title}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none font-body-inter">
                        {section.content || ''}
                    </ReactMarkdown>
                </Section>
            ))}
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
                    {p.content || "* Describe your key projects here."}
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

          <Section title="Awards" show={hasAwards}>
             <ul className="text-[var(--fs-body)] space-y-1 list-disc list-inside font-body-inter">
                {awards.map((award) => <li key={award.id}>{award.name}</li>)}
              </ul>
          </Section>

          <Section title="Websites" show={hasWebsites}>
             <ul className="text-[var(--fs-body)] space-y-1 list-disc list-inside font-body-inter">
                {websites.map((site) => <li key={site.id}><a href={site.url} className="underline">{site.label || site.url}</a></li>)}
              </ul>
          </Section>
          
          <Section title="Activities" show={hasActivities}>
             <ul className="text-[var(--fs-body)] space-y-1 list-disc list-inside font-body-inter">
                {activities.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
          </Section>
        </div>
        
        {showReferences && (
            <div className="col-span-5 text-center italic text-sm text-gray-500 pt-4 font-body-inter">
                <p>References available upon request.</p>
            </div>
        )}
      </main>
    </div>
  );
};
