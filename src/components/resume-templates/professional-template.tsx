import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';
import { Briefcase, GraduationCap, PenTool } from 'lucide-react';

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

export const ProfessionalTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, customSections } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');
  const tools = customSections.filter(s => s.title.toLowerCase().includes('tool'));

  const hasExperience = experience.some(e => e.role || e.company || e.description);
  const hasEducation = education.some(e => e.school || e.degree || e.fieldOfStudy);
  const hasSkills = skills.some(s => s);
  const hasTools = tools.length > 0;

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'MMM yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'MMM yyyy')}`;
    return start;
  };
  
  const fontClass = fontClasses[fontSize];

  const Section: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode; show?: boolean }> = ({ title, icon: Icon, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: accentColor }}>
          <Icon size={16} /> {title}
        </h2>
        <div className="space-y-4">{children}</div>
      </section>
    );
  };

  return (
    <div className={cn("bg-white text-gray-800 p-8 w-full h-full", fontClass)} style={{ fontFamily: "'Roboto', sans-serif" }}>
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold" style={{ fontFamily: "'Roboto Slab', serif"}}>{fullName || 'Your Name'}</h1>
        <p className="text-lg text-gray-600 mt-1">{hasExperience ? experience[0]?.role : 'Professional Title'}</p>
        <p className="text-xs text-gray-500 mt-2">{personalInfo.email} &bull; {personalInfo.phone} &bull; {fullAddress}</p>
      </header>

      <main className="space-y-6">
        <section>
          {summary ? (
            <p className="text-gray-700 leading-relaxed text-center">{summary}</p>
          ) : (
            <p className="text-gray-400 italic text-center">Your professional summary will appear here.</p>
          )}
        </section>

        <Section title="Professional Experience" icon={Briefcase} show={hasExperience}>
          {experience.map(job => (
            <div key={job.id} className="relative pl-4">
               <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
               <div className="flex justify-between items-baseline">
                <h3 className="text-base font-bold">{job.role || 'Job Title'}</h3>
                <p className="text-xs text-gray-500 border-t-2 border-dotted flex-grow mx-2" style={{borderColor: '#D0D0D0'}}></p>
                <p className="text-xs text-gray-500">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
              </div>
              <p className="text-sm font-semibold italic">{job.company || 'Company Name'}</p>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
                {job.description || '* Your job description will appear here.'}
              </ReactMarkdown>
            </div>
          ))}
        </Section>
        
        <div className="grid grid-cols-2 gap-8">
            <Section title="Education" icon={GraduationCap} show={hasEducation}>
                {education.map(edu => (
                    <div key={edu.id}>
                        <h3 className="text-base font-bold">{edu.school || 'University Name'}</h3>
                        <p className="text-sm font-semibold">{edu.degree || 'Degree'}</p>
                        <p className="text-xs text-gray-500">{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                    </div>
                ))}
            </Section>

            <Section title="Skills & Tools" icon={PenTool}>
                {hasSkills && (
                    <>
                        <h3 className="font-bold">Core Skills</h3>
                        <p className="text-gray-700">{skills.join(', ')}</p>
                    </>
                )}
                {hasTools && (
                    <>
                        <h3 className="font-bold mt-2">Tools</h3>
                         <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
                           {tools.map(t => t.content).join('\n')}
                        </ReactMarkdown>
                    </>
                )}
                 {!hasSkills && !hasTools && <p className="text-gray-400 italic">Your skills and tools will appear here.</p>}
            </Section>
        </div>
      </main>
    </div>
  );
};
