
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { Mail, Phone, MapPin, Award, Activity, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TemplateProps {
  data: ResumeData;
  accentColor?: string;
  fontSize?: 'sm' | 'md' | 'lg';
}

export const CascadeTemplate: React.FC<TemplateProps> = ({ data, accentColor: accentColorProp, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, websites, awards, certifications, activities, customSections, showReferences } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');

  const palette = { accent: '#6A1B9A', accentSoft: '#F3E5F5', text: '#212121', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;

  const hasContent = (arr: any[] | undefined) => Array.isArray(arr) && arr.length > 0;
  
  const hasExperience = hasContent(experience) && experience.some(e => e.role || e.company || e.description);
  const hasEducation = hasContent(education) && education.some(e => e.school || e.degree);
  const hasSkills = hasContent(skills) && skills.some(s => s);
  const hasWebsites = hasContent(websites) && websites.some(w => w.url);
  const hasAwards = hasContent(awards) && awards.some(a => a.name);
  const hasCerts = hasContent(certifications) && certifications.some(c => c.name);
  const hasActivities = hasContent(activities) && activities.some(a => a);
  const hasCustomSections = hasContent(customSections) && customSections.some(s => s.title && s.content);

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'yyyy')}`;
    return start;
  };

  const Section: React.FC<{ title: string; children: React.ReactNode; show?: boolean, icon?: React.ElementType }> = ({ title, children, show = true, icon: Icon }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-[var(--fs-h2)] font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: accentColor }}>
          {Icon && <Icon size={18}/>}
          {title}
        </h2>
        <div className="space-y-4">{children}</div>
      </section>
    );
  };

  return (
    <div className={cn("bg-white text-[var(--fs-body)] w-full h-full flex font-body-lato", fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-base' : '')}>
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

        <Section title="Awards" show={hasAwards}>
            <ul className="text-[var(--fs-small)] list-none p-0 space-y-1">
                {awards.map(award => <li key={award.id} className="flex items-start gap-2"><Trophy size={14} className="mt-0.5" style={{color: accentColor}}/>{award.name}</li>)}
            </ul>
        </Section>
        
        <Section title="Certifications" show={hasCerts}>
            <ul className="text-[var(--fs-small)] list-none p-0 space-y-1">
                {certifications.map(cert => <li key={cert.id} className="flex items-start gap-2"><Award size={14} className="mt-0.5" style={{color: accentColor}}/>{cert.name}</li>)}
            </ul>
        </Section>

        <Section title="Activities" show={hasActivities}>
            <ul className="text-[var(--fs-small)] list-none p-0 space-y-1">
                {activities.map((activity, i) => <li key={i} className="flex items-start gap-2"><Activity size={14} className="mt-0.5" style={{color: accentColor}}/>{activity}</li>)}
            </ul>
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

        {hasCustomSections && customSections.map(section => (
            <Section key={section.id} title={section.title}>
                 <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                    {section.content || ''}
                </ReactMarkdown>
            </Section>
        ))}

        {showReferences && (
            <div className="text-center italic text-sm text-gray-500 pt-4">
                <p>References available upon request.</p>
            </div>
        )}
      </main>
    </div>
  );
};
