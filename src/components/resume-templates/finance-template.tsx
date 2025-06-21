
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

export const FinanceTemplate: React.FC<TemplateProps> = ({ data, accentColor: accentColorProp, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, certifications, awards } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');
  const KPIs = awards.filter(a => a.name.toLowerCase().includes('kpi') || a.description.match(/(\d+%?)/));

  const palette = { accent: '#0D47A1', accentSoft: '#E3ECF9', text: '#121212', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;

  const hasContent = (arr: any[], ...fields: string[]) => Array.isArray(arr) && arr.some(item => item && fields.some(field => item[field]));

  const hasExperience = hasContent(experience, 'role', 'company', 'description');
  const hasEducation = hasContent(education, 'school', 'degree');
  const hasSkills = skills.length > 0;
  const hasCertifications = hasContent(certifications, 'name');
  const hasKPIs = KPIs.length > 0;

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'MMM yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'MMM yyyy')}`;
    return start;
  };

  const Section: React.FC<{ title: string; children: React.ReactNode; show?: boolean, className?: string }> = ({ title, children, show = true, className }) => {
    if (!show) return null;
    return (
      <section className={className}>
        <h2 className="text-[var(--fs-h2)] font-bold uppercase tracking-wider border-b-2 pb-1 mb-3" style={{ color: accentColor, borderColor: accentColor }}>{title}</h2>
        {children}
      </section>
    );
  };
  
  return (
    <div className={cn("bg-white text-[var(--fs-body)] p-8 w-full h-full font-body", fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-base' : '')}>
      <header className="text-center mb-6">
        <h1 className="text-[var(--fs-name)] font-bold font-serif-merriweather">{fullName || 'Your Name'}</h1>
        <p className="text-[var(--fs-small)] text-gray-600 mt-1">{personalInfo.email} &bull; {personalInfo.phone} &bull; {fullAddress}</p>
      </header>

      <main className="grid grid-cols-3 gap-x-6 gap-y-4">
        <Section title="Summary" className="col-span-3">
          {summary ? (
            <p className="leading-relaxed">{summary}</p>
          ) : <p className="leading-relaxed text-gray-400 italic">Your professional summary will appear here.</p>}
        </Section>
        
        <div className="col-span-2 space-y-4">
          <Section title="Experience">
            <div className="space-y-4">
            {hasExperience ? (
              experience.map(job => (
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
              ))
            ) : <p className="text-gray-400 italic">Your work experience will appear here.</p>}
            </div>
          </Section>
        </div>

        <div className="col-span-1 space-y-4">
          <Section title="KPIs">
            <div className="space-y-2">
              {hasKPIs ? (
                KPIs.map(kpi => (
                  <div key={kpi.id} className="text-center p-2 rounded" style={{backgroundColor: palette.accentSoft}}>
                    <p className="text-2xl font-bold" style={{color: accentColor}}>{kpi.description.match(/(\d+%?)/)?.[0]}</p>
                    <p className="text-xs uppercase font-semibold text-gray-700">{kpi.name.replace('KPI:','')}</p>
                  </div>
                ))
              ) : <p className="text-gray-400 italic text-center text-sm">Your KPIs will appear here.</p>}
            </div>
          </Section>
          
          <Section title="Skills">
            {hasSkills ? (
              <ul className="text-[var(--fs-body)] space-y-1">
                {skills.map((skill, i) => <li key={i}>{skill}</li>)}
              </ul>
            ) : <p className="text-gray-400 italic text-sm">Your skills will appear here.</p>}
          </Section>
          
          <Section title="Education">
              {hasEducation ? (
                education.map(edu => (
                  <div key={edu.id} className="mb-2">
                      <h3 className="text-[var(--fs-h3)] font-bold">{edu.school || 'University Name'}</h3>
                      <p className="text-[var(--fs-body)]">{edu.degree || 'Degree'}</p>
                      <p className="text-[var(--fs-small)] text-gray-500">{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                  </div>
                ))
              ) : <p className="text-gray-400 italic text-sm">Your education details will appear here.</p>}
          </Section>
          
          <Section title="Certifications">
             {hasCertifications ? (
                <ul className="text-[var(--fs-body)] space-y-1 list-disc list-inside">
                  {certifications.map((cert, i) => <li key={i}>{cert.name}</li>)}
                </ul>
             ) : <p className="text-gray-400 italic text-sm">Your certifications will appear here.</p>}
          </Section>
        </div>
      </main>
    </div>
  );
};
