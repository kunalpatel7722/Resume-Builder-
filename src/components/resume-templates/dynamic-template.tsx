
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { Mail, Phone, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TemplateProps {
  data: ResumeData;
  accentColor?: string;
  fontSize?: 'sm' | 'md' | 'lg';
}

export const DynamicTemplate: React.FC<TemplateProps> = ({ data, accentColor: accentColorProp, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, certifications } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');

  const palette = { accent: '#1976D2', accentSoft: '#E3F2FD', text: '#212121', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;

  const hasContent = (arr: any[] | undefined, ...fields: string[]) => {
    if (!Array.isArray(arr) || arr.length === 0) return false;
    return arr.some(item => item && fields.some(field => item[field]));
  };

  const hasExperience = hasContent(experience, 'role', 'company', 'description');
  const hasEducation = hasContent(education, 'school', 'degree');
  const hasSkills = Array.isArray(skills) && skills.length > 0;
  const hasCertifications = hasContent(certifications, 'name');

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
        <h2 className="text-[var(--fs-h2)] font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>{title}</h2>
        <div className="space-y-4">{children}</div>
      </section>
    );
  };
  
  return (
    <div className={cn("bg-white text-[var(--fs-body)] p-8 w-full h-full font-body-roboto", fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-base' : '')}>
      <header className="flex items-center gap-6 mb-6 p-6 rounded-lg" style={{ backgroundColor: palette.accentSoft }}>
        {personalInfo.photoUrl && (
          <img src={personalInfo.photoUrl} alt={fullName} className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md" data-ai-hint="person face" />
        )}
        <div>
            <h1 className="text-[var(--fs-name)] font-bold" style={{color: palette.text}}>{fullName || 'Your Name'}</h1>
            <h2 className="text-[var(--fs-h3)] font-semibold" style={{ color: accentColor }}>{experience?.[0]?.role || 'Professional Title'}</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[var(--fs-small)] text-gray-700 mt-2">
                {personalInfo.email && <div className="flex items-center gap-1.5"><Mail size={14}/>{personalInfo.email}</div>}
                {personalInfo.phone && <div className="flex items-center gap-1.5"><Phone size={14}/>{personalInfo.phone}</div>}
                {personalInfo.city && <div className="flex items-center gap-1.5"><MapPin size={14}/>{personalInfo.city}{personalInfo.state && `, ${personalInfo.state}`}</div>}
            </div>
        </div>
      </header>
      
      <main className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
            <Section title="Summary">
                <p className="leading-relaxed">{summary || "Your professional summary will appear here. This is a great place to highlight your key skills, experience, and career goals."}</p>
            </Section>

            <Section title="Experience" show={hasExperience}>
              {experience.map(job => (
                <div key={job.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[var(--fs-h3)] font-bold">{job.role || 'Job Title'}</h3>
                    <p className="text-[var(--fs-small)] text-gray-500 font-medium">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                  </div>
                  <p className="font-semibold italic">{job.company || 'Company Name'}</p>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                      {job.description || '* Your job description will appear here.'}
                  </ReactMarkdown>
                </div>
              ))}
            </Section>
        </div>
        <div className="col-span-1 space-y-6">
            <Section title="Skills" show={hasSkills}>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => <span key={i} className="text-[var(--fs-small)] bg-gray-100 px-2 py-1 rounded">{skill}</span>)}
                </div>
            </Section>

            <Section title="Education" show={hasEducation}>
                {education.map(edu => (
                    <div key={edu.id}>
                        <h3 className="text-[var(--fs-h3)] font-bold">{edu.school || 'University Name'}</h3>
                        <p className="font-semibold">{edu.degree || 'Degree'}</p>
                        <p className="text-[var(--fs-small)] text-gray-500">{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                    </div>
                ))}
            </Section>

            <Section title="Certifications" show={hasCertifications}>
                <ul className="text-[var(--fs-small)] space-y-1">
                    {certifications.map(cert => <li key={cert.id}>{cert.name}</li>)}
                </ul>
            </Section>
        </div>
      </main>
    </div>
  );
};
