import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';
import { Mail, Phone, MapPin, Link as LinkIcon, Star, Tool, MessageSquare } from 'lucide-react';

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

export const MarketingTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, websites, customSections } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const tools = customSections.filter(s => s.title.toLowerCase().includes('tool'));
  const testimonials = customSections.filter(s => s.title.toLowerCase().includes('testimonial'));

  const hasExperience = experience.some(e => e.role || e.company || e.description);
  const hasEducation = education.some(e => e.school || e.degree || e.fieldOfStudy);
  const hasSkills = skills.some(s => s);
  const hasWebsites = websites.some(w => w.url);
  const hasTools = tools.length > 0;
  const hasTestimonials = testimonials.length > 0;
  
  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'MMM yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'MMM yyyy')}`;
    return start;
  };

  const fontClass = fontClasses[fontSize];

  const LeftColumnSection: React.FC<{ title: string; children: React.ReactNode; show?: boolean, icon: React.ElementType }> = ({ title, children, show = true, icon: Icon }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-base font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><Icon size={16} />{title}</h2>
        {children}
      </section>
    );
  };
  
  return (
    <div className={cn("bg-white text-gray-800 w-full h-full flex", fontClass)} style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <main className="w-[62%] p-8 overflow-y-auto">
        <header className="mb-6">
            <h1 className="text-5xl font-extrabold" style={{color: accentColor}}>{fullName || 'Your Name'}</h1>
            <h2 className="text-xl font-semibold text-gray-700">{hasExperience ? experience[0]?.role : 'Marketing Professional'}</h2>
             <div className="text-xs text-gray-600 mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                {personalInfo.email && <div className="flex items-center gap-1.5"><Mail size={12} /><span>{personalInfo.email}</span></div>}
                {personalInfo.phone && <div className="flex items-center gap-1.5"><Phone size={12} /><span>{personalInfo.phone}</span></div>}
                {personalInfo.city && <div className="flex items-center gap-1.5"><MapPin size={12} /><span>{personalInfo.city}{personalInfo.state && `, ${personalInfo.state}`}</span></div>}
                {hasWebsites && websites.map(site => <div key={site.id} className="flex items-center gap-1.5"><LinkIcon size={12} /><a href={site.url} className="hover:underline">{site.label || site.url}</a></div>)}
            </div>
        </header>

        <div className="space-y-6">
            <section>
                <h2 className="text-lg font-bold border-b-2 border-gray-100 pb-1 mb-2">Summary</h2>
                {summary ? (
                    <p className="text-gray-700 leading-relaxed">{summary}</p>
                ) : (
                    <p className="text-gray-400 italic">Your professional summary will appear here.</p>
                )}
            </section>
            <section>
                <h2 className="text-lg font-bold border-b-2 border-gray-100 pb-1 mb-2">Experience</h2>
                <div className="space-y-4">
                {hasExperience ? (
                    experience.map(job => (
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
                    ))
                ) : (
                    <p className="text-gray-400 italic">Your experience will appear here.</p>
                )}
                </div>
            </section>
            <section>
                 <h2 className="text-lg font-bold border-b-2 border-gray-100 pb-1 mb-2">Education</h2>
                 {hasEducation ? (
                    education.map(edu => (
                        <div key={edu.id}>
                            <h3 className="text-base font-bold">{edu.school || 'University Name'}</h3>
                            <p className="text-sm font-semibold">{edu.degree || 'Degree'}</p>
                            <p className="text-xs text-gray-500">{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                        </div>
                    ))
                 ) : (
                    <p className="text-gray-400 italic">Your education will appear here.</p>
                 )}
            </section>
        </div>
      </main>

      <aside className="w-[38%] p-6 flex flex-col gap-6" style={{ backgroundColor: `${accentColor}10`}}>
        <LeftColumnSection title="Skills" icon={Star} show={hasSkills}>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => <span key={i} className="text-sm bg-white border px-2 py-0.5 rounded-full">{skill}</span>)}
          </div>
        </LeftColumnSection>
        
        <LeftColumnSection title="Tools" icon={Tool} show={hasTools}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
              {tools.map(t => t.content).join('\n')}
            </ReactMarkdown>
        </LeftColumnSection>

        <LeftColumnSection title="Testimonials" icon={MessageSquare} show={hasTestimonials}>
          <div className="space-y-3">
             {testimonials.map(section => (
                <blockquote key={section.id} className="border-l-4 border-white p-2 text-sm italic">
                    {section.content || '"Your testimonial content will appear here."'}
                </blockquote>
            ))}
          </div>
        </LeftColumnSection>
      </aside>
    </div>
  );
};
