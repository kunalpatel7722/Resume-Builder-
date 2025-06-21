
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, User, Star, Briefcase, GraduationCap, Award, Globe, Link as LinkIcon, Trophy, Activity, Pencil, Users } from 'lucide-react';
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

const headingClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
}

export const CreativeTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
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
  const headingClass = headingClasses[fontSize];

  return (
    <div className={cn("bg-white text-gray-800 w-full h-full font-sans flex", fontClass)}>
        <aside className="w-1/3 bg-gray-100 p-6 text-gray-700 flex flex-col">
            <div className="text-center mb-8">
                <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ring-4" style={{ backgroundColor: `${accentColor}1A`, ringColor: `${accentColor}33` }}>
                    <User className="h-12 w-12" style={{ color: accentColor }} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">{fullName || 'Your Name'}</h1>
            </div>

            <div className="space-y-6">
                <section>
                    <h2 className="text-md font-semibold uppercase tracking-wider pb-1 mb-3 flex items-center gap-2" style={{ borderBottom: `2px solid ${accentColor}` }}><Mail size={16} />Contact</h2>
                    <div className="space-y-2 text-xs">
                        {personalInfo.email && <div className="flex items-start gap-2"><Mail size={14} className="mt-0.5" style={{ color: accentColor }}/><span>{personalInfo.email}</span></div>}
                        {personalInfo.phone && <div className="flex items-start gap-2"><Phone size={14} className="mt-0.5" style={{ color: accentColor }}/><span>{personalInfo.phone}</span></div>}
                        {fullAddress && <div className="flex items-start gap-2"><MapPin size={14} className="mt-0.5" style={{ color: accentColor }}/><span>{fullAddress}</span></div>}
                    </div>
                </section>

                <section>
                    <h2 className="text-md font-semibold uppercase tracking-wider pb-1 mb-3 flex items-center gap-2" style={{ borderBottom: `2px solid ${accentColor}` }}><Star size={16} />Skills</h2>
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
                
                {hasActivities && (
                    <section>
                        <h2 className="text-md font-semibold uppercase tracking-wider pb-1 mb-3 flex items-center gap-2" style={{ borderBottom: `2px solid ${accentColor}` }}><Activity size={16} />Activities</h2>
                        <ul className="space-y-1 text-xs">
                           {activities.map((activity, index) => (
                             <li key={index}>{activity}</li>
                           ))}
                        </ul>
                    </section>
                )}

                {hasLanguages && (
                    <section>
                        <h2 className="text-md font-semibold uppercase tracking-wider pb-1 mb-3 flex items-center gap-2" style={{ borderBottom: `2px solid ${accentColor}` }}><Globe size={16} />Languages</h2>
                        <ul className="space-y-1 text-xs">
                           {languages.map(lang => (
                             <li key={lang.id}>{lang.name} <span className="text-gray-500">({lang.level})</span></li>
                           ))}
                        </ul>
                    </section>
                )}

                {hasWebsites && (
                    <section>
                        <h2 className="text-md font-semibold uppercase tracking-wider pb-1 mb-3 flex items-center gap-2" style={{ borderBottom: `2px solid ${accentColor}` }}><LinkIcon size={16} />Links</h2>
                        <ul className="space-y-1 text-xs">
                           {websites.map(site => (
                             <li key={site.id}><a href={site.url} className="hover:underline" style={{ color: accentColor }}>{site.label || site.url}</a></li>
                           ))}
                        </ul>
                    </section>
                )}

            </div>
        </aside>

        <main className="w-2/3 p-8">
            <section className="mb-8">
              <h2 className={cn("font-bold uppercase tracking-wide mb-3", headingClass)} style={{ color: accentColor }}>Summary</h2>
              {summary ? (
                <p className="text-gray-600 leading-relaxed pl-4" style={{ borderLeft: `4px solid ${accentColor}33` }}>{summary}</p>
              ) : (
                 <p className="text-gray-400 italic text-sm pl-4" style={{ borderLeft: `4px solid ${accentColor}33` }}>Your summary will appear here.</p>
              )}
            </section>

            <section className="mb-8">
              <h2 className={cn("font-bold uppercase tracking-wide mb-4 flex items-center gap-2", headingClass)} style={{ color: accentColor }}><Briefcase size={20}/>Work Experience</h2>
              {hasExperience ? (
                <div className="space-y-4">
                  {experience.map((job) => {
                    const location = [job.city, job.state].filter(Boolean).join(', ');
                    return (
                      <div key={job.id} className="relative pl-5">
                        <div className="absolute left-0 top-1 h-full w-0.5 bg-gray-200"></div>
                        <div className="absolute left-[-4px] top-1 h-3 w-3 rounded-full ring-2 ring-white" style={{ backgroundColor: accentColor }}></div>
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-md font-bold text-gray-800">{job.role || 'Job Title'}</h3>
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

            <section className="mb-8">
              <h2 className={cn("font-bold uppercase tracking-wide mb-4 flex items-center gap-2", headingClass)} style={{ color: accentColor }}><GraduationCap size={20}/>Education</h2>
              {hasEducation ? (
                <div className="space-y-2">
                  {education.map((edu) => {
                     const gradDate = edu.isStillEnrolled 
                      ? 'Enrolled' 
                      : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
                    return (
                      <div key={edu.id} className="mb-2">
                         <div className="flex justify-between items-baseline">
                            <h3 className="text-md font-bold text-gray-800">{edu.degree || 'Degree'}{edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}</h3>
                            <p className="text-xs text-gray-500">{gradDate || 'Date'}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-600 italic">{edu.school || 'School Name'}{edu.location && `, ${edu.location}`}</p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                 <p className="text-gray-400 italic text-sm">Your education will appear here.</p>
              )}
            </section>
            
            {hasAwards && (
                <section className="mb-8">
                    <h2 className={cn("font-bold uppercase tracking-wide mb-4 flex items-center gap-2", headingClass)} style={{ color: accentColor }}><Trophy size={20}/>Awards</h2>
                    <div className="space-y-2">
                        {awards.map((award) => (
                          <div key={award.id} className="mb-2">
                             <h3 className="text-md font-bold text-gray-800">{award.name || 'Award Name'} - <span className="font-normal text-sm text-gray-500">{award.date}</span></h3>
                             <p className="text-sm text-gray-600">{award.description}</p>
                          </div>
                        ))}
                    </div>
                </section>
            )}

            {hasCertifications && (
                <section className="mb-8">
                    <h2 className={cn("font-bold uppercase tracking-wide mb-4 flex items-center gap-2", headingClass)} style={{ color: accentColor }}><Award size={20}/>Certifications</h2>
                    <div className="space-y-2">
                        {certifications.map((cert) => (
                          <div key={cert.id} className="mb-2">
                             <h3 className="text-md font-bold text-gray-800">{cert.name || 'Certification Name'}</h3>
                             <p className="text-sm font-semibold text-gray-600 italic">{cert.issuer || 'Issuing Body'} - {cert.date || 'Date'}</p>
                          </div>
                        ))}
                    </div>
                </section>
            )}
            
            {hasCustomSections && customSections.map(section => (
              <section key={section.id} className="mb-8">
                <h2 className={cn("font-bold uppercase tracking-wide mb-3 flex items-center gap-2", headingClass)} style={{ color: accentColor }}><Pencil size={20}/>{section.title}</h2>
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-600">
                    {section.content}
                </ReactMarkdown>
              </section>
            ))}

            {showReferences && (
              <section>
                <h2 className={cn("font-bold uppercase tracking-wide mb-3 flex items-center gap-2", headingClass)} style={{ color: accentColor }}><Users size={20}/>References</h2>
                <p className="text-gray-600">Available upon request.</p>
              </section>
            )}
        </main>
    </div>
  );
};
