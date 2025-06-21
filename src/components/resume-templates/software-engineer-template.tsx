
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Star, Code, Github, Linkedin, Globe, Award, Trophy, Activity, Link as LinkIcon, Pencil, Users } from 'lucide-react';
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

export const SoftwareEngineerTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, languages, certifications, activities, awards, websites, customSections, showReferences } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');

  const hasExperience = experience.some(e => e.role || e.company || e.description);
  const hasEducation = education.some(e => e.school || e.degree || e.fieldOfStudy);
  const hasSkills = skills.some(s => s);
  const hasLanguages = languages.some(l => l.name);
  const hasCertifications = certifications.some(c => c.name);
  const hasAwards = awards.some(a => a.name);
  const hasWebsites = websites.some(w => w.url);
  const hasCustomSections = customSections.some(c => c.title || c.content);

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return 'Dates';
    const start = format(startDate, 'MMM yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'MMM yyyy')}`;
    return start;
  };

  const fontClass = fontClasses[fontSize];

  return (
    <div className={cn("bg-white text-gray-800 p-8 w-full h-full font-sans", fontClass)}>
      <header className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-4xl font-bold text-gray-900">{fullName || 'Your Name'}</h1>
            <h2 className="text-lg font-mono" style={{ color: accentColor }}>{hasExperience ? experience[0]?.role : 'Software Engineer'}</h2>
        </div>
        <div className="text-xs text-right space-y-1">
            <p className="flex items-center justify-end gap-2"><Mail size={14}/> {personalInfo.email}</p>
            <p className="flex items-center justify-end gap-2"><Phone size={14}/> {personalInfo.phone}</p>
            {fullAddress && <p className="flex items-center justify-end gap-2"><MapPin size={14}/> {fullAddress}</p>}
            {hasWebsites && websites.map(site => (
                <p key={site.id} className="flex items-center justify-end gap-2"><LinkIcon size={14}/> <a href={site.url} style={{ color: accentColor }}>{site.label || site.url}</a></p>
            ))}
        </div>
      </header>
      
      <main className="space-y-6">
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Skills</h3>
          {hasSkills ? (
            <div className="flex flex-wrap gap-x-4 gap-y-1">
                {skills.filter(skill => skill).map((skill, index) => (
                    <span key={index} className="text-sm text-gray-700 font-mono">{skill}</span>
                ))}
            </div>
          ) : (
            <p className="text-gray-400 italic text-sm">Your skills will appear here.</p>
          )}
        </section>
        
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 mt-4">Experience</h3>
          {hasExperience ? (
            <div className="space-y-5">
              {experience.map((job) => {
                const location = [job.city, job.state].filter(Boolean).join(', ');
                return (
                  <div key={job.id} className="grid grid-cols-4 gap-4">
                    <div className="col-span-1 text-xs text-gray-600">
                      <p className="font-semibold">{job.company || 'Company Name'}{location && ` - ${location}`}</p>
                      <p>{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                    </div>
                    <div className="col-span-3">
                      <h4 className="font-bold text-md text-gray-800">{job.role || 'Job Title'}</h4>
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
                          {job.description || '* Your job description will appear here.'}
                      </ReactMarkdown>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
             <p className="text-gray-400 italic text-sm">Your experience will appear here.</p>
          )}
        </section>

        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 mt-4">Education</h3>
          {hasEducation ? (
            <div className="space-y-2">
              {education.map((edu) => {
                const gradDate = edu.isStillEnrolled 
                  ? 'Enrolled' 
                  : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
                return (
                  <div key={edu.id} className="grid grid-cols-4 gap-4">
                      <div className="col-span-1 text-xs text-gray-600">
                           <p className="font-semibold">{edu.school || 'University'}</p>
                           <p>{gradDate || 'Date'}</p>
                      </div>
                      <div className="col-span-3">
                         <p className="font-semibold text-md text-gray-800">{edu.degree || 'Degree'}</p>
                      </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-400 italic text-sm">Your education will appear here.</p>
          )}
        </section>
        
        {hasAwards && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 mt-4">Awards</h3>
            <div className="space-y-2">
                {awards.map((award) => (
                    <div key={award.id} className="grid grid-cols-4 gap-4">
                        <div className="col-span-1 text-xs text-gray-600">
                            <p className="font-semibold">{award.date || 'Date'}</p>
                        </div>
                        <div className="col-span-3">
                            <p className="font-semibold text-md text-gray-800">{award.name || 'Award'}</p>
                            <p className="text-sm text-gray-700">{award.description}</p>
                        </div>
                    </div>
                ))}
            </div>
          </section>
        )}

        {hasCertifications && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 mt-4">Certifications</h3>
            <div className="space-y-2">
                {certifications.map((cert) => (
                    <div key={cert.id} className="grid grid-cols-4 gap-4">
                        <div className="col-span-1 text-xs text-gray-600">
                            <p className="font-semibold">{cert.issuer || 'Issuer'}</p>
                            <p>{cert.date || 'Date'}</p>
                        </div>
                        <div className="col-span-3">
                            <p className="font-semibold text-md text-gray-800">{cert.name || 'Certification'}</p>
                        </div>
                    </div>
                ))}
            </div>
          </section>
        )}

        {hasCustomSections && customSections.map(section => (
          <section key={section.id}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 mt-4">{section.title}</h3>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
                {section.content}
            </ReactMarkdown>
          </section>
        ))}

        {hasLanguages && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Languages</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
                {languages.map((lang) => (
                    <span key={lang.id} className="text-sm text-gray-700 font-mono">{lang.name} ({lang.level})</span>
                ))}
            </div>
          </section>
        )}

        {showReferences && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">References</h3>
            <p className="text-sm text-gray-700">Available upon request.</p>
          </section>
        )}
      </main>
    </div>
  );
};
