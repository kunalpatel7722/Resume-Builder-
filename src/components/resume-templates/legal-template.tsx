
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

export const LegalTemplate: React.FC<TemplateProps> = ({ data, accentColor: accentColorProp, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, certifications, customSections } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');
  const publications = customSections.filter(s => s.title.toLowerCase().includes('publication'));

  const palette = { accent: '#00264D', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;

  const hasContent = (arr: any[], ...fields: string[]) => Array.isArray(arr) && arr.some(item => item && fields.some(field => item[field]));

  const hasExperience = hasContent(experience, 'role', 'company', 'description');
  const hasEducation = hasContent(education, 'school', 'degree');
  const hasSkills = skills.length > 0;
  const hasCertifications = hasContent(certifications, 'name');
  const hasPublications = hasContent(publications, 'content');

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
        <h2 className="text-[var(--fs-h2)] font-bold uppercase tracking-[.2em] mb-2">{title}</h2>
        <div className="space-y-3">{children}</div>
      </section>
    );
  };

  return (
    <div className={cn("bg-white text-black text-[var(--fs-body)] p-8 w-full h-full flex font-serif-eb-garamond", fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-base' : '')}>
      <div className="w-1" style={{ backgroundColor: accentColor }} />
      <div className="pl-6 flex-1">
        <header className="text-left mb-6">
          <h1 className="text-[var(--fs-name)] font-bold tracking-wider">{fullName || 'Your Name'}</h1>
          <div className="text-[var(--fs-small)] text-gray-700 mt-2 space-x-3">
            <span>{fullAddress || 'Address'}</span>
            <span>&bull;</span>
            <span>{personalInfo.phone || 'Phone'}</span>
            <span>&bull;</span>
            <span>{personalInfo.email || 'Email'}</span>
          </div>
        </header>

        <main className="space-y-4">
          <Section title="Summary">
            {summary ? (
              <p className="leading-relaxed text-justify">{summary}</p>
            ) : <p className="leading-relaxed text-justify text-gray-400 italic">Your professional summary will appear here.</p>}
          </Section>

          <Section title="Legal Experience">
            {hasExperience ? (
              experience.map((job) => (
                <div key={job.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[var(--fs-h3)] font-bold">{job.company || 'Law Firm / Company'}</h3>
                    <p className="text-[var(--fs-small)] font-medium">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                  </div>
                  <p className="italic">{job.role || 'Job Title'}</p>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                      {job.description || '* Your job description will appear here.'}
                  </ReactMarkdown>
                </div>
              ))
            ) : <p className="text-gray-400 italic">Your legal experience will appear here.</p>}
          </Section>

          <Section title="Education">
            {hasEducation ? (
              education.map((edu) => {
                const gradDate = edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
                return (
                  <div key={edu.id}>
                     <div className="flex justify-between items-baseline">
                        <h3 className="text-[var(--fs-h3)] font-bold">{edu.school || 'Law School Name'}</h3>
                        <p className="text-[var(--fs-small)] font-medium">{gradDate || 'Date'}</p>
                    </div>
                    <p className="italic">{edu.degree || 'Juris Doctor'}</p>
                  </div>
                );
              })
            ) : <p className="text-gray-400 italic">Your education details will appear here.</p>}
          </Section>
          
          <Section title="Admissions & Skills">
            {hasSkills ? <p>{skills.join('; ')}</p> : <p className="text-gray-400 italic">Your admissions and skills will appear here.</p>}
          </Section>

          <Section title="Publications">
            {hasPublications ? (
              publications.map(p => (
                  <ReactMarkdown key={p.id} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                      {p.content}
                  </ReactMarkdown>
              ))
            ) : <p className="text-gray-400 italic">Your publications will appear here.</p>}
          </Section>

          <Section title="Certifications">
             {hasCertifications ? (
                certifications.map((cert) => (
                  <div key={cert.id} className="text-[var(--fs-body)]">
                     <span className="font-bold">{cert.name || 'Certification Name'}</span>, {cert.issuer}, {cert.date}
                  </div>
                ))
             ) : <p className="text-gray-400 italic">Your certifications will appear here.</p>}
          </Section>
        </main>
      </div>
    </div>
  );
};
