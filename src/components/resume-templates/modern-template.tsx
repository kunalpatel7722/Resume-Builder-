
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Star, Award, Globe, Trophy, Activity, Link as LinkIcon, Pencil, Users } from 'lucide-react';
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
    if (!startDate) return 'Dates';
    const start = format(startDate, 'MMM yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'MMM yyyy')}`;
    return start;
  };

  const fontClass = fontClasses[fontSize];

  return (
    <div className={cn("bg-white text-gray-800 p-8 shadow-lg w-full h-full font-sans", fontClass)}>
      <header className="text-center mb-8 border-b-2 border-gray-300 pb-4">
        <h1 className="text-4xl font-bold tracking-wider uppercase text-gray-800">{fullName || 'Your Name'}</h1>
        <div className="flex justify-center items-center gap-x-4 gap-y-1 text-xs text-gray-600 mt-2 flex-wrap">
          {personalInfo.email && <div className="flex items-center gap-1"><Mail size={12} /><span>{personalInfo.email}</span></div>}
          {personalInfo.phone && <div className="flex items-center gap-1"><Phone size={12} /><span>{personalInfo.phone}</span></div>}
          {fullAddress && <div className="flex items-center gap-1"><MapPin size={12} /><span>{fullAddress}</span></div>}
          {hasWebsites && websites.map(site => (
            <div key={site.id} className="flex items-center gap-1"><LinkIcon size={12} /><a href={site.url} style={{ color: accentColor }}>{site.label || site.url}</a></div>
          ))}
        </div>
      </header>

      <main>
        <section className="mb-6">
          <h2 className="text-lg font-semibold uppercase tracking-wide text-gray-700 border-b border-gray-200 pb-1 mb-2">Summary</h2>
          {summary ? (
            <p className="text-gray-600 leading-relaxed">{summary}</p>
          ) : (
            <p className="text-gray-400 italic text-sm">Your summary will appear here.</p>
          )}
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold uppercase tracking-wide text-gray-700 border-b border-gray-200 pb-1 mb-3 flex items-center gap-2"><Briefcase size={18}/> Work Experience</h2>
          {hasExperience ? (
            experience.map((job) => {
              const location = [job.city, job.state].filter(Boolean).join(', ');
              return (
                <div key={job.id} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-md font-bold text-gray-800">{job.role || 'Job Title'}</h3>
                    <p className="text-xs text-gray-500">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-600 italic">
                    {job.company || 'Company Name'}{location && ` | ${location}`}
                  </p>
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

        <section className="mb-6">
          <h2 className="text-lg font-semibold uppercase tracking-wide text-gray-700 border-b border-gray-200 pb-1 mb-3 flex items-center gap-2"><GraduationCap size={18}/> Education</h2>
          {hasEducation ? (
            education.map((edu) => {
              const gradDate = edu.isStillEnrolled 
                ? 'Enrolled' 
                : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
              return (
                <div key={edu.id} className="mb-2">
                   <div className="flex justify-between items-baseline">
                      <h3 className="text-md font-bold text-gray-800">{edu.degree || 'Degree'}</h3>
                      <p className="text-xs text-gray-500">{gradDate || 'Date'}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-600 italic">{edu.school || 'School Name'}</p>
                </div>
              )
            })
          ) : (
             <p className="text-gray-400 italic text-sm">Your education will appear here.</p>
          )}
        </section>
        
        {hasAwards && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-gray-700 border-b border-gray-200 pb-1 mb-3 flex items-center gap-2"><Trophy size={18}/> Awards</h2>
            {awards.map((award) => (
              <div key={award.id} className="mb-2">
                <h3 className="text-md font-bold text-gray-800">{award.name || 'Award Name'} - <span className="text-sm font-normal text-gray-600">{award.date || 'Date'}</span></h3>
                <p className="text-sm text-gray-600 italic">{award.description}</p>
              </div>
            ))}
          </section>
        )}
        
        {hasCertifications && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-gray-700 border-b border-gray-200 pb-1 mb-3 flex items-center gap-2"><Award size={18}/> Certifications</h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-2">
                <h3 className="text-md font-bold text-gray-800">{cert.name || 'Certification Name'}</h3>
                <p className="text-sm font-semibold text-gray-600 italic">{cert.issuer || 'Issuing Body'} - {cert.date || 'Date'}</p>
              </div>
            ))}
          </section>
        )}

        {hasSkills && (
           <section className="mb-6">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-gray-700 border-b border-gray-200 pb-1 mb-3 flex items-center gap-2"><Star size={18}/> Skills</h2>
            <div className="flex flex-wrap gap-2">
                {skills.filter(skill => skill).map((skill, index) => (
                    <span key={index} className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">{skill}</span>
                ))}
            </div>
           </section>
        )}
        
        {hasActivities && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-gray-700 border-b border-gray-200 pb-1 mb-3 flex items-center gap-2"><Activity size={18}/> Activities</h2>
            <ul className="list-disc list-inside text-gray-600">
                {activities.map((activity, index) => (
                    <li key={index}>{activity}</li>
                ))}
            </ul>
          </section>
        )}

        {hasCustomSections && customSections.map(section => (
          <section key={section.id} className="mb-6">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-gray-700 border-b border-gray-200 pb-1 mb-3 flex items-center gap-2"><Pencil size={18}/>{section.title}</h2>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-600">
                {section.content}
            </ReactMarkdown>
          </section>
        ))}

        {hasLanguages && (
           <section className="mb-6">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-gray-700 border-b border-gray-200 pb-1 mb-3 flex items-center gap-2"><Globe size={18}/> Languages</h2>
            <div className="flex flex-wrap gap-4">
                {languages.map((lang) => (
                    <div key={lang.id} className="text-gray-700 text-sm">
                        <span className="font-semibold">{lang.name}:</span> {lang.level}
                    </div>
                ))}
            </div>
           </section>
        )}
        
        {showReferences && (
           <section>
            <h2 className="text-lg font-semibold uppercase tracking-wide text-gray-700 border-b border-gray-200 pb-1 mb-3 flex items-center gap-2"><Users size={18}/> References</h2>
            <p className="text-gray-600">Available upon request.</p>
           </section>
        )}
      </main>
    </div>
  );
};
