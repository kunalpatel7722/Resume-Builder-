import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';

export interface TemplateProps {
  data: ResumeData;
  accentColor: string;
  fontSize: 'sm' | 'md' | 'lg';
}

const fontClasses = {
  sm: 'text-[10pt]',
  md: 'text-[11pt]',
  lg: 'text-[12pt]',
};

export const CreativeWriterTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, languages, certifications, activities, awards, websites, customSections, showReferences } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');

  const hasExperience = experience.some(e => e.role || e.company || e.description);
  const hasEducation = education.some(e => e.school || e.degree || e.fieldOfStudy);
  const hasSkills = skills.some(s => s);
  const hasAwards = awards.some(a => a.name);
  const hasWebsites = websites.some(w => w.url);
  const hasPublications = customSections.some(s => s.title.toLowerCase().includes('publication'));

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'yyyy')}`;
    return start;
  };
  
  const fontClass = fontClasses[fontSize];

  const Section: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-center mb-3" style={{ color: accentColor }}>{title}</h2>
        {children}
      </section>
    );
  };
  
  return (
    <div className={cn("bg-white text-gray-800 p-10 w-full h-full", fontClass)} style={{ fontFamily: "'Lora', serif" }}>
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold" style={{fontFamily: "'Playfair Display', serif"}}>{fullName || 'Your Name'}</h1>
        <p className="text-lg text-gray-600 mt-1">{personalInfo.email} &bull; {personalInfo.phone}</p>
      </header>
      
      <main className="max-w-3xl mx-auto space-y-6">
        <section>
          {summary ? (
            <blockquote className="text-center italic text-gray-700 leading-relaxed border-l-4 border-r-4 px-4" style={{borderColor: accentColor}}>
              "{summary}"
            </blockquote>
          ) : (
            <p className="text-gray-400 italic text-center">Your summary will appear here.</p>
          )}
        </section>
        
        <div className="w-24 h-px bg-gray-200 mx-auto" />

        <Section title="Experience" show={hasExperience}>
          <div className="space-y-4">
            {experience.map((job) => (
              <div key={job.id} className="text-center">
                  <h3 className="text-lg font-bold">{job.role || 'Job Title'}</h3>
                  <p className="text-base italic text-gray-700">{job.company || 'Publisher / Company'} &mdash; {formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-800 mt-1 text-left">
                    {job.description || '* Your job description will appear here.'}
                  </ReactMarkdown>
              </div>
            ))}
          </div>
        </Section>
        
        <Section title="Publications" show={hasPublications}>
          <div className="space-y-2">
            {customSections.filter(s => s.title.toLowerCase().includes('publication')).map(section => (
              <ReactMarkdown key={section.id} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-800">
                  {section.content || 'Your publications will appear here.'}
              </ReactMarkdown>
            ))}
          </div>
        </Section>

        <div className="grid grid-cols-2 gap-8 pt-4">
            <Section title="Skills" show={hasSkills}>
                <ul className="text-center space-y-1">
                    {skills.map((skill, index) => <li key={index} className="text-gray-700">{skill}</li>)}
                </ul>
            </Section>

            <Section title="Education" show={hasEducation}>
              {education.map((edu) => (
                <div key={edu.id} className="text-center">
                  <h3 className="text-lg font-bold">{edu.degree || 'Degree'}</h3>
                  <p className="text-base italic text-gray-700">{edu.school || 'University'}</p>
                  <p className="text-sm text-gray-500">{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                </div>
              ))}
            </Section>
        </div>

        <Section title="Awards" show={hasAwards}>
          {awards.map((award) => (
            <div key={award.id} className="text-center mb-2">
               <h3 className="text-lg font-bold">{award.name || 'Award Name'}</h3>
               <p className="text-base italic text-gray-700">{award.description} - {award.date || 'Date'}</p>
            </div>
          ))}
        </Section>
        
        <Section title="Links" show={hasWebsites}>
          <div className="text-center space-x-4">
            {websites.map((site) => (
              <a key={site.id} href={site.url} className="hover:underline" style={{ color: accentColor }}>{site.label || site.url}</a>
            ))}
          </div>
        </Section>
      </main>
    </div>
  );
};
