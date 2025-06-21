
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { Mail, Phone, MapPin, Target, Briefcase, Award, GraduationCap, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TemplateProps {
  data: ResumeData;
  accentColor?: string;
  fontSize?: 'sm' | 'md' | 'lg';
}

export const SalesTemplate: React.FC<TemplateProps> = ({ data, accentColor: accentColorProp, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, certifications, awards } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const KPIs = awards.filter(a => a.name.toLowerCase().includes('kpi') || a.description.match(/(\d+%?)/));

  const palette = { accent: '#C62828', accentSoft: '#FFE9E9', text: '#222222', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;

  const hasContent = (arr: any[], ...fields: string[]) => Array.isArray(arr) && arr.some(item => item && fields.some(field => item[field]));

  const hasExperience = hasContent(experience, 'role', 'company', 'description');
  const hasEducation = hasContent(education, 'school', 'degree');
  const hasSkills = skills.length > 0;
  const hasCertifications = hasContent(certifications, 'name');
  const hasKPIs = KPIs.length > 0;

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'yyyy')}`;
    return start;
  };

  const Section: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode; show?: boolean }> = ({ title, icon: Icon, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-[var(--fs-h2)] font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: accentColor }}><Icon size={18}/>{title}</h2>
        <div className="space-y-4">{children}</div>
      </section>
    );
  };
  
  return (
    <div className={cn("bg-white text-[var(--fs-body)] w-full h-full flex font-body-mulish", fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-base' : '')}>
      <main className="w-[73%] p-8 overflow-y-auto space-y-6">
        <header>
            <h1 className="text-[var(--fs-name)] font-extrabold pb-1 border-b-2" style={{borderColor: accentColor}}>{fullName || 'Your Name'}</h1>
            <h2 className="text-[var(--fs-h2)] font-semibold" style={{color: accentColor}}>{experience[0]?.role || 'Sales Professional'}</h2>
        </header>

        <Section title="Summary" icon={Target}>
          {summary ? (
            <p className="leading-relaxed">{summary}</p>
          ) : <p className="leading-relaxed text-gray-400 italic">Your professional summary will appear here.</p>}
        </Section>
        
        <Section title="Experience" icon={Briefcase}>
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
        </Section>
      </main>

      <aside className="w-[27%] p-6 flex flex-col gap-6" style={{ backgroundColor: palette.accentSoft }}>
        <section>
          <div className="space-y-1.5 text-[var(--fs-small)]">
            {personalInfo.email && <p className="flex items-center gap-2"><Mail size={14} /><span>{personalInfo.email}</span></p>}
            {personalInfo.phone && <p className="flex items-center gap-2"><Phone size={14} /><span>{personalInfo.phone}</span></p>}
            {personalInfo.city && <p className="flex items-center gap-2"><MapPin size={14} /><span>{personalInfo.city}{personalInfo.state && `, ${personalInfo.state}`}</span></p>}
          </div>
        </section>

        <Section title="KPIs" icon={Trophy}>
            <div className="space-y-2">
              {hasKPIs ? (
                KPIs.map(kpi => (
                  <div key={kpi.id} className="text-center bg-white p-2 rounded shadow">
                    <p className="text-xl font-bold" style={{color: accentColor}}>{kpi.description.match(/(\d+%?)/)?.[0]}</p>
                    <p className="text-[10px] uppercase font-semibold">{kpi.name.replace('KPI:','')}</p>
                  </div>
                ))
              ) : <p className="text-gray-400 italic text-center text-sm">Your KPIs will appear here.</p>}
            </div>
        </Section>
        
        <Section title="Skills" icon={Award}>
          {hasSkills ? (
            <ul className="text-[var(--fs-body)] space-y-1 list-disc list-inside">
              {skills.map((skill, i) => <li key={i}>{skill}</li>)}
            </ul>
          ) : <p className="text-gray-400 italic text-sm">Your skills will appear here.</p>}
        </Section>
        
        <Section title="Education" icon={GraduationCap}>
            {hasEducation ? (
              education.map(edu => (
                  <div key={edu.id}>
                      <h3 className="text-[var(--fs-h3)] font-bold">{edu.school || 'University Name'}</h3>
                      <p className="text-[var(--fs-small)]">{edu.degree || 'Degree'}</p>
                  </div>
              ))
            ) : <p className="text-gray-400 italic text-sm">Your education details will appear here.</p>}
        </Section>

        <Section title="Certifications" icon={Award}>
           {hasCertifications ? (
              <div className="space-y-2 text-[var(--fs-small)]">
                {certifications.map(cert => (
                  <p key={cert.id} className="font-bold">{cert.name}</p>
                ))}
              </div>
           ) : <p className="text-gray-400 italic text-sm">Your certifications will appear here.</p>}
        </Section>
      </aside>
    </div>
  );
};
