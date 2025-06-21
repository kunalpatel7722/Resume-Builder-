import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';
import { Mail, Phone, MapPin, Target, Briefcase, Award, GraduationCap, Trophy } from 'lucide-react';

export interface TemplateProps {
  data: ResumeData;
  accentColor: string;
  fontSize: 'sm' | 'md' | 'lg';
}

const fontClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export const SalesTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, certifications, awards } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const KPIs = awards.filter(a => a.name.toLowerCase().includes('kpi') || a.description.match(/(\d+%?)/));

  const hasExperience = experience.some(e => e.role || e.company || e.description);
  const hasEducation = education.some(e => e.school || e.degree || e.fieldOfStudy);
  const hasSkills = skills.some(s => s);
  const hasCertifications = certifications.some(c => c.name);
  const hasKPIs = KPIs.length > 0;

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'yyyy')}`;
    return start;
  };

  const fontClass = fontClasses[fontSize];
  
  const Section: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode; show?: boolean }> = ({ title, icon: Icon, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-base font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: accentColor }}><Icon size={18}/>{title}</h2>
        {children}
      </section>
    );
  };
  
  return (
    <div className={cn("bg-white text-gray-800 w-full h-full flex", fontClass)} style={{ fontFamily: "'Mulish', sans-serif" }}>
      <main className="w-[73%] p-8 overflow-y-auto space-y-6">
        <header>
            <h1 className="text-4xl font-extrabold">{fullName || 'Your Name'}</h1>
            <h2 className="text-lg font-semibold" style={{color: accentColor}}>{hasExperience ? experience[0]?.role : 'Sales Professional'}</h2>
        </header>

        <Section title="Summary" icon={Target}>
          {summary ? (
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          ) : (
            <p className="text-gray-400 italic">Your professional summary will appear here.</p>
          )}
        </Section>
        
        <Section title="Experience" icon={Briefcase} show={hasExperience}>
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
      </main>

      <aside className="w-[27%] p-6 flex flex-col gap-6" style={{ backgroundColor: `${accentColor}10` }}>
        <section>
          <div className="space-y-1.5 text-xs text-gray-700">
            {personalInfo.email && <p className="flex items-center gap-2"><Mail size={14} /><span>{personalInfo.email}</span></p>}
            {personalInfo.phone && <p className="flex items-center gap-2"><Phone size={14} /><span>{personalInfo.phone}</span></p>}
            {personalInfo.city && <p className="flex items-center gap-2"><MapPin size={14} /><span>{personalInfo.city}{personalInfo.state && `, ${personalInfo.state}`}</span></p>}
          </div>
        </section>

        <Section title="KPIs" icon={Trophy} show={hasKPIs}>
            <div className="space-y-2">
              {KPIs.map(kpi => (
                <div key={kpi.id} className="text-center bg-white p-2 rounded shadow">
                  <p className="text-xl font-bold" style={{color: accentColor}}>{kpi.description.match(/(\d+%?)/)?.[0]}</p>
                  <p className="text-[10px] uppercase font-semibold">{kpi.name.replace('KPI:','')}</p>
                </div>
              ))}
            </div>
        </Section>
        
        <Section title="Skills" icon={Star} show={hasSkills}>
          <ul className="text-sm space-y-1">
            {skills.map((skill, i) => <li key={i}>{skill}</li>)}
          </ul>
        </Section>
        
        <Section title="Education" icon={GraduationCap} show={hasEducation}>
            {education.map(edu => (
                <div key={edu.id}>
                    <h3 className="text-sm font-bold">{edu.school || 'University Name'}</h3>
                    <p className="text-xs">{edu.degree || 'Degree'}</p>
                    <p className="text-xs text-gray-500">{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                </div>
            ))}
        </Section>

        <Section title="Certifications" icon={Award} show={hasCertifications}>
           <div className="space-y-2">
            {certifications.map(cert => (
              <div key={cert.id} className="text-xs">
                <p className="font-bold">{cert.name}</p>
              </div>
            ))}
          </div>
        </Section>
      </aside>
    </div>
  );
};
