import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Star, Award, Link as LinkIcon, Trophy } from 'lucide-react';
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

export const CreativeTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, awards, websites } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');

  const hasExperience = experience.some(e => e.role || e.company || e.description);
  const hasEducation = education.some(e => e.school || e.degree || e.fieldOfStudy);
  const hasSkills = skills.some(s => s);
  const hasAwards = awards.some(a => a.name);
  const hasWebsites = websites.some(w => w.url);

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'yyyy')}`;
    return start;
  };

  const fontClass = fontClasses[fontSize];

  const LeftColumnSection: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-white mb-2">{title}</h2>
        {children}
      </section>
    );
  };
  
  const RightColumnSection: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-base font-bold uppercase tracking-wider text-gray-700 border-b-2 border-gray-200 pb-1 mb-3">{title}</h2>
        <div className="space-y-4">{children}</div>
      </section>
    );
  };

  return (
    <div className={cn("bg-white w-full h-full flex", fontClass)} style={{ fontFamily: "'Poppins', sans-serif" }}>
      <aside className="w-[40%] text-white p-6 flex flex-col gap-6" style={{ backgroundColor: accentColor }}>
        <div className="text-center mt-4">
          {/* Placeholder for Photo */}
          <div className="w-24 h-24 rounded-full mx-auto bg-white/30 mb-4" />
          <h1 className="text-3xl font-bold">{fullName || 'Your Name'}</h1>
          <h2 className="text-lg font-light text-white/90">{hasExperience ? experience[0]?.role : 'Professional Title'}</h2>
        </div>

        <LeftColumnSection title="Contact">
          <div className="space-y-1 text-xs">
            {personalInfo.email && <div className="flex items-center gap-2"><Mail size={14} /><p>{personalInfo.email}</p></div>}
            {personalInfo.phone && <div className="flex items-center gap-2"><Phone size={14} /><p>{personalInfo.phone}</p></div>}
            {personalInfo.city && <div className="flex items-center gap-2"><MapPin size={14} /><p>{personalInfo.city}{personalInfo.state && `, ${personalInfo.state}`}</p></div>}
          </div>
        </LeftColumnSection>

        <LeftColumnSection title="Skills" show={hasSkills}>
          <ul className="list-disc list-inside text-sm">
            {skills.map((skill, i) => <li key={i}>{skill}</li>)}
          </ul>
        </LeftColumnSection>

        <LeftColumnSection title="Socials" show={hasWebsites}>
          <div className="space-y-1 text-xs">
            {websites.map(site => <div key={site.id} className="flex items-center gap-2"><LinkIcon size={14} /><a href={site.url} className="hover:underline truncate">{site.label || site.url}</a></div>)}
          </div>
        </LeftColumnSection>

        <LeftColumnSection title="Awards" show={hasAwards}>
          <div className="space-y-2 text-xs">
            {awards.map(award => <p key={award.id}><Trophy size={14} className="inline mr-1.5" />{award.name}</p>)}
          </div>
        </LeftColumnSection>
      </aside>

      <main className="w-[60%] p-8 overflow-y-auto text-gray-800">
        <RightColumnSection title="Summary">
          {summary ? (
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          ) : (
            <p className="text-gray-400 italic">Your professional summary will appear here.</p>
          )}
        </RightColumnSection>

        <RightColumnSection title="Experience" show={hasExperience}>
          {experience.map(job => (
            <div key={job.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="text-base font-bold">{job.role || 'Job Title'}</h3>
                <p className="text-xs text-gray-500 font-medium">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
              </div>
              <p className="text-sm font-semibold italic" style={{ color: accentColor }}>{job.company || 'Company Name'}</p>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
                {job.description || '* Your job description will appear here.'}
              </ReactMarkdown>
            </div>
          ))}
        </RightColumnSection>
        
        <RightColumnSection title="Education" show={hasEducation}>
            {education.map(edu => (
                <div key={edu.id}>
                    <h3 className="text-base font-bold">{edu.school || 'University Name'}</h3>
                    <p className="text-sm font-semibold">{edu.degree || 'Degree'}{edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}</p>
                    <p className="text-xs text-gray-500">{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                </div>
            ))}
        </RightColumnSection>
      </main>
    </div>
  );
};
