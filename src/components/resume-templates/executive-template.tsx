
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Star, Award, User, Globe, Languages, Trophy, Activity, Link as LinkIcon, Pencil, Users } from 'lucide-react';
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
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl',
};

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, languages, certifications, activities, awards, websites, customSections, showReferences } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');

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
        <aside className="w-1/3 bg-slate-100 p-8 flex flex-col space-y-8">
            <div>
                <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight leading-none">{fullName || 'Your Name'}</h1>
                <h2 className="text-md font-semibold mt-2" style={{ color: accentColor }}>{experience[0]?.role || 'Professional Title'}</h2>
            </div>
            
            <section>
                 <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 border-b-2 border-slate-300 pb-1">Contact</h3>
                 <div className="space-y-3 text-slate-600 text-xs">
                    {personalInfo.email && <div className="flex items-start gap-2"><Mail size={14} className="mt-0.5" style={{ color: accentColor }}/><span>{personalInfo.email}</span></div>}
                    {personalInfo.phone && <div className="flex items-start gap-2"><Phone size={14} className="mt-0.5" style={{ color: accentColor }}/><span>{personalInfo.phone}</span></div>}
                    {fullAddress && <div className="flex items-start gap-2"><MapPin size={14} className="mt-0.5" style={{ color: accentColor }}/><span>{fullAddress}</span></div>}
                    {websites.map(site => (
                        <div key={site.id} className="flex items-start gap-2"><LinkIcon size={14} className="mt-0.5" style={{ color: accentColor }}/><a href={site.url} className="hover:underline" style={{ color: accentColor }}>{site.label || site.url}</a></div>
                    ))}
                </div>
            </section>
            
            {education.length > 0 && education[0]?.school && (
                <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 border-b-2 border-slate-300 pb-1">Education</h3>
                    <div className="space-y-3">
                        {education.map((edu) => {
                          const gradDate = edu.isStillEnrolled 
                            ? 'Enrolled' 
                            : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
                          return (
                            <div key={edu.id}>
                               <h4 className="font-bold text-slate-800">{edu.school || 'School Name'}</h4>
                               <p className="text-slate-600">{edu.degree || 'Degree'}</p>
                               <p className="text-xs text-slate-500">{gradDate || 'Date'}</p>
                            </div>
                          )
                        })}
                    </div>
                </section>
            )}

            {skills.length > 0 && (
                <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 border-b-2 border-slate-300 pb-1">Skills</h3>
                    <ul className="space-y-1.5 text-slate-700">
                        {skills.filter(skill => skill).map((skill, index) => (
                            <li key={index} className="flex items-center gap-2">
                               <Star size={14} style={{ color: accentColor }}/> <span>{skill}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {languages.length > 0 && (
                <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 border-b-2 border-slate-300 pb-1">Languages</h3>
                    <ul className="space-y-1.5 text-slate-700">
                        {languages.map((lang) => (
                            <li key={lang.id} className="flex items-center gap-2">
                                <Languages size={14} style={{ color: accentColor }}/>
                                <span>{lang.name} <span className="text-slate-500">({lang.level})</span></span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </aside>

        <main className="w-2/3 p-8 bg-white">
            {summary && (
              <section className="mb-8">
                <h2 className={cn("font-bold text-slate-800 flex items-center gap-3 mb-3", headingClass)}><User size={24} style={{ color: accentColor }}/> Profile</h2>
                <p className="text-slate-600 leading-relaxed text-sm">{summary}</p>
              </section>
            )}

            {experience.length > 0 && experience[0]?.role && (
              <section className="mb-8">
                <h2 className={cn("font-bold text-slate-800 flex items-center gap-3 mb-4", headingClass)}><Briefcase size={24} style={{ color: accentColor }}/>Experience</h2>
                <div className="space-y-5">
                  {experience.map((job) => {
                    const location = [job.city, job.state].filter(Boolean).join(', ');
                    return (
                      <div key={job.id} className="relative pl-6">
                         <div className="absolute left-0 top-1.5 h-full w-0.5 bg-slate-200"></div>
                         <div className="absolute left-[-5px] top-1.5 h-3 w-3 rounded-full ring-4 ring-white" style={{ backgroundColor: accentColor }}></div>
                        <div>
                          <div className="flex justify-between items-baseline">
                            <h3 className="text-lg font-bold text-slate-900">{job.role || 'Job Title'}</h3>
                            <p className="text-xs text-slate-500 font-medium">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                          </div>
                          <p className="text-md font-semibold text-slate-600">{job.company || 'Company Name'}{location && ` - ${location}`}</p>
                          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-slate-600">
                              {job.description}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}
            
            {awards.length > 0 && (
              <section className="mb-8">
                <h2 className={cn("font-bold text-slate-800 flex items-center gap-3 mb-4", headingClass)}><Trophy size={24} style={{ color: accentColor }}/>Accomplishments</h2>
                <div className="space-y-5">
                  {awards.map((award) => (
                    <div key={award.id} className="relative pl-6">
                      <div className="absolute left-0 top-1.5 h-full w-0.5 bg-slate-200"></div>
                      <div className="absolute left-[-5px] top-1.5 h-3 w-3 rounded-full ring-4 ring-white" style={{ backgroundColor: accentColor }}></div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{award.name || 'Award Name'}</h3>
                        <p className="text-md font-semibold text-slate-600">{award.description} - {award.date || 'Date'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {certifications.length > 0 && (
              <section className="mb-8">
                <h2 className={cn("font-bold text-slate-800 flex items-center gap-3 mb-4", headingClass)}><Award size={24} style={{ color: accentColor }}/>Certifications</h2>
                <div className="space-y-5">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="relative pl-6">
                      <div className="absolute left-0 top-1.5 h-full w-0.5 bg-slate-200"></div>
                      <div className="absolute left-[-5px] top-1.5 h-3 w-3 rounded-full ring-4 ring-white" style={{ backgroundColor: accentColor }}></div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{cert.name || 'Certification Name'}</h3>
                        <p className="text-md font-semibold text-slate-600">{cert.issuer || 'Issuing Organization'} - {cert.date || 'Date'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activities.length > 0 && (
              <section className="mb-8">
                <h2 className={cn("font-bold text-slate-800 flex items-center gap-3 mb-4", headingClass)}><Activity size={24} style={{ color: accentColor }}/>Activities</h2>
                <ul className="list-disc list-inside text-slate-700">
                  {activities.map((activity, index) => <li key={index}>{activity}</li>)}
                </ul>
              </section>
            )}

            {customSections.map(section => (
              <section key={section.id} className="mb-8">
                <h2 className={cn("font-bold text-slate-800 flex items-center gap-3 mb-4", headingClass)}><Pencil size={24} style={{ color: accentColor }}/>{section.title}</h2>
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-slate-600">
                    {section.content}
                </ReactMarkdown>
              </section>
            ))}

            {showReferences && (
              <section>
                <h2 className={cn("font-bold text-slate-800 flex items-center gap-3 mb-4", headingClass)}><Users size={24} style={{ color: accentColor }}/>References</h2>
                <p className="text-slate-600 leading-relaxed text-sm">Available upon request.</p>
              </section>
            )}
        </main>
    </div>
  );
};
