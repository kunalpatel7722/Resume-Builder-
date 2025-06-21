import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Star, Dribbble, Link as LinkIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';

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

export const GraphicDesignerTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, websites, customSections } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');

  const hasExperience = experience.some(e => e.role || e.company || e.description);
  const hasEducation = education.some(e => e.school || e.degree || e.fieldOfStudy);
  const hasSkills = skills.some(s => s);
  const hasWebsites = websites.some(w => w.url);
  const tools = customSections.filter(s => s.title.toLowerCase().includes('tool'));
  const hasTools = tools.length > 0;

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'yyyy')}`;
    return start;
  };

  const fontClass = fontClasses[fontSize];
  
  const Section: React.FC<{ title: string; children: React.ReactNode; show?: boolean, className?: string }> = ({ title, children, show = true, className }) => {
    if (!show) return null;
    return (
      <section className={className}>
        <h2 className="text-base font-bold uppercase tracking-wider text-white p-2 mb-3" style={{ backgroundColor: accentColor }}>{title}</h2>
        {children}
      </section>
    );
  };
  
  return (
    <div className={cn("bg-white text-gray-800 w-full h-full flex", fontClass)} style={{ fontFamily: "'Raleway', sans-serif" }}>
      <aside className="w-[36%] bg-gray-100 p-6 flex flex-col gap-6">
        {/* Placeholder for Photo */}
        <div className="w-32 h-32 rounded-full mx-auto bg-gray-300" />
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider border-b-2 pb-1 mb-2" style={{borderColor: accentColor}}>Contact</h2>
          <div className="space-y-1.5 text-xs text-gray-700">
            {personalInfo.email && <div className="flex items-center gap-2"><Mail size={14} /><span>{personalInfo.email}</span></div>}
            {personalInfo.phone && <div className="flex items-center gap-2"><Phone size={14} /><span>{personalInfo.phone}</span></div>}
            {personalInfo.city && <div className="flex items-center gap-2"><MapPin size={14} /><span>{personalInfo.city}{personalInfo.state && `, ${personalInfo.state}`}</span></div>}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider border-b-2 pb-1 mb-2" style={{borderColor: accentColor}}>Skills</h2>
          {hasSkills ? (
            <ul className="text-sm space-y-1">
              {skills.map((skill, i) => <li key={i}>{skill}</li>)}
            </ul>
          ) : (
            <p className="text-gray-400 italic text-xs">Your skills will appear here.</p>
          )}
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider border-b-2 pb-1 mb-2" style={{borderColor: accentColor}}>Tools</h2>
          {hasTools ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
              {tools.map(t => t.content).join('\n')}
            </ReactMarkdown>
          ) : (
            <p className="text-gray-400 italic text-xs">Your tools will appear here.</p>
          )}
        </section>
      </aside>

      <main className="w-[64%] p-8 overflow-y-auto">
        <header className="mb-8">
            <h1 className="text-5xl font-extrabold">{fullName || 'Your Name'}</h1>
            <h2 className="text-xl font-light" style={{color: accentColor}}>{hasExperience ? experience[0]?.role : 'Graphic Designer'}</h2>
        </header>

        <div className="space-y-6">
            <Section title="Profile">
              {summary ? (
                <p className="text-gray-700 leading-relaxed">{summary}</p>
              ) : (
                <p className="text-gray-400 italic">Your professional summary will appear here.</p>
              )}
            </Section>

            <Section title="Experience" show={hasExperience}>
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
            
            <Section title="Portfolio" show={hasWebsites}>
               <div className="grid grid-cols-2 gap-4">
                  {websites.map(site => (
                      <a href={site.url} key={site.id} className="text-center p-4 bg-gray-50 rounded hover:bg-gray-100">
                        <Dribbble className="mx-auto mb-2" style={{color: accentColor}}/>
                        <p className="text-sm font-bold hover:underline">{site.label || 'Project Link'}</p>
                      </a>
                  ))}
               </div>
            </Section>

            <Section title="Education" show={hasEducation}>
                {education.map(edu => (
                    <div key={edu.id}>
                        <h3 className="text-base font-bold">{edu.school || 'University Name'}</h3>
                        <p className="text-sm font-semibold">{edu.degree || 'Degree'}</p>
                        <p className="text-xs text-gray-500">{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                    </div>
                ))}
            </Section>
        </div>
      </main>
    </div>
  );
};
