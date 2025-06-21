
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Star, Megaphone, LineChart, Award, Globe, Trophy, Activity, Link as LinkIcon, Pencil, Users } from 'lucide-react';
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

export const MarketingTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
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
        <aside className="w-1/3 p-6 flex flex-col justify-between" style={{ backgroundColor: `${accentColor}0D`}}>
            <div>
                <header className="text-left mb-8">
                    <h1 className="text-3xl font-bold" style={{ color: accentColor }}>{fullName || 'Your Name'}</h1>
                    <h2 className="text-lg text-gray-700">{hasExperience ? experience[0]?.role : 'Marketing Specialist'}</h2>
                </header>

                <section className="mb-6">
                    <h3 className="text-md font-semibold uppercase tracking-wider mb-3 flex items-center gap-2"><Star size={16} /> Core Competencies</h3>
                    {hasSkills ? (
                        <ul className="flex flex-wrap gap-1.5">
                            {skills.filter(skill => skill).map((skill, index) => (
                                <li key={index} className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: `${accentColor}1A`, color: accentColor }}>{skill}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400 italic text-xs">Your skills will appear here.</p>
                    )}
                </section>
                 {hasLanguages && (
                    <section className="mb-6">
                        <h3 className="text-md font-semibold uppercase tracking-wider mb-3 flex items-center gap-2"><Globe size={16} /> Languages</h3>
                        <ul className="space-y-1">
                            {languages.map(lang => (
                                <li key={lang.id} className="text-xs">{lang.name} <span className="text-gray-500">({lang.level})</span></li>
                            ))}
                        </ul>
                    </section>
                )}
                 {hasActivities && (
                    <section>
                        <h3 className="text-md font-semibold uppercase tracking-wider mb-3 flex items-center gap-2"><Activity size={16} /> Activities</h3>
                        <ul className="space-y-1">
                            {activities.map((activity, index) => (
                                <li key={index} className="text-xs">{activity}</li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>

            <div className="space-y-4 text-xs">
                {personalInfo.email && <div className="flex items-center gap-2"><Mail size={14} style={{ color: accentColor }}/><span>{personalInfo.email}</span></div>}
                {personalInfo.phone && <div className="flex items-center gap-2"><Phone size={14} style={{ color: accentColor }}/><span>{personalInfo.phone}</span></div>}
                {fullAddress && <div className="flex items-center gap-2"><MapPin size={14} style={{ color: accentColor }}/><span>{fullAddress}</span></div>}
                {hasWebsites && websites.map(site => (
                  <div key={site.id} className="flex items-center gap-2"><LinkIcon size={14} style={{ color: accentColor }}/><a href={site.url} className="hover:underline" style={{ color: accentColor }}>{site.label || site.url}</a></div>
                ))}
            </div>
        </aside>

        <main className="w-2/3 p-8 space-y-6">
             <section>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-2"><Megaphone size={18}/> Career Summary</h3>
                {summary ? (
                    <p className="text-gray-600 leading-relaxed border-l-4 pl-4" style={{ borderColor: `${accentColor}33` }}>{summary}</p>
                ) : (
                    <p className="text-gray-400 italic text-sm border-l-4 pl-4" style={{ borderColor: `${accentColor}33` }}>Your summary will appear here.</p>
                )}
              </section>
            
            <section>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3"><Briefcase size={18}/> Professional Experience</h3>
              {hasExperience ? (
                <div className="space-y-4">
                  {experience.map((job) => {
                    const location = [job.city, job.state].filter(Boolean).join(', ');
                    return (
                      <div key={job.id}>
                        <div className="flex justify-between items-baseline">
                          <h4 className="text-md font-bold text-gray-800">{job.role || 'Job Title'}</h4>
                          <p className="text-xs text-gray-500">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-600 italic">{job.company || 'Company Name'}{location && ` - ${location}`}</p>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-600">
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

            <section>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3"><GraduationCap size={18}/>Education</h3>
              {hasEducation ? (
                <div className="space-y-2">
                  {education.map((edu) => {
                    const gradDate = edu.isStillEnrolled 
                      ? 'Enrolled' 
                      : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
                    return (
                      <div key={edu.id}>
                         <h4 className="text-md font-bold text-gray-800">{edu.degree || 'Degree'}</h4>
                         <p className="text-sm text-gray-600 italic">{edu.school || 'School Name'} - {gradDate || 'Date'}</p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-400 italic text-sm">Your education will appear here.</p>
              )}
            </section>
            {hasCertifications && (
                <section>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3"><Award size={18}/>Certifications</h3>
                    {certifications.map(cert => (
                        <div key={cert.id} className="mb-2">
                           <h4 className="text-md font-bold text-gray-800">{cert.name}</h4>
                           <p className="text-sm text-gray-600 italic">{cert.issuer} - {cert.date}</p>
                        </div>
                    ))}
                </section>
            )}
            {hasAwards && (
                <section>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3"><Trophy size={18}/>Awards</h3>
                    {awards.map(award => (
                        <div key={award.id} className="mb-2">
                           <h4 className="text-md font-bold text-gray-800">{award.name}</h4>
                           <p className="text-sm text-gray-600 italic">{award.description} - {award.date}</p>
                        </div>
                    ))}
                </section>
            )}
             {hasCustomSections && customSections.map(section => (
                <section key={section.id}>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3"><Pencil size={18}/>{section.title}</h3>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-600">
                        {section.content}
                    </ReactMarkdown>
                </section>
            ))}
            {showReferences && (
                <section>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3"><Users size={18}/>References</h3>
                    <p className="text-gray-600">Available upon request.</p>
                </section>
            )}
        </main>
    </div>
  );
};
