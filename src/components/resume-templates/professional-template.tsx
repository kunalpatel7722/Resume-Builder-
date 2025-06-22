
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

export const ProfessionalTemplate: React.FC<TemplateProps> = ({ data, accentColor: accentColorProp, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, customSections, awards, websites, activities, showReferences } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');
  const tools = Array.isArray(customSections) ? customSections.filter(s => s.title.toLowerCase().includes('tool')) : [];
  const otherCustomSections = Array.isArray(customSections) ? customSections.filter(s => !s.title.toLowerCase().includes('tool')) : [];


  const palette = { accent: '#17494D', accentSoft: '#E6F3F4', text: '#222222', muted: '#666666', line: '#D0D0D0', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;

  const hasExperience = Array.isArray(experience) && experience.length > 0 && experience.some(e => e.role || e.company || e.description);
  const hasEducation = Array.isArray(education) && education.length > 0 && education.some(e => e.school || e.degree);
  const hasSkills = Array.isArray(skills) && skills.some(s => s);
  const hasTools = Array.isArray(tools) && tools.length > 0 && tools.some(t => t.content);
  const hasAwards = Array.isArray(awards) && awards.length > 0 && awards.some(a => a.name);
  const hasWebsites = Array.isArray(websites) && websites.length > 0 && websites.some(w => w.url);
  const hasActivities = Array.isArray(activities) && activities.length > 0 && activities.some(a => a);
  const hasOtherCustomSections = Array.isArray(otherCustomSections) && otherCustomSections.length > 0;

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
        <h2 className="font-bold uppercase tracking-widest mb-3" style={{ color: accentColor, fontSize: '1.1rem', lineHeight: '1.3' }}>{title}</h2>
        <div className="space-y-4">{children}</div>
      </section>
    );
  };

  return (
    <div className={cn("bg-white text-[var(--fs-body)] p-8 w-full h-full font-body-roboto", fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-base' : '')}
      style={{'--fs-name': '1.6rem / 1.2'} as React.CSSProperties}>
      <header className="text-center mb-6">
        <h1 className="font-bold font-headline-roboto-slab" style={{fontSize: 'var(--fs-name)'}}>{fullName || 'Your Name'}</h1>
        <p className="text-[var(--fs-h2)] text-gray-600 mt-1">{experience?.[0]?.role || 'Professional Title'}</p>
        <p className="text-[var(--fs-small)]" style={{color: palette.muted}}>{personalInfo.email} &bull; {personalInfo.phone} &bull; {fullAddress}</p>
      </header>
      
      <hr className="mb-6" style={{borderColor: palette.line}}/>

      <main className="space-y-6">
        <section>
          <p className="leading-relaxed text-center">{summary || "Your professional summary will appear here. This should be a concise statement of your key skills and career accomplishments."}</p>
        </section>

        <Section title="Professional Experience" show={hasExperience}>
            {experience.map(job => (
              <div key={job.id}>
                 <div className="flex justify-between items-center">
                  <h3 className="text-[var(--fs-h3)] font-bold">{job.role || 'Job Title'}</h3>
                  <span className="flex-grow border-b border-dotted mx-2" style={{borderColor: palette.line}}></span>
                  <p className="text-[var(--fs-small)]" style={{color: palette.muted}}>{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                </div>
                <p className="font-semibold italic">{job.company || 'Company Name'}</p>
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                  {job.description || '* Your job description will appear here.'}
                </ReactMarkdown>
              </div>
            ))}
        </Section>
        
        <div className="grid grid-cols-2 gap-8">
            <Section title="Education" show={hasEducation}>
                  {education.map(edu => (
                      <div key={edu.id}>
                          <h3 className="text-[var(--fs-h3)] font-bold">{edu.school || 'University Name'}</h3>
                          <p className="font-semibold">{edu.degree || 'Degree'}</p>
                          <p className="text-[var(--fs-small)] text-gray-500">{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                      </div>
                  ))}
            </Section>

            <Section title="Skills & Tools" show={hasSkills || hasTools}>
                {hasSkills && (
                    <div className="mb-3">
                        <h3 className="font-bold mb-1">Core Skills</h3>
                        <div className="flex flex-wrap gap-2">
                           {skills.map((skill, i) => <span key={i} className="text-[var(--fs-small)] bg-gray-100 px-3 py-1 rounded">{skill}</span>)}
                        </div>
                    </div>
                )}
                {hasTools && (
                    <div>
                        <h3 className="font-bold mb-1">Tools</h3>
                         <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                           {tools?.[0]?.content || '* List relevant tools here'}
                        </ReactMarkdown>
                    </div>
                )}
            </Section>
        </div>
        
        <div className="grid grid-cols-2 gap-8">
            <Section title="Awards" show={hasAwards}>
                <ul className="list-disc list-inside">
                    {awards.map(award => <li key={award.id}>{award.name}</li>)}
                </ul>
            </Section>
            <Section title="Activities" show={hasActivities}>
                <ul className="list-disc list-inside">
                    {activities.map((activity, i) => <li key={i}>{activity}</li>)}
                </ul>
            </Section>
        </div>

        <Section title="Websites" show={hasWebsites}>
            <div className="flex justify-center gap-4">
                {websites.map(site => <a key={site.id} href={site.url} className="underline">{site.label || site.url}</a>)}
            </div>
        </Section>

        {hasOtherCustomSections && otherCustomSections.map(section => (
            <Section key={section.id} title={section.title}>
                 <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-center">
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
