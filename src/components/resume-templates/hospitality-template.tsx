
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { Star, Languages, Award, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TemplateProps {
  data: ResumeData;
  accentColor?: string;
  fontSize?: 'sm' | 'md' | 'lg';
}

export const HospitalityTemplate: React.FC<TemplateProps> = ({ data, accentColor: accentColorProp, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, languages, certifications, awards } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');

  const palette = { accent: '#FFA000', accentSoft: '#FFF4E0', text: '#1B1B1B', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;

  const hasContent = (arr: any[], ...fields: string[]) => Array.isArray(arr) && arr.some(item => item && fields.some(field => item[field]));

  const hasExperience = hasContent(experience, 'role', 'company', 'description');
  const hasEducation = hasContent(education, 'school', 'degree');
  const hasSkills = skills.length > 0;
  const hasLanguages = hasContent(languages, 'name');
  const hasCertifications = hasContent(certifications, 'name');
  const hasAwards = hasContent(awards, 'name');

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'MMM yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'MMM yyyy')}`;
    return start;
  };

  const MainSection: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-[var(--fs-h2)] font-bold uppercase tracking-wider border-b-2 pb-1 mb-3" style={{ borderColor: accentColor }}>{title}</h2>
        <div className="space-y-4">{children}</div>
      </section>
    );
  };
  
  const SidebarSection: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-[var(--fs-h3)] font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>{title}</h2>
        {children}
      </section>
    );
  };
  
  return (
    <div className={cn("bg-white text-[var(--fs-body)] w-full h-full flex font-body-quicksand", fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-base' : '')}>
      <aside className="w-[30%] bg-gray-50 p-6 flex flex-col gap-6">
        <header className="text-center">
            <h1 className="text-[var(--fs-name)] font-bold">{fullName || 'Your Name'}</h1>
            <h2 className="text-[var(--fs-h3)] text-gray-600 mt-1">{experience[0]?.role || 'Hospitality Professional'}</h2>
        </header>

        <div className="text-center text-[var(--fs-small)] text-gray-600 space-y-1">
            <p>{personalInfo.phone}</p>
            <p>{personalInfo.email}</p>
            <p>{personalInfo.city}{personalInfo.state && `, ${personalInfo.state}`}</p>
        </div>

        <SidebarSection title="Skills">
          {hasSkills ? (
            <ul className="text-[var(--fs-body)] space-y-1">
              {skills.map((skill, i) => (
                <li key={i} className="flex items-center">
                  <Star size={12} className="mr-2" style={{color: accentColor}}/> {skill}
                </li>
              ))}
            </ul>
          ) : <p className="text-gray-400 italic text-sm">Your skills will appear here.</p>}
        </SidebarSection>
        
        <SidebarSection title="Languages">
          {hasLanguages ? (
            <ul className="text-[var(--fs-body)] space-y-1">
              {languages.map(lang => (
                <li key={lang.id} className="flex items-center">
                  <Languages size={12} className="mr-2" style={{color: accentColor}}/> {lang.name} ({lang.level})
                </li>
              ))}
            </ul>
          ) : <p className="text-gray-400 italic text-sm">Your languages will appear here.</p>}
        </SidebarSection>

        <SidebarSection title="Certifications">
          {hasCertifications ? (
            <div className="space-y-3 text-[var(--fs-body)]">
              {certifications.map(cert => (
                <div key={cert.id}>
                  <p className="font-bold flex items-center"><Award size={12} className="mr-2" style={{color: accentColor}}/>{cert.name}</p>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-400 italic text-sm">Your certifications will appear here.</p>}
        </SidebarSection>
      </aside>

      <main className="w-[70%] p-8 overflow-y-auto">
        <MainSection title="Summary">
            {summary ? (
              <p className="leading-relaxed">{summary}</p>
            ) : <p className="leading-relaxed text-gray-400 italic">Your professional summary will appear here.</p>}
        </MainSection>

        <MainSection title="Experience">
          {hasExperience ? (
            experience.map(job => (
              <div key={job.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[var(--fs-h3)] font-bold">{job.role || 'Job Title'}</h3>
                  <p className="text-[var(--fs-small)] text-gray-500 font-medium">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                </div>
                <p className="font-semibold italic">{job.company || 'Hotel / Company'}</p>
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                  {job.description || '* Your job description will appear here.'}
                </ReactMarkdown>
              </div>
            ))
          ) : <p className="text-gray-400 italic">Your work experience will appear here.</p>}
        </MainSection>
        
        <MainSection title="Education">
            {hasEducation ? (
              education.map(edu => (
                  <div key={edu.id}>
                      <h3 className="text-[var(--fs-h3)] font-bold">{edu.school || 'University Name'}</h3>
                      <p className="font-semibold">{edu.degree || 'Degree'}</p>
                      <p className="text-[var(--fs-small)] text-gray-500">{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                  </div>
              ))
            ) : <p className="text-gray-400 italic">Your education details will appear here.</p>}
        </MainSection>
        
        <MainSection title="Awards">
          {hasAwards ? (
            awards.map(award => (
              <p key={award.id} className="flex items-center"><Trophy size={14} className="mr-2" style={{color: accentColor}}/> <span className="font-bold">{award.name}</span>, {award.date}</p>
            ))
          ) : <p className="text-gray-400 italic">Your awards will appear here.</p>}
        </MainSection>
      </main>
    </div>
  );
};
