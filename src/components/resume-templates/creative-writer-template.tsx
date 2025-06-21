
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

export const CreativeWriterTemplate: React.FC<TemplateProps> = ({ data, accentColor: accentColorProp, fontSize }) => {
  const { personalInfo, summary, experience, education, awards, websites, customSections } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const publications = customSections.filter(s => s.title.toLowerCase().includes('publication'));

  const palette = { accent: '#D84315', accentSoft: '#FFEDEA', text: '#1A1A1A', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;
  
  const hasContent = (arr: any[], ...fields: string[]) => Array.isArray(arr) && arr.some(item => item && fields.some(field => item[field]));

  const hasExperience = hasContent(experience, 'role', 'company', 'description');
  const hasEducation = hasContent(education, 'school', 'degree');
  const hasAwards = hasContent(awards, 'name');
  const hasWebsites = hasContent(websites, 'url');
  const hasPublications = hasContent(publications, 'content');

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'yyyy')}`;
    return start;
  };

  const Section: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section className="mb-6">
        <h2 className="text-[var(--fs-h2)] font-bold tracking-tight text-center mb-3" style={{ color: accentColor }}>{title}</h2>
        {children}
      </section>
    );
  };
  
  return (
    <div className={cn("bg-white text-[var(--fs-body)] p-10 w-full h-full font-serif-lora text-black", fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-base' : '')}>
      <header className="text-center mb-6">
        <h1 className="text-[var(--fs-name)] font-bold font-serif-playfair">{fullName || 'Your Name'}</h1>
        <p className="text-[var(--fs-h3)] text-gray-600 mt-1">{experience[0]?.role || 'Creative Writer'}</p>
        <p className="text-[var(--fs-small)] text-gray-600 mt-1">{personalInfo.email} &bull; {personalInfo.phone}</p>
      </header>
      
      <main className="max-w-3xl mx-auto space-y-6">
        <section>
          {summary ? (
            <blockquote className="text-center italic text-gray-700 leading-relaxed border-l-4 border-r-4 px-4 py-2" style={{borderColor: accentColor, backgroundColor: palette.accentSoft}}>
              "{summary}"
            </blockquote>
          ) : (
            <p className="text-gray-400 italic text-center">Your summary will appear here.</p>
          )}
        </section>
        
        <div className="w-24 h-px bg-gray-200 mx-auto" />

        <Section title="Experience">
          <div className="space-y-4">
            {hasExperience ? experience.map((job) => (
              <div key={job.id} className="text-center">
                  <h3 className="text-[var(--fs-h3)] font-bold">{job.role || 'Job Title'}</h3>
                  <p className="text-base italic text-gray-700">{job.company || 'Publisher / Company'} &mdash; {formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none mt-1 text-left">
                    {job.description || '* Your job description will appear here.'}
                  </ReactMarkdown>
              </div>
            )) : <p className="text-gray-400 italic text-center">Your work experience will appear here.</p>}
          </div>
        </Section>
        
        <Section title="Publications">
          <div className="space-y-2">
            {hasPublications ? publications.map(section => (
              <ReactMarkdown key={section.id} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                  {section.content}
              </ReactMarkdown>
            )) : <p className="text-gray-400 italic text-center">Your publications will appear here.</p>}
          </div>
        </Section>

        <Section title="Education">
          {hasEducation ? education.map((edu) => (
            <div key={edu.id} className="text-center">
              <h3 className="text-[var(--fs-h3)] font-bold">{edu.degree || 'Degree'}</h3>
              <p className="text-base italic text-gray-700">{edu.school || 'University'}</p>
              <p className="text-[var(--fs-small)] text-gray-500">{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
            </div>
          )) : <p className="text-gray-400 italic text-center">Your education details will appear here.</p>}
        </Section>

        <Section title="Awards">
          {hasAwards ? awards.map((award) => (
            <div key={award.id} className="text-center mb-2">
               <h3 className="text-[var(--fs-h3)] font-bold">{award.name || 'Award Name'}</h3>
               <p className="text-base italic text-gray-700">{award.description} - {award.date || 'Date'}</p>
            </div>
          )) : <p className="text-gray-400 italic text-center">Your awards will appear here.</p>}
        </Section>
        
        <Section title="Links">
          <div className="text-center space-x-4">
            {hasWebsites ? websites.map((site) => (
              <a key={site.id} href={site.url} className="hover:underline" style={{ color: accentColor }}>{site.label || site.url}</a>
            )) : <p className="text-gray-400 italic">Your website links will appear here.</p>}
          </div>
        </Section>
      </main>
    </div>
  );
};
