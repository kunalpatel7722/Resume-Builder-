import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Star, Award, Trophy, Languages } from 'lucide-react';
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

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, languages, certifications, awards } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');

  const hasExperience = experience.some(e => e.role || e.company || e.description);
  const hasEducation = education.some(e => e.school || e.degree || e.fieldOfStudy);
  const hasSkills = skills.some(s => s);
  const hasLanguages = languages.some(l => l.name);
  const hasCertifications = certifications.some(c => c.name);
  const hasAwards = awards.some(a => a.name);

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'MMM yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'MMM yyyy')}`;
    return start;
  };

  const fontClass = fontClasses[fontSize];

  const MainSection: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-sm font-bold uppercase tracking-[.2em] mb-2 border-b-2 pb-1" style={{ borderColor: accentColor }}>{title}</h2>
        <div className="space-y-4">{children}</div>
      </section>
    );
  };
  
  const SidebarSection: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-sm font-bold uppercase tracking-[.2em] mb-2">{title}</h2>
        {children}
      </section>
    );
  };

  return (
    <div className={cn("bg-white text-gray-800 w-full h-full flex", fontClass)} style={{ fontFamily: "'Libre Baskerville', serif" }}>
      <main className="w-[72%] p-8 overflow-y-auto">
        <header className="mb-6 text-center">
            <h1 className="text-4xl font-bold">{fullName || 'Your Name'}</h1>
            <h2 className="text-lg text-gray-600 mt-1">{hasExperience ? experience[0]?.role : 'Executive Title'}</h2>
        </header>

        <div className="text-center text-xs text-gray-600 mb-6 flex justify-center gap-4">
            <span>{personalInfo.phone}</span>
            <span>{personalInfo.email}</span>
            <span>{personalInfo.city}{personalInfo.state && `, ${personalInfo.state}`}</span>
        </div>

        <div className="space-y-5">
            <MainSection title="Executive Summary">
              {summary ? (
                <p className="text-gray-700 leading-relaxed">{summary}</p>
              ) : (
                <p className="text-gray-400 italic">Your executive summary will appear here.</p>
              )}
            </MainSection>

            <MainSection title="Professional Experience" show={hasExperience}>
              {experience.map(job => (
                <div key={job.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-base font-bold">{job.role || 'Job Title'}</h3>
                    <p className="text-xs text-gray-500 font-medium">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                  </div>
                  <p className="text-sm font-bold italic" style={{ color: accentColor }}>{job.company || 'Company Name'}</p>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
                    {job.description || '* Your job description will appear here.'}
                  </ReactMarkdown>
                </div>
              ))}
            </MainSection>

            <MainSection title="Education" show={hasEducation}>
                {education.map(edu => (
                    <div key={edu.id}>
                        <h3 className="text-base font-bold">{edu.school || 'University Name'}</h3>
                        <p className="text-sm font-semibold">{edu.degree || 'Degree'}{edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}</p>
                        <p className="text-xs text-gray-500">{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
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
        </div>
      </main>

      <aside className="w-[28%] p-6 flex flex-col gap-6" style={{ backgroundColor: `${accentColor}15` }}>
        <SidebarSection title="Core Competencies" show={hasSkills}>
          <ul className="text-sm space-y-1">
            {skills.map((skill, i) => <li key={i}>{skill}</li>)}
          </ul>
        </SidebarSection>
        
        <SidebarSection title="Certifications" show={hasCertifications}>
          <div className="space-y-3 text-sm">
            {certifications.map(cert => (
              <div key={cert.id}>
                <p className="font-bold">{cert.name}</p>
                <p className="text-xs">{cert.issuer}, {cert.date}</p>
              </div>
            ))}
          </div>
        </SidebarSection>
        
        <SidebarSection title="Languages" show={hasLanguages}>
          <ul className="text-sm space-y-1">
            {languages.map(lang => (
              <li key={lang.id}>{lang.name} ({lang.level})</li>
            ))}
          </ul>
        </SidebarSection>
      </aside>
    </div>
  );
};
