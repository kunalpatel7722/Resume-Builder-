
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { Mail, Phone, MapPin, Github, Award, Trophy, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TemplateProps {
  data: ResumeData;
  accentColor?: string;
  fontSize?: 'sm' | 'md' | 'lg';
}

export const SoftwareEngineerTemplate: React.FC<TemplateProps> = ({ data, accentColor: accentColorProp, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, websites, customSections, awards, activities, certifications, showReferences } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const projects = Array.isArray(customSections) ? customSections.filter(s => s.title.toLowerCase().includes('project')) : [];
  const otherCustomSections = Array.isArray(customSections) ? customSections.filter(s => !s.title.toLowerCase().includes('project')) : [];
  
  const palette = { accent: '#4E44CE', accentSoft: '#ECECFF', text: '#1A1A1A', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;

  const hasExperience = Array.isArray(experience) && experience.length > 0 && experience.some(e => e.role || e.company || e.description);
  const hasEducation = Array.isArray(education) && education.length > 0 && education.some(e => e.school || e.degree);
  const hasSkills = Array.isArray(skills) && skills.length > 0;
  const hasProjects = Array.isArray(projects) && projects.length > 0 && projects.some(p => p.content);
  const githubLink = Array.isArray(websites) ? websites.find(w => w.label.toLowerCase().includes('github')) : null;
  const otherWebsites = Array.isArray(websites) ? websites.filter(w => !w.label.toLowerCase().includes('github')) : [];
  const hasOtherWebsites = otherWebsites.length > 0;
  const hasAwards = Array.isArray(awards) && awards.length > 0 && awards.some(a => a.name);
  const hasActivities = Array.isArray(activities) && activities.length > 0 && activities.some(a => a);
  const hasCerts = Array.isArray(certifications) && certifications.length > 0 && certifications.some(c => c.name);
  const hasOtherCustomSections = Array.isArray(otherCustomSections) && otherCustomSections.length > 0;

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'yyyy');
    if (isCurrent) return `present`;
    if (endDate) return `${start}-${format(endDate, 'yyyy')}`;
    return start;
  };

  const Section: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-[var(--fs-h2)] font-bold uppercase tracking-wider text-gray-700 mb-2 font-code-fira">{title}</h2>
        <div className="space-y-4">{children}</div>
      </section>
    );
  };
  
  return (
    <div className={cn("bg-white text-[var(--fs-body)] w-full h-full flex font-body-inter", fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-base' : '')}>
      <aside className="w-[35%] p-6 flex flex-col gap-6" style={{backgroundColor: palette.accentSoft}}>
        <header>
            <h1 className="text-[var(--fs-name)] font-bold">{fullName || 'Your Name'}</h1>
            <h2 className="text-[var(--fs-h3)]" style={{ color: accentColor }}>{experience?.[0]?.role || 'Software Engineer'}</h2>
        </header>
        
        <section>
          <div className="space-y-1.5 text-[var(--fs-small)] text-gray-700">
            {personalInfo.email && <p className="flex items-center gap-2"><Mail size={14}/> {personalInfo.email}</p>}
            {personalInfo.phone && <p className="flex items-center gap-2"><Phone size={14}/> {personalInfo.phone}</p>}
            {personalInfo.city && <p className="flex items-center gap-2"><MapPin size={14}/> {personalInfo.city}{personalInfo.state && `, ${personalInfo.state}`}</p>}
            {githubLink && <a href={githubLink.url} className="flex items-center gap-2 hover:underline"><Github size={14}/> {githubLink.url.replace('https://', '')}</a>}
            {hasOtherWebsites && otherWebsites.map(site => <a key={site.id} href={site.url} className="flex items-center gap-2 hover:underline">{site.label || site.url}</a>)}
          </div>
        </section>

        <section>
          <h2 className="text-[var(--fs-h3)] font-bold uppercase tracking-wider mb-2 font-code-fira">Tech Stack</h2>
          {hasSkills ? (
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, i) => <span key={i} className="text-[var(--fs-small)] font-code-fira bg-white px-2 py-0.5 rounded shadow-sm">{skill}</span>)}
            </div>
          ) : (
            <p className="text-gray-400 italic text-[var(--fs-small)]">Your tech stack will appear here.</p>
          )}
        </section>

        <Section title="Awards" show={hasAwards}>
          <ul className="list-disc list-inside text-sm">
            {awards.map(award => <li key={award.id}>{award.name}</li>)}
          </ul>
        </Section>
        
        <Section title="Certifications" show={hasCerts}>
           <ul className="list-disc list-inside text-sm">
            {certifications.map(cert => <li key={cert.id}>{cert.name}</li>)}
          </ul>
        </Section>

      </aside>

      <main className="w-[65%] p-8 overflow-y-auto">
        <Section title="Summary">
            <p className="leading-relaxed">{summary || "Your professional summary will appear here. Briefly introduce your technical background and career goals."}</p>
        </Section>
        
        <Section title="Projects" show={hasProjects}>
          {projects.map(p => (
              <div key={p.id}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                  {p.content || "* Describe your key projects, including the tech stack used and a link to the repository."}
                </ReactMarkdown>
              </div>
            ))}
        </Section>

        <Section title="Experience" show={hasExperience}>
          {experience.map(job => (
              <div key={job.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[var(--fs-h3)] font-bold">{job.role || 'Job Title'}</h3>
                  <p className="text-[var(--fs-small)] text-gray-500 font-code-fira">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
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

        <Section title="Activities" show={hasActivities}>
          <ul className="list-disc list-inside text-sm">
            {activities.map((activity, i) => <li key={i}>{activity}</li>)}
          </ul>
        </Section>

        {hasOtherCustomSections && otherCustomSections.map(section => (
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
