
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { CheckCircle, Terminal, Award, Trophy, Activity, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TemplateProps {
  data: ResumeData;
  accentColor?: string;
  fontSize?: 'sm' | 'md' | 'lg';
}

export const ItProfessionalTemplate: React.FC<TemplateProps> = ({ data, accentColor: accentColorProp, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, certifications, customSections, awards, websites, activities, showReferences } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const projects = Array.isArray(customSections) ? customSections.filter(s => s.title.toLowerCase().includes('project')) : [];
  const otherCustomSections = Array.isArray(customSections) ? customSections.filter(s => !s.title.toLowerCase().includes('project')) : [];
  
  const palette = { accent: '#512DA8', accentSoft: '#EFE7FF', text: '#141414', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;

  const hasExperience = Array.isArray(experience) && experience.length > 0 && experience.some(e => e.role || e.company || e.description);
  const hasEducation = Array.isArray(education) && education.length > 0 && education.some(e => e.school || e.degree);
  const hasSkills = Array.isArray(skills) && skills.length > 0;
  const hasCertifications = Array.isArray(certifications) && certifications.length > 0 && certifications.some(c => c.name);
  const hasProjects = Array.isArray(projects) && projects.length > 0 && projects.some(p => p.content);
  const hasAwards = Array.isArray(awards) && awards.length > 0 && awards.some(a => a.name);
  const hasWebsites = Array.isArray(websites) && websites.length > 0 && websites.some(w => w.url);
  const hasActivities = Array.isArray(activities) && activities.length > 0 && activities.some(a => a);
  const hasOtherCustomSections = Array.isArray(otherCustomSections) && otherCustomSections.length > 0;

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'yyyy-MM');
    if (isCurrent) return `${start} - current`;
    if (endDate) return `${start} - ${format(endDate, 'yyyy-MM')}`;
    return start;
  };
  
  const Section: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-[var(--fs-h2)] font-bold text-white p-1 mb-2 font-display-ibm-plex-sans" style={{ backgroundColor: accentColor }}>$ {title}</h2>
        <div className="pl-2">{children}</div>
      </section>
    );
  };
  
  return (
    <div className={cn("bg-white text-[var(--fs-body)] p-8 w-full h-full font-body-ibm-plex-sans", fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-base' : '')}>
        <header className="mb-6 grid grid-cols-5 gap-4">
            <div className="col-span-3">
              <h1 className="text-[var(--fs-name)] font-bold text-black">{fullName || 'Your Name'}</h1>
              <p className="text-[var(--fs-h3)]" style={{ color: accentColor }}>{experience?.[0]?.role || 'IT Professional'}</p>
            </div>
            <div className="col-span-2 text-right text-[var(--fs-small)] text-gray-600">
              <p>{personalInfo.email}</p>
              <p>{personalInfo.phone}</p>
              <p>{personalInfo.city}{personalInfo.state && `, ${personalInfo.state}`}</p>
            </div>
        </header>

        <main className="grid grid-cols-5 gap-x-6 gap-y-4">
            <div className="col-span-3 space-y-4">
                <Section title="summary.txt">
                  <p className="leading-relaxed">{summary || "# Your summary will appear here. Focus on your technical expertise and problem-solving abilities."}</p>
                </Section>
                <Section title="experience.log" show={hasExperience}>
                  <div className="space-y-4">
                  {experience.map(job => (
                      <div key={job.id}>
                        <p className="text-[var(--fs-h3)] font-bold text-black">{job.role || 'Job Title'} @ {job.company || 'Company'}</p>
                        <p className="text-[var(--fs-small)]" style={{ color: accentColor }}>{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                          {job.description || '# Your job description will appear here.'}
                        </ReactMarkdown>
                      </div>
                    ))}
                  </div>
                </Section>
                <Section title="projects.sh" show={hasProjects}>
                  <div className="space-y-3">
                    {projects.map(p => (
                         <ReactMarkdown key={p.id} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                          {p.content || '# Your projects will appear here.'}
                        </ReactMarkdown>
                      ))}
                  </div>
                </Section>
                {hasOtherCustomSections && otherCustomSections.map(section => (
                    <Section key={section.id} title={section.title}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                            {section.content || ''}
                        </ReactMarkdown>
                    </Section>
                ))}
            </div>
            <div className="col-span-2 space-y-4">
                <Section title="certifications/" show={hasCertifications}>
                    <ul className="text-[var(--fs-small)] space-y-1">
                        {certifications.map(cert => (
                          <li key={cert.id} className="flex items-center gap-2"><CheckCircle size={14} style={{color: accentColor}} />{cert.name}</li>
                        ))}
                    </ul>
                </Section>
                <Section title="skills/" show={hasSkills}>
                    <ul className="text-[var(--fs-small)] space-y-1">
                        {skills.map((skill, i) => <li key={i} className="flex items-center gap-2"><Terminal size={14} style={{color: accentColor}} />{skill}</li>)}
                    </ul>
                </Section>
                <Section title="education/" show={hasEducation}>
                   {education.map(edu => (
                        <div key={edu.id} className="mb-2">
                            <p className="text-[var(--fs-h3)] font-bold text-black">{edu.school || 'University'}</p>
                            <p className="text-[var(--fs-body)]">{edu.degree || 'Degree'}</p>
                            <p className="text-[var(--fs-small)]" style={{ color: accentColor }}>{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                        </div>
                    ))}
                </Section>
                <Section title="awards/" show={hasAwards}>
                    <ul className="text-[var(--fs-small)] space-y-1">
                        {awards.map(award => <li key={award.id} className="flex items-center gap-2"><Trophy size={14} style={{color: accentColor}} />{award.name}</li>)}
                    </ul>
                </Section>
                <Section title="activities/" show={hasActivities}>
                    <ul className="text-[var(--fs-small)] space-y-1">
                        {activities.map((activity, i) => <li key={i} className="flex items-center gap-2"><Activity size={14} style={{color: accentColor}} />{activity}</li>)}
                    </ul>
                </Section>
                <Section title="links/" show={hasWebsites}>
                    <ul className="text-[var(--fs-small)] space-y-1">
                        {websites.map(site => <li key={site.id}><a href={site.url} className="flex items-center gap-2 hover:underline"><LinkIcon size={14} style={{color: accentColor}}/>{site.label || site.url}</a></li>)}
                    </ul>
                </Section>
            </div>
        </main>
        {showReferences && (
            <div className="col-span-5 text-center italic text-sm text-gray-500 pt-4">
                <p># References available upon request</p>
            </div>
        )}
    </div>
  );
};
