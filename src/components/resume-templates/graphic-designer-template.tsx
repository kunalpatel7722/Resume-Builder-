
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Star, Palette, Dribbble, Brush, Award, Globe, Trophy, Activity, Link as LinkIcon, Pencil, Users } from 'lucide-react';
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

  return (
    <div className={cn("bg-white text-gray-800 w-full h-full font-sans flex", fontClass)}>
        <aside className="w-1/3 bg-gray-100 p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ring-4" style={{ backgroundColor: `${accentColor}1A`, ringColor: `${accentColor}33` }}>
                <Brush className="h-12 w-12" style={{ color: accentColor }} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{fullName || 'Your Name'}</h1>
            <h2 className="text-md font-light tracking-widest" style={{ color: accentColor }}>{experience[0]?.role || 'Graphic Designer'}</h2>
            
            <div className="space-y-6 mt-8 text-left w-full">
                <section>
                    <h3 className="font-bold text-sm uppercase tracking-wider mb-2">Contact</h3>
                    <div className="space-y-2 text-xs text-gray-600">
                        {personalInfo.email && <p className="truncate">{personalInfo.email}</p>}
                        {personalInfo.phone && <p>{personalInfo.phone}</p>}
                        {fullAddress && <p>{fullAddress}</p>}
                    </div>
                </section>
                 {skills.length > 0 && (
                    <section>
                        <h3 className="font-bold text-sm uppercase tracking-wider mb-2">Tools</h3>
                        <div className="flex flex-wrap gap-2">
                            {skills.filter(skill => skill).map((skill, index) => (
                                <span key={index} className="text-xs font-semibold" style={{ color: accentColor }}>{skill}</span>
                            ))}
                        </div>
                    </section>
                )}
                {languages.length > 0 && (
                    <section>
                        <h3 className="font-bold text-sm uppercase tracking-wider mb-2">Languages</h3>
                        <div className="space-y-1 text-xs text-gray-600">
                            {languages.map(lang => (
                                <p key={lang.id}>{lang.name} ({lang.level})</p>
                            ))}
                        </div>
                    </section>
                )}
                 {websites.length > 0 && (
                    <section>
                        <h3 className="font-bold text-sm uppercase tracking-wider mb-2">Links</h3>
                        <div className="space-y-1 text-xs text-gray-600">
                            {websites.map(site => (
                                <p key={site.id}><a href={site.url} className="hover:underline" style={{ color: accentColor }}>{site.label || site.url}</a></p>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </aside>

        <main className="w-2/3 p-8">
            {summary && (
              <section className="mb-6">
                <p className="text-gray-600 leading-relaxed text-lg italic text-center">"{summary}"</p>
              </section>
            )}

            {experience.length > 0 && experience[0]?.role && (
              <section className="mb-6">
                <h2 className="text-lg font-bold uppercase tracking-wider flex items-center gap-2 mb-3" style={{ color: accentColor }}><Briefcase size={18}/>Experience</h2>
                <div className="space-y-4 relative border-l-2 pl-6" style={{ borderColor: `${accentColor}33` }}>
                  {experience.map((job) => {
                    const location = [job.city, job.state].filter(Boolean).join(', ');
                    return (
                      <div key={job.id} className="relative">
                         <div className="absolute -left-[30px] top-1 h-3 w-3 rounded-full ring-4 ring-gray-100" style={{ backgroundColor: accentColor }}></div>
                        <h3 className="text-base font-bold text-gray-900">{job.role || 'Job Title'}</h3>
                        <p className="text-sm font-semibold text-gray-700">{job.company || 'Company Name'} / {location && `${location} / `}<span className="text-xs font-normal text-gray-500">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</span></p>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-600">
                            {job.description}
                        </ReactMarkdown>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

             {education.length > 0 && education[0]?.school && (
              <section className="mb-6">
                <h2 className="text-lg font-bold uppercase tracking-wider flex items-center gap-2 mb-3" style={{ color: accentColor }}><GraduationCap size={18}/>Education</h2>
                 {education.map((edu) => {
                    const gradDate = edu.isStillEnrolled 
                        ? 'Enrolled' 
                        : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
                   return (
                     <div key={edu.id}>
                       <h3 className="text-base font-bold text-gray-900">{edu.school || 'University'}</h3>
                       <p className="text-sm text-gray-700">{edu.degree || 'Degree'} - {gradDate || 'Date'}</p>
                     </div>
                   )
                 })}
              </section>
            )}
            {certifications.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase tracking-wider flex items-center gap-2 mb-3" style={{ color: accentColor }}><Award size={18}/>Certifications</h2>
                    {certifications.map(cert => (
                        <div key={cert.id} className="mb-2">
                           <h3 className="text-base font-bold text-gray-900">{cert.name}</h3>
                           <p className="text-sm text-gray-700">{cert.issuer} - {cert.date}</p>
                        </div>
                    ))}
                </section>
            )}
            {awards.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase tracking-wider flex items-center gap-2 mb-3" style={{ color: accentColor }}><Trophy size={18}/>Awards</h2>
                    {awards.map(award => (
                        <div key={award.id} className="mb-2">
                           <h3 className="text-base font-bold text-gray-900">{award.name}</h3>
                           <p className="text-sm text-gray-700">{award.description} - {award.date}</p>
                        </div>
                    ))}
                </section>
            )}
             {activities.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase tracking-wider flex items-center gap-2 mb-3" style={{ color: accentColor }}><Activity size={18}/>Activities</h2>
                    <ul className="list-disc list-inside text-gray-700">
                        {activities.map((activity, index) => <li key={index}>{activity}</li>)}
                    </ul>
                </section>
            )}
            {customSections.map(section => (
                <section key={section.id} className="mb-6">
                    <h2 className="text-lg font-bold uppercase tracking-wider flex items-center gap-2 mb-3" style={{ color: accentColor }}><Pencil size={18}/>{section.title}</h2>
                     <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-600">
                        {section.content}
                    </ReactMarkdown>
                </section>
            ))}
            {showReferences && (
                <section>
                    <h2 className="text-lg font-bold uppercase tracking-wider flex items-center gap-2 mb-3" style={{ color: accentColor }}><Users size={18}/>References</h2>
                    <p className="text-gray-700">Available upon request.</p>
                </section>
            )}
        </main>
    </div>
  );
};
