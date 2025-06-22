
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

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data, accentColor: accentColorProp, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, languages, certifications, awards, websites, activities, customSections, showReferences } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');

  const palette = { accent: '#8B4513', accentSoft: '#F2EAE3', text: '#1B1B1B', muted: '#666666', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;

  const hasExperience = Array.isArray(experience) && experience.length > 0 && experience.some(e => e.role || e.company || e.description);
  const hasEducation = Array.isArray(education) && education.length > 0 && education.some(e => e.school || e.degree);
  const hasSkills = Array.isArray(skills) && skills.some(s => s);
  const hasLanguages = Array.isArray(languages) && languages.length > 0 && languages.some(l => l.name);
  const hasCertifications = Array.isArray(certifications) && certifications.length > 0 && certifications.some(c => c.name);
  const hasAwards = Array.isArray(awards) && awards.length > 0 && awards.some(a => a.name);
  const hasWebsites = Array.isArray(websites) && websites.length > 0 && websites.some(w => w.url);
  const hasActivities = Array.isArray(activities) && activities.length > 0 && activities.some(a => a);
  const hasCustomSections = Array.isArray(customSections) && customSections.length > 0;

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
        <h2 className="text-[1.15rem] leading-tight font-bold uppercase tracking-[.2em] mb-2 border-b pb-1" style={{ borderColor: accentColor }}>{title}</h2>
        <div className="space-y-4">{children}</div>
      </section>
    );
  };
  
  const SidebarSection: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-[var(--fs-small)] font-bold uppercase tracking-[.2em] mb-2" style={{color: palette.muted}}>{title}</h2>
        {children}
      </section>
    );
  };

  return (
    <div className={cn("bg-white text-[var(--fs-body)] w-full h-full flex font-body-lato", fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-base' : '')}
      style={{'--fs-name': '1.8rem / 1.1'} as React.CSSProperties}>
      <main className="w-[72%] p-8 overflow-y-auto">
        <header className="mb-6 text-left">
            <h1 className="font-bold font-display-libre-baskerville uppercase" style={{color: accentColor, fontSize: 'var(--fs-name)'}}>{fullName || 'Your Name'}</h1>
            <h2 className="text-[var(--fs-h2)] text-gray-600 mt-1">{experience?.[0]?.role || 'Executive Title'}</h2>
             <div className="text-[var(--fs-small)] text-gray-600 mt-2 flex gap-4">
                <span>{personalInfo.phone || "Phone Number"}</span>
                <span>{personalInfo.email || "Email Address"}</span>
                <span>{personalInfo.city}{personalInfo.state && `, ${personalInfo.state}`}</span>
            </div>
        </header>

        <div className="space-y-5">
            <MainSection title="Executive Summary">
                <p className="leading-relaxed">{summary || "Your executive summary will appear here. Focus on high-level achievements, leadership skills, and strategic impact."}</p>
            </MainSection>

            <MainSection title="Professional Experience" show={hasExperience}>
              {experience.map(job => (
                <div key={job.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[var(--fs-h3)] font-bold">{job.role || 'Job Title'}</h3>
                    <p className="text-[var(--fs-small)]" style={{ color: palette.muted }}>{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                  </div>
                  <p className="font-bold italic font-display-libre-baskerville" style={{ color: accentColor }}>{job.company || 'Company Name'}</p>
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
                        <p className="font-semibold">{edu.degree || 'Degree'}{edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}</p>
                        <p className="text-[var(--fs-small)] text-gray-500">{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                    </div>
                ))}
            </MainSection>

             <MainSection title="Awards & Recognition" show={hasAwards}>
                <ul className="list-disc list-inside space-y-1">
                    {awards.map(award => (
                        <li key={award.id}><span className="font-bold">{award.name}</span>, {award.date}</li>
                    ))}
                </ul>
             </MainSection>
             
            {hasCustomSections && customSections.map(section => (
                <MainSection key={section.id} title={section.title}>
                     <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                        {section.content || ''}
                    </ReactMarkdown>
                </MainSection>
            ))}

            {showReferences && (
                <MainSection title="References">
                    <p className="italic text-sm">References available upon request.</p>
                </MainSection>
            )}
        </div>
      </main>

      <aside className="w-[28%] p-6 flex flex-col gap-6" style={{ backgroundColor: palette.accentSoft }}>
        <SidebarSection title="Core Competencies" show={hasSkills}>
            <ul className="text-[var(--fs-small)] space-y-1">
              {skills.map((skill, i) => <li key={i}>{skill}</li>)}
            </ul>
        </SidebarSection>
        
        <SidebarSection title="Certifications" show={hasCertifications}>
            <div className="space-y-3 text-[var(--fs-small)]">
              {certifications.map(cert => (
                <div key={cert.id}>
                  <p className="font-bold">{cert.name}</p>
                  <p className="text-xs">{cert.issuer}, {cert.date}</p>
                </div>
              ))}
            </div>
        </SidebarSection>
        
        <SidebarSection title="Languages" show={hasLanguages}>
            <ul className="text-[var(--fs-small)] space-y-1">
              {languages.map(lang => (
                <li key={lang.id}>{lang.name} ({lang.level})</li>
              ))}
            </ul>
        </SidebarSection>

        <SidebarSection title="Activities" show={hasActivities}>
            <ul className="text-[var(--fs-small)] space-y-1">
                {activities.map((activity, i) => <li key={i}>{activity}</li>)}
            </ul>
        </SidebarSection>

        <SidebarSection title="Websites" show={hasWebsites}>
            <ul className="text-[var(--fs-small)] space-y-1">
                {websites.map(site => <li key={site.id}><a href={site.url} className="underline break-all">{site.label || site.url}</a></li>)}
            </ul>
        </SidebarSection>
      </aside>
    </div>
  );
};
