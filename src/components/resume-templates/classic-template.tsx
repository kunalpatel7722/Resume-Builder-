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
  const { personalInfo, summary, experience, education, skills, certifications } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');

  const palette = { accent: '#000000', text: '#000000', muted: '#555555', line: '#B5B5B5', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;

  const hasContent = (arr: any[], ...fields: string[]) => Array.isArray(arr) && arr.some(item => item && fields.some(field => item[field]));

  const hasExperience = hasContent(experience, 'role', 'company', 'description');
  const hasEducation = hasContent(education, 'school', 'degree');
  const hasSkills = Array.isArray(skills) && skills.some(s => s);
  const hasCerts = hasContent(certifications, 'name');

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
        <h2 className="text-[var(--fs-h2)] font-bold tracking-[.2em] uppercase text-center mb-3" style={{ color: palette.accent }}>
          {title}
        </h2>
        {children}
      </section>
    );
  };

  return (
    <div className={cn("bg-white p-8 w-full h-full text-[var(--fs-body)] font-serif-source text-black", fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-base' : '')}>
      <header className="text-center mb-4">
        <h1 className="text-[var(--fs-name)] font-bold" style={{ color: accentColor }}>{fullName || 'Your Name'}</h1>
        <div className="text-[var(--fs-small)] mt-2" style={{ color: palette.muted }}>
          <span>{fullAddress || 'Address'}</span>
          {(fullAddress && (personalInfo.phone || personalInfo.email)) && <span className="mx-2">|</span>}
          <span>{personalInfo.phone || 'Phone'}</span>
          {(personalInfo.phone && personalInfo.email) && <span className="mx-2">|</span>}
          <span>{personalInfo.email || 'Email'}</span>
        </div>
      </header>

      <hr className="my-4" style={{ borderColor: palette.line }} />

      <main className="space-y-5">
        <Section title="Summary">
          {summary ? (
            <p className="text-center leading-relaxed">{summary}</p>
          ) : (
             <p className="text-center leading-relaxed text-gray-400 italic">A brief summary about your professional background and career goals.</p>
          )}
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
        
        <div className="grid grid-cols-2 gap-4">
            <Section title="Skills" show={hasSkills}>
                <div className="flex flex-wrap justify-center gap-2">
                    {skills.map((skill, i) => (
                        <span key={i} className="text-[var(--fs-small)] border rounded-full px-3 py-1" style={{ borderColor: palette.line }}>
                        {skill}
                        </span>
                    ))}
                </div>
            </Section>
            <Section title="Certifications" show={hasCerts}>
                 <div className="flex flex-wrap justify-center gap-2">
                     {certifications.map((cert) => (
                         <span key={cert.id} className="text-[var(--fs-small)] border rounded-full px-3 py-1" style={{ borderColor: palette.line }}>
                         {cert.name}
                         </span>
                     ))}
                 </div>
            </Section>
        </div>
      </main>
    </div>
  );
};
