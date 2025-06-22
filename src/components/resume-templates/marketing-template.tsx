import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { Mail, Phone, MapPin, Link as LinkIcon, Star, PenTool, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TemplateProps {
  data: ResumeData;
  accentColor?: string;
  fontSize?: 'sm' | 'md' | 'lg';
}

export const MarketingTemplate: React.FC<TemplateProps> = ({ data, accentColor: accentColorProp, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, websites, customSections, projects } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const tools = Array.isArray(customSections) ? customSections.filter(s => s.title.toLowerCase().includes('tool')) : [];
  const testimonials = Array.isArray(customSections) ? customSections.filter(s => s.title.toLowerCase().includes('testimonial')) : [];

  const palette = { accent: '#FF4F81', accentSoft: '#FFE6EF', text: '#1A1A1A', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;

  const hasContent = (arr: any[] | undefined, ...fields: string[]) => {
    if (!Array.isArray(arr)) return false;
    return arr.some(item => item && fields.some(field => item[field]));
  };

  const hasExperience = hasContent(experience, 'role', 'company', 'description');
  const hasEducation = hasContent(education, 'school', 'degree');
  const hasSkills = Array.isArray(skills) && skills.length > 0;
  const hasWebsites = hasContent(websites, 'url');
  const hasTools = hasContent(tools, 'content');
  const hasTestimonials = hasContent(testimonials, 'content');
  const hasProjects = hasContent(projects, 'content');
  
  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'MMM yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'MMM yyyy')}`;
    return start;
  };

  const LeftColumnSection: React.FC<{ title: string; children: React.ReactNode; show?: boolean, icon: React.ElementType }> = ({ title, children, show = true, icon: Icon }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-[var(--fs-h2)] font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{color: accentColor}}><Icon size={18} />{title}</h2>
        {children}
      </section>
    );
  };

  const RightColumnSection: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-[var(--fs-h2)] font-bold border-b-2 pb-1 mb-2" style={{borderColor: palette.accentSoft}}>{title}</h2>
        <div className="space-y-4">{children}</div>
      </section>
    );
  };
  
  return (
    <div className={cn("bg-white text-[var(--fs-body)] w-full h-full flex font-body-montserrat", fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-base' : '')}>
      <main className="w-[62%] p-8 overflow-y-auto">
        <header className="mb-6">
            <h1 className="text-[var(--fs-name)] font-extrabold" style={{color: accentColor}}>{fullName || 'Your Name'}</h1>
            <h2 className="text-[var(--fs-h2)] font-semibold text-gray-700">{experience?.[0]?.role || 'Marketing Professional'}</h2>
             <div className="text-[var(--fs-small)] text-gray-600 mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                {personalInfo.email && <div className="flex items-center gap-1.5"><Mail size={12} /><span>{personalInfo.email}</span></div>}
                {personalInfo.phone && <div className="flex items-center gap-1.5"><Phone size={12} /><span>{personalInfo.phone}</span></div>}
                {personalInfo.city && <div className="flex items-center gap-1.5"><MapPin size={12} /><span>{personalInfo.city}{personalInfo.state && `, ${personalInfo.state}`}</span></div>}
                {hasWebsites && websites.map(site => <div key={site.id} className="flex items-center gap-1.5"><LinkIcon size={12} /><a href={site.url} className="hover:underline">{site.label || site.url}</a></div>)}
            </div>
        </header>

        <div className="space-y-6">
            <RightColumnSection title="Summary">
                <p className="leading-relaxed">{summary || "Your professional summary will appear here. Highlight your marketing achievements and strategic mindset."}</p>
            </RightColumnSection>
            <RightColumnSection title="Experience" show={hasExperience}>
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
            </RightColumnSection>
             <RightColumnSection title="Projects" show={hasProjects}>
              {projects.map(p => (
                  <ReactMarkdown key={p.id} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                    {p.content || '* Details about your key projects.'}
                  </ReactMarkdown>
                ))}
            </RightColumnSection>
            <RightColumnSection title="Education" show={hasEducation}>
                 {education.map(edu => (
                      <div key={edu.id}>
                          <h3 className="text-[var(--fs-h3)] font-bold">{edu.school || 'School Name'}</h3>
                          <p className="font-semibold">{edu.degree || 'Degree'}</p>
                          <p className="text-[var(--fs-small)] text-gray-500">{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                      </div>
                  ))}
            </RightColumnSection>
        </div>
      </main>

      <aside className="w-[38%] p-6 flex flex-col gap-6" style={{ backgroundColor: palette.accentSoft}}>
        <LeftColumnSection title="Skills" icon={Star} show={hasSkills}>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => <span key={i} className="text-[var(--fs-small)] bg-white border px-2 py-0.5 rounded-full">{skill}</span>)}
            </div>
        </LeftColumnSection>
        
        <LeftColumnSection title="Tools" icon={PenTool} show={hasTools}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                {tools.map(t => t.content).join('\n') || '* List your marketing tools here (e.g., Google Analytics, HubSpot, SEMrush).'}
              </ReactMarkdown>
        </LeftColumnSection>

        <LeftColumnSection title="Testimonials" icon={MessageSquare} show={hasTestimonials}>
          <div className="space-y-3">
             {testimonials.map(section => (
                  <blockquote key={section.id} className="border-l-4 p-2 text-[var(--fs-small)] italic" style={{borderColor: accentColor, backgroundColor: 'white'}}>
                      {section.content || '"Your testimonial content will appear here."'}
                  </blockquote>
              ))}
          </div>
        </LeftColumnSection>
      </aside>
    </div>
  );
};
