
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

export const SimpleTemplate: React.FC<TemplateProps> = ({ data, accentColor: accentColorProp, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, awards, websites, activities, customSections, showReferences } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');

  const palette = { accent: '#333333', text: '#111111', muted: '#777777', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;

  const hasExperience = Array.isArray(experience) && experience.length > 0 && experience.some(e => e.role || e.company || e.description);
  const hasEducation = Array.isArray(education) && education.length > 0 && education.some(e => e.school || e.degree);
  const hasSkills = Array.isArray(skills) && skills.some(s => s);
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
  
  const Section: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-[var(--fs-h2)] font-bold uppercase tracking-[.2em] mb-2" style={{color: accentColor}}>{title}</h2>
        <div className="space-y-4">{children}</div>
      </section>
    );
  };
  
  return (
    <div className={cn("bg-white text-[var(--fs-body)] p-8 w-full h-full font-body-open-sans", fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-base' : '')}>
      <header className="text-center mb-8">
        <h1 className="text-[var(--fs-name)] font-bold" style={{color: palette.text}}>{fullName || 'Your Name'}</h1>
        <p className="text-[var(--fs-h3)]" style={{color: palette.muted}}>{experience?.[0]?.role || 'Professional Title'}</p>
        <p className="text-[var(--fs-small)] text-gray-500 mt-3">{personalInfo.phone} &bull; {personalInfo.email} &bull; {fullAddress}</p>
      </header>
      
      <main className="space-y-6">
        <Section title="Summary">
          <p className="leading-relaxed">{summary || "Your professional summary will appear here. This is your chance to make a strong first impression."}</p>
        </Section>

        <Section title="Experience" show={hasExperience}>
            {experience.map(job => (
              <div key={job.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[var(--fs-h3)] font-bold">{job.role || 'Job Title'}</h3>
                  <p className="text-[var(--fs-small)] font-medium" style={{color: palette.muted}}>{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
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
                  <div key={edu.id} className="flex justify-between items-baseline">
                      <div>
                          <h3 className="text-[var(--fs-h3)] font-bold">{edu.school || 'University Name'}</h3>
                          <p>{edu.degree || 'Degree'}</p>
                      </div>
                      <p className="text-[var(--fs-small)]" style={{color: palette.muted}}>{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                  </div>
              ))}
        </Section>
        
        <Section title="Skills" show={hasSkills}>
            <p>{skills.join(' | ')}</p>
        </Section>

        <Section title="Awards" show={hasAwards}>
            <p>{awards.map(a => a.name).join(' | ')}</p>
        </Section>
        
        <Section title="Activities" show={hasActivities}>
            <p>{activities.join(' | ')}</p>
        </Section>
        
        <Section title="Websites" show={hasWebsites}>
            <div className="flex flex-wrap gap-x-4">
                {websites.map(site => <a key={site.id} href={site.url} className="underline">{site.label || site.url}</a>)}
            </div>
        </Section>
        
        {hasCustomSections && customSections.map(section => (
            <Section key={section.id} title={section.title}>
                 <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                    {section.content || ''}
                </ReactMarkdown>
            </Section>
        ))}

        {showReferences && (
            <div className="text-center italic text-sm text-gray-500 pt-4">
                <p>References available upon request.</p>
            </div>
        )}
      </main>
    </div>
  );
};
