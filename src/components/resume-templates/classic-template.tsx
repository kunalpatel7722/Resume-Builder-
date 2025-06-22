
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

export const ClassicTemplate: React.FC<TemplateProps> = ({ data, accentColor: accentColorProp, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, certifications, customSections, activities, awards, websites, showReferences } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');

  const palette = { accent: '#000000', text: '#000000', muted: '#555555', line: '#B5B5B5', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;

  const hasExperience = Array.isArray(experience) && experience.length > 0 && experience.some(e => e.role || e.company || e.description);
  const hasEducation = Array.isArray(education) && education.length > 0 && education.some(e => e.school || e.degree);
  const hasSkills = Array.isArray(skills) && skills.some(s => s);
  const hasCerts = Array.isArray(certifications) && certifications.length > 0 && certifications.some(c => c.name);
  const hasActivities = Array.isArray(activities) && activities.length > 0 && activities.some(a => a);
  const hasAwards = Array.isArray(awards) && awards.length > 0 && awards.some(a => a.name);
  const hasWebsites = Array.isArray(websites) && websites.length > 0 && websites.some(w => w.url);
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
        <h2 className="text-center font-bold tracking-[.2em] uppercase" style={{ color: palette.accent, fontSize: 'var(--fs-h3)' }}>
          {title}
        </h2>
        <hr className="my-2" style={{ borderColor: palette.line, borderWidth: '0.5px' }} />
        {children}
      </section>
    );
  };

  return (
    <div className={cn("bg-white p-8 w-full h-full text-[var(--fs-body)] font-serif-source text-black", fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-base' : '')}
      style={{'--fs-name': '1.55rem / 1.2'} as React.CSSProperties}>
      <header className="text-center mb-4">
        <h1 className="font-bold" style={{ color: accentColor, fontSize: 'var(--fs-name)' }}>{fullName || 'Your Name'}</h1>
        <div className="text-[var(--fs-small)] mt-2" style={{ color: palette.muted }}>
          <span>{fullAddress || 'Address'}</span>
          {(fullAddress && (personalInfo.phone || personalInfo.email)) && <span className="mx-2">|</span>}
          <span>{personalInfo.phone || 'Phone'}</span>
          {(personalInfo.phone && personalInfo.email) && <span className="mx-2">|</span>}
          <span>{personalInfo.email || 'Email'}</span>
        </div>
      </header>

      <main className="space-y-5">
        <Section title="Summary">
            <p className="text-center leading-relaxed">{summary || "A brief summary about your professional background and career goals. Keep it concise and impactful, tailored to the job you are applying for."}</p>
        </Section>
        
        <Section title="Experience" show={hasExperience}>
          <div className="space-y-4">
            {experience.map((job) => {
              const location = [job.city, job.state].filter(Boolean).join(', ');
              return (
                <div key={job.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[var(--fs-h3)] font-bold">{job.role || 'Job Title'}</h3>
                    <p className="text-[var(--fs-small)] font-medium" style={{ color: palette.muted }}>
                      {formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}
                    </p>
                  </div>
                  <p className="text-[var(--fs-body)] font-bold italic">{job.company || 'Company Name'}{location && `, ${location}`}</p>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                    {job.description || '* Responsibilities and achievements in this role.'}
                  </ReactMarkdown>
                </div>
              );
            })}
          </div>
        </Section>

        <Section title="Education" show={hasEducation}>
          <div className="space-y-2">
            {education.map((edu) => {
              const gradDate = edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
              return (
                <div key={edu.id}>
                   <div className="flex justify-between items-baseline">
                      <h3 className="text-[var(--fs-h3)] font-bold">{edu.school || 'School Name'}</h3>
                      <p className="text-[var(--fs-small)] font-medium" style={{ color: palette.muted }}>{gradDate || 'Date'}</p>
                  </div>
                  <p className="italic">{edu.degree || 'Degree'}{edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}</p>
                </div>
              );
            })}
          </div>
        </Section>
        
        <Section title="Skills" show={hasSkills}>
            <p className="text-center">{skills.join(' • ')}</p>
        </Section>
        
        <div className="grid grid-cols-2 gap-x-8">
            <Section title="Certifications" show={hasCerts}>
                 <ul className="list-disc list-inside text-center">
                     {certifications.map((cert) => (
                         <li key={cert.id}>{cert.name}</li>
                     ))}
                 </ul>
            </Section>
            <Section title="Awards" show={hasAwards}>
                 <ul className="list-disc list-inside text-center">
                     {awards.map((award) => (
                         <li key={award.id}>{award.name}</li>
                     ))}
                 </ul>
            </Section>
        </div>
        
        <Section title="Websites & Links" show={hasWebsites}>
            <div className="flex justify-center gap-4">
                {websites.map(site => (
                    <a key={site.id} href={site.url} className="underline">{site.label || site.url}</a>
                ))}
            </div>
        </Section>
        
        <Section title="Activities" show={hasActivities}>
            <p className="text-center">{activities.join(', ')}</p>
        </Section>
        
        {hasCustomSections && customSections.map(section => (
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
