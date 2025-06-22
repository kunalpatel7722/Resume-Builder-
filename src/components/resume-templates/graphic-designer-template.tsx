
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { Mail, Phone, MapPin, Dribbble, Trophy, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TemplateProps {
  data: ResumeData;
  accentColor?: string;
  fontSize?: 'sm' | 'md' | 'lg';
}

export const GraphicDesignerTemplate: React.FC<TemplateProps> = ({ data, accentColor: accentColorProp, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, websites, customSections, awards, activities, showReferences } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const tools = Array.isArray(customSections) ? customSections.filter(s => s.title.toLowerCase().includes('tool')) : [];
  const otherCustomSections = Array.isArray(customSections) ? customSections.filter(s => !s.title.toLowerCase().includes('tool')) : [];
  
  const palette = { accent: '#FF3366', text: '#191919', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;

  const hasExperience = Array.isArray(experience) && experience.length > 0 && experience.some(e => e.role || e.company || e.description);
  const hasEducation = Array.isArray(education) && education.length > 0 && education.some(e => e.school || e.degree);
  const hasSkills = Array.isArray(skills) && skills.length > 0 && skills.some(s => s);
  const hasWebsites = Array.isArray(websites) && websites.length > 0 && websites.some(w => w.url);
  const hasTools = Array.isArray(tools) && tools.length > 0 && tools.some(p => p.content);
  const hasAwards = Array.isArray(awards) && awards.length > 0 && awards.some(a => a.name);
  const hasActivities = Array.isArray(activities) && activities.length > 0 && activities.some(a => a);
  const hasOtherCustomSections = Array.isArray(otherCustomSections) && otherCustomSections.length > 0;

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'yyyy')}`;
    return start;
  };

  const SidebarSection: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-[var(--fs-h2)] font-bold uppercase tracking-wider border-b-2 pb-1 mb-2" style={{borderColor: accentColor}}>{title}</h2>
        {children}
      </section>
    );
  };
  
  const MainSection: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-[var(--fs-h2)] font-bold uppercase tracking-wider text-white p-2 mb-3" style={{ backgroundColor: accentColor }}>{title}</h2>
        {children}
      </section>
    );
  };
  
  return (
    <div className={cn("bg-white text-[var(--fs-body)] w-full h-full flex font-body-raleway text-black", fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-base' : '')}>
      <aside className="w-[36%] bg-gray-100 p-6 flex flex-col gap-6">
        <div className="w-32 h-32 rounded-full mx-auto bg-gray-300 shadow-md flex items-center justify-center">
            {personalInfo.photoUrl ? (
                <img src={personalInfo.photoUrl} alt={fullName} className="rounded-full w-full h-full object-cover" data-ai-hint="person face" />
            ) : (
                <span className="text-5xl font-bold text-gray-500">{personalInfo.firstName?.[0] || 'A'}{personalInfo.lastName?.[0] || 'A'}</span>
            )}
        </div>
        <SidebarSection title="Contact">
          <div className="space-y-1.5 text-[var(--fs-small)] text-gray-700">
            {personalInfo.email && <div className="flex items-center gap-2"><Mail size={14} style={{color: accentColor}} /><span>{personalInfo.email}</span></div>}
            {personalInfo.phone && <div className="flex items-center gap-2"><Phone size={14} style={{color: accentColor}} /><span>{personalInfo.phone}</span></div>}
            {personalInfo.city && <div className="flex items-center gap-2"><MapPin size={14} style={{color: accentColor}} /><span>{personalInfo.city}{personalInfo.state && `, ${personalInfo.state}`}</span></div>}
          </div>
        </SidebarSection>

        <SidebarSection title="Skills" show={hasSkills}>
            <ul className="text-[var(--fs-body)] space-y-1 list-disc list-inside">
              {skills.map((skill, i) => <li key={i}>{skill}</li>)}
            </ul>
        </SidebarSection>

        <SidebarSection title="Tools" show={hasTools}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
              {tools.map(t => t.content).join('\n') || '* List your design tools here (e.g., Adobe Creative Suite, Figma, Sketch).'}
            </ReactMarkdown>
        </SidebarSection>
        <SidebarSection title="Awards" show={hasAwards}>
            <ul className="text-[var(--fs-small)] list-none p-0 space-y-1">
              {awards.map(award => <li key={award.id} className="flex items-start gap-2"><Trophy size={14} className="mt-0.5" style={{color: accentColor}}/>{award.name}</li>)}
            </ul>
        </SidebarSection>
         <SidebarSection title="Activities" show={hasActivities}>
            <ul className="text-[var(--fs-small)] list-none p-0 space-y-1">
              {activities.map((activity, i) => <li key={i} className="flex items-start gap-2"><Activity size={14} className="mt-0.5" style={{color: accentColor}}/>{activity}</li>)}
            </ul>
        </SidebarSection>
      </aside>

      <main className="w-[64%] p-8 overflow-y-auto">
        <header className="mb-8">
            <h1 className="text-5xl font-extrabold" style={{backgroundColor: accentColor, color: 'white', padding: '0.25rem 0.75rem', display: 'inline'}}>{fullName || 'Your Name'}</h1>
            <h2 className="text-xl font-light mt-2" style={{color: palette.text}}>{experience?.[0]?.role || 'Graphic Designer'}</h2>
        </header>

        <div className="space-y-6">
            <MainSection title="Profile">
                <p className="leading-relaxed">{summary || "Your professional summary will appear here. Describe your design philosophy and key strengths."}</p>
            </MainSection>

            <MainSection title="Experience" show={hasExperience}>
              <div className="space-y-4">
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
              </div>
            </MainSection>
            
            <MainSection title="Portfolio" show={hasWebsites}>
                <div className="grid grid-cols-2 gap-4">
                    {websites.map(site => (
                        <a href={site.url} key={site.id} className="text-center p-4 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                          <Dribbble className="mx-auto mb-2" style={{color: accentColor}}/>
                          <p className="text-[var(--fs-small)] font-bold hover:underline">{site.label || 'Project Link'}</p>
                        </a>
                    ))}
                </div>
            </MainSection>

            <MainSection title="Education" show={hasEducation}>
                {education.map(edu => (
                      <div key={edu.id}>
                          <h3 className="text-[var(--fs-h3)] font-bold">{edu.school || 'University Name'}</h3>
                          <p className="font-semibold">{edu.degree || 'Degree'}</p>
                          <p className="text-[var(--fs-small)] text-gray-500">{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                      </div>
                  ))}
            </MainSection>

            {hasOtherCustomSections && otherCustomSections.map(section => (
                <MainSection key={section.id} title={section.title}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                        {section.content || ''}
                    </ReactMarkdown>
                </MainSection>
            ))}

            {showReferences && (
                <MainSection title="References">
                    <p className="italic text-sm">References available upon request.</p>
                </MainSection>
            )}
        </div>
      </main>
    </div>
  );
};
