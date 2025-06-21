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

export const LegalTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, certifications, customSections } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');
  const publications = customSections.filter(s => s.title.toLowerCase().includes('publication'));

  const hasExperience = experience.some(e => e.role || e.company || e.description);
  const hasEducation = education.some(e => e.school || e.degree || e.fieldOfStudy);
  const hasSkills = skills.some(s => s);
  const hasCertifications = certifications.some(c => c.name);
  const hasPublications = publications.length > 0;

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'MMM yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'MMM yyyy')}`;
    return start;
  };

  const fontClass = fontClasses[fontSize];

  const Section: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-sm font-bold uppercase tracking-[.2em] mb-2">{title}</h2>
        <div className="space-y-3">{children}</div>
      </section>
    );
  };

  return (
    <div className={cn("bg-white text-black p-8 w-full h-full flex", fontClass)} style={{ fontFamily: "'EB Garamond', serif" }}>
      <div className="w-4" style={{ backgroundColor: accentColor }} />
      <div className="pl-6 flex-1">
        <header className="text-left mb-6">
          <h1 className="text-4xl font-bold tracking-wider">{fullName || 'Your Name'}</h1>
          <div className="text-sm text-gray-700 mt-2 space-x-3">
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
              <p className="text-gray-800 leading-relaxed text-justify">{summary}</p>
            ) : (
              <p className="text-gray-400 italic">Your professional summary will appear here.</p>
            )}
          </Section>

          <Section title="Legal Experience" show={hasExperience}>
            {experience.map((job) => (
              <div key={job.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-base font-bold">{job.company || 'Law Firm / Company'}</h3>
                  <p className="text-xs font-medium">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                </div>
                <p className="text-sm italic">{job.role || 'Job Title'}</p>
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-800">
                    {job.description || '* Your job description will appear here.'}
                </ReactMarkdown>
              </div>
            ))}
          </Section>

          <Section title="Education" show={hasEducation}>
            {education.map((edu) => {
              const gradDate = edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
              return (
                <div key={edu.id}>
                   <div className="flex justify-between items-baseline">
                      <h3 className="text-base font-bold">{edu.school || 'Law School Name'}</h3>
                      <p className="text-xs font-medium">{gradDate || 'Date'}</p>
                  </div>
                  <p className="text-sm italic">{edu.degree || 'Juris Doctor'}</p>
                </div>
              );
            })}
          </Section>
          
          <Section title="Admissions & Skills" show={hasSkills}>
            <p className="text-gray-800">{skills.join('; ')}</p>
          </Section>

          <Section title="Publications" show={hasPublications}>
            {publications.map(p => (
                <ReactMarkdown key={p.id} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-800">
                    {p.content || 'Your publications will appear here.'}
                </ReactMarkdown>
            ))}
          </Section>

          <Section title="Certifications" show={hasCertifications}>
             {certifications.map((cert) => (
              <div key={cert.id} className="text-sm">
                 <span className="font-bold">{cert.name || 'Certification Name'}</span>, {cert.issuer}, {cert.date}
              </div>
            ))}
          </Section>
        </main>
      </div>
    </div>
  );
};
