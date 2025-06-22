
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { Mail, Phone, MapPin, Award, Trophy, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TemplateProps {
  data: ResumeData;
  accentColor?: string;
  fontSize?: 'sm' | 'md' | 'lg';
}

export const StellarTemplate: React.FC<TemplateProps> = ({ data, accentColor: accentColorProp, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, websites, certifications, awards, activities, customSections, showReferences } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');

  const palette = { accent: '#0288D1', accentSoft: '#E1F5FE', text: '#263238', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;

  const hasExperience = Array.isArray(experience) && experience.length > 0 && experience.some(e => e.role || e.company || e.description);
  const hasEducation = Array.isArray(education) && education.length > 0 && education.some(e => e.school || e.degree);
  const hasSkills = Array.isArray(skills) && skills.length > 0 && skills.some(s => s);
  const hasWebsites = Array.isArray(websites) && websites.length > 0 && websites.some(w => w.url);
  const hasCerts = Array.isArray(certifications) && certifications.length > 0 && certifications.some(c => c.name);
  const hasAwards = Array.isArray(awards) && awards.length > 0 && awards.some(a => a.name);
  const hasActivities = Array.isArray(activities) && activities.length > 0 && activities.some(a => a);
  const hasCustomSections = Array.isArray(customSections) && customSections.length > 0;

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
    <div className={cn("bg-white text-[var(--fs-body)] w-full h-full flex font-body-lato", fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-base' : '')}>
      <main className="w-[70%] p-8 overflow-y-auto">
        <header className="mb-6">
            <h1 className="text-5xl leading-tight font-extrabold">{fullName || 'Your Name'}</h1>
            <h2 className="text-[var(--fs-h2)] font-semibold" style={{ color: accentColor }}>{experience?.[0]?.role || 'Professional Title'}</h2>
        </header>

        <div className="space-y-6">
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
        </div>
      </main>

      <aside className="w-[30%] p-6 flex flex-col gap-6" style={{ backgroundColor: palette.accentSoft }}>
        {personalInfo.photoUrl && (
          <img src={personalInfo.photoUrl} alt={fullName} className="w-28 h-28 rounded-full object-cover mx-auto mt-2 border-4 border-white shadow-lg" data-ai-hint="person face" />
        )}
        <Section title="Contact">
            <div className="space-y-1.5 text-[var(--fs-small)]" style={{color: palette.text}}>
                {personalInfo.email && <div className="flex items-center gap-2"><Mail size={14}/><span>{personalInfo.email}</span></div>}
                {personalInfo.phone && <div className="flex items-center gap-2"><Phone size={14}/><span>{personalInfo.phone}</span></div>}
                {personalInfo.city && <div className="flex items-center gap-2"><MapPin size={14}/><span>{personalInfo.city}{personalInfo.state && `, ${personalInfo.state}`}</span></div>}
            </div>
        </Section>
        <Section title="Skills" show={hasSkills}>
            <ul className="text-[var(--fs-body)] space-y-1">
              {skills.map((skill, i) => <li key={i}>{skill}</li>)}
            </ul>
        </Section>
        <Section title="Links" show={hasWebsites}>
            <div className="space-y-1">
              {websites.map(site => <a key={site.id} href={site.url} className="text-[var(--fs-small)] block hover:underline truncate" style={{color: accentColor}}>{site.label || site.url}</a>)}
            </div>
        </Section>
        <Section title="Certifications" show={hasCerts}>
            <ul className="text-[var(--fs-small)] list-none p-0 space-y-1">
                {certifications.map(cert => <li key={cert.id} className="flex items-start gap-2"><Award size={14} className="mt-0.5" style={{color: accentColor}}/>{cert.name}</li>)}
            </ul>
        </Section>
        <Section title="Awards" show={hasAwards}>
            <ul className="text-[var(--fs-small)] list-none p-0 space-y-1">
                {awards.map(award => <li key={award.id} className="flex items-start gap-2"><Trophy size={14} className="mt-0.5" style={{color: accentColor}}/>{award.name}</li>)}
            </ul>
        </Section>
        <Section title="Activities" show={hasActivities}>
            <ul className="text-[var(--fs-small)] list-none p-0 space-y-1">
                {activities.map((activity, i) => <li key={i} className="flex items-start gap-2"><Activity size={14} className="mt-0.5" style={{color: accentColor}}/>{activity}</li>)}
            </ul>
        </Section>
        {showReferences && (
            <Section title="References">
                <p className="italic text-sm">Available upon request.</p>
            </Section>
        )}
      </aside>
    </div>
  );
};
