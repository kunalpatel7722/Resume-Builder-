
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Star, TrendingUp, Award, Globe, Link as LinkIcon, Trophy, Activity, Pencil, Users } from 'lucide-react';
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

export const FinanceTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
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
        <aside className="w-1/3 bg-gray-50 p-6 flex flex-col">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">{fullName || 'Your Name'}</h1>
                <h2 className="text-md" style={{ color: accentColor }}>{experience[0]?.role || 'Finance Analyst'}</h2>
            </header>
            
            <div className="space-y-6">
                <section>
                    <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-2">Contact</h3>
                    <div className="space-y-2 text-xs text-gray-600">
                        {personalInfo.email && <p>{personalInfo.email}</p>}
                        {personalInfo.phone && <p>{personalInfo.phone}</p>}
                        {fullAddress && <p>{fullAddress}</p>}
                    </div>
                </section>

                {skills.length > 0 && (
                    <section>
                        <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-2">Skills</h3>
                        <ul className="space-y-1">
                            {skills.filter(skill => skill).map((skill, index) => (
                                <li key={index} className="text-gray-700">{skill}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {education.length > 0 && education[0]?.school && (
                    <section>
                        <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-2">Education</h3>
                        {education.map((edu) => {
                          const gradDate = edu.isStillEnrolled 
                            ? 'Enrolled' 
                            : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
                          return (
                            <div key={edu.id} className="text-gray-700">
                               <h4 className="font-semibold">{edu.school || 'University Name'}</h4>
                               <p>{edu.degree || 'Degree'}</p>
                               <p className="text-gray-500">{gradDate || 'Date'}</p>
                            </div>
                          )
                        })}
                    </section>
                )}
                 {languages.length > 0 && (
                    <section>
                        <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-2">Languages</h3>
                        <ul className="space-y-1">
                            {languages.map(lang => (
                                <li key={lang.id} className="text-gray-700">{lang.name}: {lang.level}</li>
                            ))}
                        </ul>
                    </section>
                )}
                {websites.length > 0 && (
                    <section>
                        <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-2">Links</h3>
                        <ul className="space-y-1">
                            {websites.map(site => (
                                <li key={site.id}><a href={site.url} className="hover:underline" style={{ color: accentColor }}>{site.label || site.url}</a></li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </aside>

        <main className="w-2/3 p-8">
            {summary && (
              <section className="mb-6">
                <h2 className="text-lg font-bold text-gray-800 pb-1 border-b-2 border-gray-200 mb-2">Career Objective</h2>
                <p className="text-gray-600 leading-relaxed">{summary}</p>
              </section>
            )}

            {experience.length > 0 && experience[0]?.role && (
              <section className="mb-6">
                <h2 className="text-lg font-bold text-gray-800 pb-1 border-b-2 border-gray-200 mb-3">Professional Experience</h2>
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
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-600">
                            {job.description}
                        </ReactMarkdown>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}
             {awards.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold text-gray-800 pb-1 border-b-2 border-gray-200 mb-3">Awards</h2>
                    <div className="space-y-3">
                        {awards.map((award) => (
                          <div key={award.id}>
                            <h3 className="text-base font-bold text-gray-900">{award.name || 'Award Name'} - <span className="text-sm font-semibold text-gray-700">{award.date || 'Date'}</span></h3>
                            <p className="text-gray-600">{award.description}</p>
                          </div>
                        ))}
                    </div>
                </section>
            )}
             {certifications.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold text-gray-800 pb-1 border-b-2 border-gray-200 mb-3">Certifications</h2>
                    <div className="space-y-3">
                        {certifications.map((cert) => (
                          <div key={cert.id}>
                            <h3 className="text-base font-bold text-gray-900">{cert.name || 'Certification Name'}</h3>
                            <p className="text-sm font-semibold text-gray-700">{cert.issuer || 'Issuing Body'} - {cert.date || 'Date'}</p>
                          </div>
                        ))}
                    </div>
                </section>
            )}
            {activities.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold text-gray-800 pb-1 border-b-2 border-gray-200 mb-3">Activities</h2>
                    <ul className="list-disc list-inside text-gray-700">
                        {activities.map((activity, index) => <li key={index}>{activity}</li>)}
                    </ul>
                </section>
            )}
            {customSections.map(section => (
                <section key={section.id} className="mb-6">
                    <h2 className="text-lg font-bold text-gray-800 pb-1 border-b-2 border-gray-200 mb-3">{section.title}</h2>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-600">
                        {section.content}
                    </ReactMarkdown>
                </section>
            ))}
            {showReferences && (
                <section>
                    <h2 className="text-lg font-bold text-gray-800 pb-1 border-b-2 border-gray-200 mb-3">References</h2>
                    <p className="text-gray-600">Available upon request.</p>
                </section>
            )}
        </main>
    </div>
  );
};
