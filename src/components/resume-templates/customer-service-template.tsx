
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Smile, Star, Heart, MessageSquare, Award, Globe, Trophy, Activity, Link as LinkIcon, Pencil, Users } from 'lucide-react';
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

export const CustomerServiceTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
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
    <div className={cn("bg-white text-gray-800 p-8 w-full h-full font-['Roboto',_sans-serif]", fontClass)}>
      <header className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: `2px solid ${accentColor}80` }}>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{fullName || 'Your Name'}</h1>
          <h2 className="text-lg font-medium" style={{ color: accentColor }}>{hasExperience ? experience[0]?.role : 'Customer Service Professional'}</h2>
        </div>
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accentColor}1A` }}>
            <Smile className="h-10 w-10" style={{ color: accentColor }} />
        </div>
      </header>

      <div className="grid grid-cols-3 gap-8">
        <main className="col-span-2 space-y-6">
          <section>
            <h3 className="text-md font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-2"><MessageSquare size={16} /> Summary</h3>
            {summary ? (
              <p className="text-gray-600 leading-relaxed">{summary}</p>
            ) : (
                <p className="text-gray-400 italic text-sm">Your summary will appear here.</p>
            )}
          </section>
          <section>
            <h3 className="text-md font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-2"><Heart size={16}/> Professional Experience</h3>
            {hasExperience ? (
              experience.map((job) => {
                const location = [job.city, job.state].filter(Boolean).join(', ');
                return (
                  <div key={job.id} className="mb-4">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-md font-bold text-gray-800">{job.role || 'Job Title'}</h4>
                      <p className="text-xs text-gray-500">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                    </div>
                    <p className="text-sm font-semibold" style={{ color: accentColor }}>{job.company || 'Company Name'}{location && ` | ${location}`}</p>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-600">
                        {job.description || '* Your job description will appear here.'}
                    </ReactMarkdown>
                  </div>
                )
              })
            ) : (
                <p className="text-gray-400 italic text-sm">Your experience will appear here.</p>
            )}
          </section>
          {hasCustomSections && customSections.map(section => (
            <section key={section.id}>
              <h3 className="text-md font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-2"><Pencil size={16}/>{section.title}</h3>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-600">
                  {section.content}
              </ReactMarkdown>
            </section>
          ))}
        </main>
        <aside className="col-span-1 space-y-6">
           <section>
                <h3 className="text-md font-bold uppercase tracking-wider text-gray-700 mb-3">Contact</h3>
                <div className="space-y-2 text-xs">
                    {personalInfo.email && <p className="flex items-center gap-2"><Mail size={14}/> {personalInfo.email}</p>}
                    {personalInfo.phone && <p className="flex items-center gap-2"><Phone size={14}/> {personalInfo.phone}</p>}
                    {fullAddress && <p className="flex items-center gap-2"><MapPin size={14}/> {fullAddress}</p>}
                    {websites.map(site => (
                      <p key={site.id} className="flex items-center gap-2"><LinkIcon size={14}/> <a href={site.url} className="hover:underline" style={{ color: accentColor }}>{site.label || site.url}</a></p>
                    ))}
                </div>
           </section>
           <section>
                <h3 className="text-md font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-2"><Star size={16} /> Skills</h3>
                {hasSkills ? (
                    <ul className="text-sm text-gray-700 space-y-1">
                        {skills.filter(skill => skill).map((skill, index) => (
                            <li key={index} className="rounded-md px-2 py-1" style={{ backgroundColor: `${accentColor}1A` }}>{skill}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 italic text-xs">Your skills will appear here.</p>
                )}
           </section>
           <section>
              <h3 className="text-md font-bold uppercase tracking-wider text-gray-700 mb-3">Education</h3>
              {hasEducation ? (
                education.map((edu) => {
                  const gradDate = edu.isStillEnrolled 
                      ? 'Enrolled' 
                      : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
                  return (
                    <div key={edu.id} className="mb-2">
                       <h4 className="text-md font-bold text-gray-800">{edu.degree || 'Degree'}</h4>
                       <p className="text-sm font-semibold" style={{ color: accentColor }}>{edu.school || 'School Name'}</p>
                       <p className="text-xs text-gray-500">{gradDate || 'Date'}</p>
                    </div>
                  )
                })
              ) : (
                <p className="text-gray-400 italic text-xs">Your education will appear here.</p>
              )}
            </section>
          {hasAwards && (
            <section>
              <h3 className="text-md font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-2"><Trophy size={16} /> Awards</h3>
              {awards.map((award) => (
                <div key={award.id} className="mb-2">
                   <h4 className="text-md font-bold text-gray-800">{award.name || 'Award Name'}</h4>
                   <p className="text-xs text-gray-500">{award.date || 'Date'}</p>
                </div>
              ))}
            </section>
          )}
          {hasCertifications && (
            <section>
              <h3 className="text-md font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-2"><Award size={16} /> Certifications</h3>
              {certifications.map((cert) => (
                <div key={cert.id} className="mb-2">
                   <h4 className="text-md font-bold text-gray-800">{cert.name || 'Certification Name'}</h4>
                   <p className="text-sm font-semibold" style={{ color: accentColor }}>{cert.issuer || 'Issuing Body'}</p>
                   <p className="text-xs text-gray-500">{cert.date || 'Date'}</p>
                </div>
              ))}
            </section>
          )}
          {hasActivities && (
            <section>
              <h3 className="text-md font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-2"><Activity size={16} /> Activities</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                {activities.map((activity, index) => (
                    <li key={index} className="rounded-md px-2 py-1" style={{ backgroundColor: `${accentColor}1A` }}>{activity}</li>
                ))}
              </ul>
            </section>
          )}
          {hasLanguages && (
            <section>
              <h3 className="text-md font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-2"><Globe size={16} /> Languages</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                {languages.map((lang) => (
                    <li key={lang.id} className="rounded-md px-2 py-1" style={{ backgroundColor: `${accentColor}1A` }}>{lang.name} - {lang.level}</li>
                ))}
              </ul>
            </section>
          )}
          {showReferences && (
            <section>
              <h3 className="text-md font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-2"><Users size={16} /> References</h3>
              <p className="text-xs text-gray-600">Available upon request.</p>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
};
