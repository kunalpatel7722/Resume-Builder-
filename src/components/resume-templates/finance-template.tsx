import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';
import { TrendingUp, DollarSign } from 'lucide-react';

export interface TemplateProps {
  data: ResumeData;
  accentColor: string;
  fontSize: 'sm' | 'md' | 'lg';
}

const fontClasses = {
  sm: 'text-[9.5pt]',
  md: 'text-[10.5pt]',
  lg: 'text-[11.5pt]',
};

export const FinanceTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, certifications, awards } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');

  const hasExperience = experience.some(e => e.role || e.company || e.description);
  const hasEducation = education.some(e => e.school || e.degree || e.fieldOfStudy);
  const hasSkills = skills.some(s => s);
  const hasCertifications = certifications.some(c => c.name);
  const hasAwards = awards.some(a => a.name);
  const KPIs = awards.filter(a => a.name.toLowerCase().includes('kpi') || a.description.match(/(\d+%?)/));
  const hasKPIs = KPIs.length > 0;

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'MMM yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'MMM yyyy')}`;
    return start;
  };

  const fontClass = fontClasses[fontSize];

  const Section: React.FC<{ title: string; children: React.ReactNode; show?: boolean, className?: string }> = ({ title, children, show = true, className }) => {
    if (!show) return null;
    return (
      <section className={className}>
        <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 pb-1 mb-3" style={{ color: accentColor, borderColor: accentColor }}>{title}</h2>
        {children}
      </section>
    );
  };
  
  return (
    <div className={cn("bg-white text-gray-800 p-8 w-full h-full", fontClass)} style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "'Merriweather', serif"}}>{fullName || 'Your Name'}</h1>
        <p className="text-base text-gray-600 mt-1">{personalInfo.email} &bull; {personalInfo.phone} &bull; {fullAddress}</p>
      </header>

      <main className="grid grid-cols-3 gap-x-6 gap-y-4">
        <Section title="Summary" className="col-span-3">
          {summary ? (
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          ) : (
            <p className="text-gray-400 italic">Your professional summary will appear here.</p>
          )}
        </Section>
        
        <div className="col-span-2 space-y-4">
          <Section title="Experience" show={hasExperience}>
            <div className="space-y-4">
            {experience.map(job => (
              <div key={job.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-base font-bold">{job.role || 'Job Title'}</h3>
                  <p className="text-xs text-gray-500 font-medium">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                </div>
                <p className="text-sm font-semibold italic">{job.company || 'Company Name'}</p>
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
                  {job.description || '* Your job description will appear here.'}
                </ReactMarkdown>
              </div>
            ))}
            </div>
          </Section>
        </div>

        <div className="col-span-1 space-y-4">
          <Section title="Key Performance Indicators" show={hasKPIs}>
            <div className="space-y-2">
              {KPIs.map(kpi => (
                <div key={kpi.id} className="text-center bg-gray-50 p-2 rounded">
                  <p className="text-2xl font-bold" style={{color: accentColor}}>{kpi.description.match(/(\d+%?)/)?.[0]}</p>
                  <p className="text-xs uppercase font-semibold">{kpi.name.replace('KPI:','')}</p>
                </div>
              ))}
            </div>
          </Section>
          
          <Section title="Skills" show={hasSkills}>
            <ul className="text-sm space-y-1">
              {skills.map((skill, i) => <li key={i}>{skill}</li>)}
            </ul>
          </Section>
          
          <Section title="Education" show={hasEducation}>
              {education.map(edu => (
                  <div key={edu.id}>
                      <h3 className="text-sm font-bold">{edu.school || 'University Name'}</h3>
                      <p className="text-xs">{edu.degree || 'Degree'}</p>
                      <p className="text-xs text-gray-500">{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                  </div>
              ))}
          </Section>
          
          <Section title="Certifications" show={hasCertifications}>
             <ul className="text-sm space-y-1">
              {certifications.map((cert, i) => <li key={i}>{cert.name}</li>)}
            </ul>
          </Section>
        </div>
      </main>
    </div>
  );
};
