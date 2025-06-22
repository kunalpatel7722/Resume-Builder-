
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

export const CascadeTemplate: React.FC<TemplateProps> = ({ data, accentColor: accentColorProp, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, websites } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');

  const palette = { accent: '#6A1B9A', accentSoft: '#F3E5F5', text: '#212121', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;

  const hasContent = (arr: any[] | undefined, ...fields: string[]) => {
    if (!Array.isArray(arr) || arr.length === 0) return false;
    return arr.some(item => item && fields.some(field => item[field]));
  };

  const hasExperience = hasContent(experience, 'role', 'company', 'description');
  const hasEducation = hasContent(education, 'school', 'degree');
  const hasSkills = Array.isArray(skills) && skills.length > 0;
  const hasWebsites = hasContent(websites, 'url');

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'yyyy')}`;
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
    <div className={cn("bg-white text-[var(--fs-body)] w-full h-full font-body-lato flex", fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-base' : '')}>
      <aside className="w-[35%] p-6 flex flex-col gap-6" style={{ backgroundColor: palette.accentSoft }}>
        {personalInfo.photoUrl && (
          <img src={personalInfo.photoUrl} alt={fullName} className="w-32 h-32 rounded-full object-cover mx-auto -mt-2 border-4 border-white shadow-lg" data-ai-hint="person face" />
        )}
        <div className="space-y-1.5 text-center text-[var(--fs-small)]" style={{color: palette.text}}>
          {personalInfo.email && <div className="flex items-center justify-center gap-2"><Mail size={14} style={{color: accentColor}} /><span>{personalInfo.email}</span></div>}
          {personalInfo.phone && <div className="flex items-center justify-center gap-2"><Phone size={14} style={{color: accentColor}} /><span>{personalInfo.phone}</span></div>}
          {personalInfo.city && <div className="flex items-center justify-center gap-2"><MapPin size={14} style={{color: accentColor}} /><span>{personalInfo.city}{personalInfo.state && `, ${personalInfo.state}`}</span></div>}
        </div>
        
        <Section title="Skills" show={hasSkills}>
            <ul className="text-[var(--fs-body)] space-y-1 list-disc list-inside">
              {skills.map((skill, i) => <li key={i}>{skill}</li>)}
            </ul>
        </Section>
        
        <Section title="Links" show={hasWebsites}>
            <div className="space-y-1">
              {websites.map(site => <a key={site.id} href={site.url} className="text-[var(--fs-small)] block hover:underline truncate" style={{color: accentColor}}>{site.label || site.url}</a>)}
            </div>
        </Section>
      </aside>
      <main className="w-[65%] p-8 overflow-y-auto">
        <header className="mb-6">
            <h1 className="text-[2.5rem] leading-tight font-bold" style={{color: accentColor}}>{fullName || 'Your Name'}</h1>
            <h2 className="text-[var(--fs-h2)] font-semibold text-gray-700">{experience?.[0]?.role || 'Professional Title'}</h2>
        </header>

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
        
        <Section title="Education" show={hasEducation}>
            {education.map(edu => (
                <div key={edu.id}>
                    <h3 className="text-[var(--fs-h3)] font-bold">{edu.school || 'University Name'}</h3>
                    <p className="font-semibold">{edu.degree || 'Degree'}</p>
                    <p className="text-[var(--fs-small)] text-gray-500">{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                </div>
            ))}
        </Section>
      </main>
    </div>
  );
};
