
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Star, Code, Award, Globe, Trophy, Activity, Link as LinkIcon, Pencil, Users } from 'lucide-react';
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
  sm: 'text-[10px]',
  md: 'text-xs',
  lg: 'text-sm',
};

export const TechnicalTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
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
    if (!startDate) return 'Dates';
    const start = format(startDate, 'MMM yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'MMM yyyy')}`;
    return start;
  };

  const fontClass = fontClasses[fontSize];

  return (
    <div className={cn("bg-white text-gray-800 w-full h-full font-sans flex", fontClass)}>
        <aside className="w-1/3 bg-gray-900 text-white p-6 flex flex-col space-y-6">
            <section className="text-center">
                <h1 className="text-2xl font-bold tracking-tight">{fullName || 'Your Name'}</h1>
                <h2 className="text-md mt-1 font-mono" style={{ color: accentColor }}>{hasExperience ? experience[0]?.role : 'Your Title'}</h2>
            </section>

            <div className="w-full h-px bg-gray-700" />

            <section>
                 <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">Contact</h3>
                 <div className="space-y-2 text-gray-300">
                    {personalInfo.email && <div className="flex items-center gap-2"><Mail size={14} /><span>{personalInfo.email}</span></div>}
                    {personalInfo.phone && <div className="flex items-center gap-2"><Phone size={14} /><span>{personalInfo.phone}</span></div>}
                    {fullAddress && <div className="flex items-center gap-2"><MapPin size={14} /><span>{fullAddress}</span></div>}
                    {hasWebsites && websites.map(site => (
                        <div key={site.id} className="flex items-center gap-2"><LinkIcon size={14} /><a href={site.url} className="hover:underline" style={{ color: accentColor }}>{site.label || site.url}</a></div>
                    ))}
                </div>
            </section>

            <section>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">Education</h3>
                {hasEducation ? (
                    <div className="space-y-3">
                        {education.map((edu) => {
                          const gradDate = edu.isStillEnrolled 
                            ? 'Enrolled' 
                            : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
                          return (
                            <div key={edu.id}>
                               <h4 className="font-bold text-white">{edu.school || 'School Name'}</h4>
                               <p className="text-gray-300">{edu.degree || 'Degree'}</p>
                               <p className="text-xs text-gray-400">{gradDate || 'Date'}</p>
                            </div>
                          )
                        })}
                    </div>
                ) : (
                    <p className="text-gray-500 italic text-xs">Your education will appear here.</p>
                )}
            </section>

            <section>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">Skills</h3>
                {hasSkills ? (
                    <ul className="flex flex-wrap gap-1.5">
                        {skills.filter(skill => skill).map((skill, index) => (
                            <li key={index} className="text-primary-foreground text-[11px] font-mono px-2 py-0.5 rounded" style={{ backgroundColor: `${accentColor}33` }}>{skill}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 italic text-xs">Your skills will appear here.</p>
                )}
            </section>
            
            {hasActivities && (
                <section>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">Activities</h3>
                    <ul className="space-y-1 text-gray-300">
                        {activities.map((activity, index) => <li key={index}>{activity}</li>)}
                    </ul>
                </section>
            )}

            {hasLanguages && (
                <section>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">Languages</h3>
                    <div className="space-y-2 text-gray-300">
                        {languages.map(lang => (
                             <p key={lang.id}>{lang.name} ({lang.level})</p>
                        ))}
                    </div>
                </section>
            )}
        </aside>

        <main className="w-2/3 p-8">
            <section className="mb-6">
              <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2 pb-1 border-b-2 border-gray-200 mb-3">Profile</h2>
              {summary ? (
                <p className="text-gray-600 leading-relaxed">{summary}</p>
              ) : (
                <p className="text-gray-400 italic text-sm">Your summary will appear here.</p>
              )}
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2 pb-1 border-b-2 border-gray-200 mb-3"><Briefcase size={18}/>Experience</h2>
              {hasExperience ? (
                <div className="space-y-4">
                  {experience.map((job) => {
                    const location = [job.city, job.state].filter(Boolean).join(', ');
                    return (
                      <div key={job.id}>
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-base font-bold text-gray-900">{job.role || 'Job Title'}</h3>
                          <p className="text-xs text-gray-500 font-medium">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">{job.company || 'Company Name'}{location && ` - ${location}`}</p>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-600 prose-code:font-mono">
                            {job.description || '* Your job description will appear here.'}
                        </ReactMarkdown>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-400 italic text-sm">Your experience will appear here.</p>
              )}
            </section>

            {hasAwards && (
              <section className="mb-6">
                <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2 pb-1 border-b-2 border-gray-200 mb-3"><Trophy size={18}/>Awards</h2>
                <div className="space-y-4">
                  {awards.map((award) => (
                    <div key={award.id}>
                      <h3 className="text-base font-bold text-gray-900">{award.name || 'Award Name'} - <span className="font-normal text-sm text-gray-500">{award.date || 'Date'}</span></h3>
                      <p className="text-gray-600">{award.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {hasCertifications && (
              <section className="mb-6">
                <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2 pb-1 border-b-2 border-gray-200 mb-3"><Award size={18}/>Certifications</h2>
                <div className="space-y-4">
                  {certifications.map((cert) => (
                    <div key={cert.id}>
                      <h3 className="text-base font-bold text-gray-900">{cert.name || 'Certification Name'}</h3>
                      <p className="text-sm font-semibold text-gray-700">{cert.issuer || 'Issuing Body'} - {cert.date || 'Date'}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {hasCustomSections && customSections.map(section => (
                <section key={section.id} className="mb-6">
                    <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2 pb-1 border-b-2 border-gray-200 mb-3"><Pencil size={18}/>{section.title}</h2>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-600">
                        {section.content}
                    </ReactMarkdown>
                </section>
            ))}

            {showReferences && (
                <section>
                    <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2 pb-1 border-b-2 border-gray-200 mb-3"><Users size={18}/>References</h2>
                    <p className="text-gray-600">Available upon request.</p>
                </section>
            )}
        </main>
    </div>
  );
};
