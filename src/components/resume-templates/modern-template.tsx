import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Star, Award, Link as LinkIcon, Pencil, Users, Languages, Trophy, Activity, Code } from 'lucide-react';
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

export const ModernTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, languages, certifications, activities, awards, websites, customSections, showReferences } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');

  const hasExperience = experience.some(e => e.role || e.company || e.description);
  const hasEducation = education.some(e => e.school || e.degree || e.fieldOfStudy);
  const hasSkills = skills.some(s => s);
  const hasLanguages = languages.some(l => l.name);
  const hasCertifications = certifications.some(c => c.name);
  const hasActivities = activities.some(a => a);
  const hasAwards = awards.some(a => a.name);
  const hasWebsites = websites.some(w => w.url);
  const hasCustomSections = customSections.some(c => c.title || c.content);

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'MMM yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'MMM yyyy')}`;
    return start;
  };
  
  const fontClass = fontClasses[fontSize];

  const MainSection: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-lg font-bold uppercase tracking-wider border-b-2 pb-1 mb-3" style={{ borderColor: accentColor }}>{title}</h2>
        {children}
      </section>
    );
  };
  
  const SidebarSection: React.FC<{ title: string; children: React.ReactNode; show?: boolean, icon: React.ElementType }> = ({ title, children, show = true, icon: Icon }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><Icon size={16} />{title}</h2>
        {children}
      </section>
    );
  };
  
  return (
    <div className={cn("bg-white w-full h-full flex font-sans", fontClass)} style={{'--accent-color': accentColor} as React.CSSProperties}>
      <aside className="w-[18rem] bg-gray-50 p-6 flex flex-col gap-6">
        <header className="text-left">
          <h1 className="text-3xl font-extrabold text-gray-800">{fullName || 'Your Name'}</h1>
          <h2 className="text-lg text-gray-600 mt-1" style={{ color: accentColor }}>{hasExperience ? experience[0]?.role : 'Professional Title'}</h2>
        </header>

        <SidebarSection title="Contact" icon={Users}>
          <div className="space-y-1 text-xs text-gray-700">
             {personalInfo.email && <p className="flex items-start gap-2"><Mail size={14} className="text-gray-500 mt-0.5"/> <span>{personalInfo.email}</span></p>}
             {personalInfo.phone && <p className="flex items-start gap-2"><Phone size={14} className="text-gray-500 mt-0.5"/> <span>{personalInfo.phone}</span></p>}
             {fullAddress && <p className="flex items-start gap-2"><MapPin size={14} className="text-gray-500 mt-0.5"/> <span>{fullAddress}</span></p>}
             {websites.map(site => <p key={site.id} className="flex items-start gap-2 truncate"><LinkIcon size={14} className="text-gray-500 mt-0.5"/> <a href={site.url} className="hover:underline">{site.label || site.url}</a></p>)}
          </div>
        </SidebarSection>

        <SidebarSection title="Skills" icon={Star} show={hasSkills}>
          <ul className="flex flex-wrap gap-1.5">
            {skills.map((skill, i) => <li key={i} className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded">{skill}</li>)}
          </ul>
        </SidebarSection>

        <SidebarSection title="Certifications" icon={Award} show={hasCertifications}>
          <div className="space-y-2 text-xs">
            {certifications.map(cert => (
              <div key={cert.id}>
                <p className="font-semibold text-gray-800">{cert.name}</p>
                <p className="text-gray-600">{cert.issuer}, {cert.date}</p>
              </div>
            ))}
          </div>
        </SidebarSection>
        
        <SidebarSection title="Languages" icon={Languages} show={hasLanguages}>
           <div className="space-y-1 text-xs">
            {languages.map(lang => (
              <p key={lang.id} className="text-gray-700">{lang.name}: <span className="text-gray-500">{lang.level}</span></p>
            ))}
          </div>
        </SidebarSection>

      </aside>
      
      <div className="w-[4px]" style={{backgroundColor: accentColor}}></div>

      <main className="flex-1 p-8 overflow-y-auto space-y-6">
        <MainSection title="Summary">
          {summary ? (
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          ) : (
             <p className="text-gray-400 italic">Your professional summary will appear here.</p>
          )}
        </MainSection>
        
        <MainSection title="Experience" show={hasExperience}>
            <div className="space-y-5">
              {experience.map(job => (
                <div key={job.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-base font-bold text-gray-800">{job.role || 'Job Title'}</h3>
                    <p className="text-xs text-gray-500">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                  </div>
                  <p className="text-sm font-semibold italic text-gray-600">{job.company || 'Company Name'}</p>
                   <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-600 mt-1">
                    {job.description || '* Your job description will appear here.'}
                  </ReactMarkdown>
                </div>
              ))}
            </div>
        </MainSection>
        
        <MainSection title="Education" show={hasEducation}>
          <div className="space-y-3">
          {education.map(edu => (
             <div key={edu.id}>
               <div className="flex justify-between items-baseline">
                <h3 className="text-base font-bold text-gray-800">{edu.school || 'School Name'}</h3>
                <p className="text-xs text-gray-500">{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
               </div>
               <p className="text-sm italic text-gray-600">{edu.degree || 'Degree'}</p>
             </div>
          ))}
          </div>
        </MainSection>
        
        <MainSection title="Awards" show={hasAwards}>
          <ul className="list-disc list-inside text-gray-700">
            {awards.map(award => (
              <li key={award.id}><span className="font-semibold">{award.name}</span>, {award.date}</li>
            ))}
          </ul>
        </MainSection>

        {customSections.map(section => (
          <MainSection key={section.id} title={section.title || 'Custom Section'}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-600">
                {section.content || 'Your custom section content will appear here.'}
            </ReactMarkdown>
          </MainSection>
        ))}
      </main>
    </div>
  );
};
