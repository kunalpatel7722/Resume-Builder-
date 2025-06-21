
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Star, Smile, Building, Award, Trophy, Activity, Link as LinkIcon, Pencil, Users, Languages } from 'lucide-react';
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
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export const HospitalityTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
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
    <div className={cn("bg-white text-gray-800 p-8 w-full h-full font-['Garamond',_serif]", fontClass)}>
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold">{fullName || 'Your Name'}</h1>
        <p className="text-lg text-gray-600 mt-1">{hasExperience ? experience[0]?.role : 'Hospitality Manager'}</p>
        <div className="text-sm text-gray-500 mt-3 border-t border-gray-200 pt-2">
          {personalInfo.phone || 'Phone'} &nbsp;&bull;&nbsp; {personalInfo.email || 'Email'} &nbsp;&bull;&nbsp; {fullAddress || 'Address'}
        </div>
      </header>
      
      <main className="space-y-6">
        <section>
          <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-2">PROFESSIONAL SUMMARY</h2>
          {summary ? (
            <p className="text-gray-700 leading-snug">{summary}</p>
          ) : (
            <p className="text-gray-400 italic text-sm">Your summary will appear here.</p>
          )}
        </section>

        <section>
          <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">EXPERIENCE</h2>
          {hasExperience ? (
            experience.map((job) => {
              const location = [job.city, job.state].filter(Boolean).join(', ');
              return (
                <div key={job.id} className="mb-4">
                    <div className="flex justify-between items-baseline">
                        <h3 className="text-lg font-semibold">{job.company || 'Hotel / Restaurant Name'}{location && `, ${location}`}</h3>
                        <p className="text-sm text-gray-600">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                    </div>
                    <p className="text-md italic">{job.role || 'Job Title'}</p>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-base max-w-none prose-serif text-gray-700">
                      {job.description || '* Your job description will appear here.'}
                    </ReactMarkdown>
                </div>
              )
            })
          ) : (
             <p className="text-gray-400 italic text-sm">Your experience will appear here.</p>
          )}
        </section>

        <section>
          <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-2">EDUCATION</h2>
          {hasEducation ? (
            education.map((edu) => {
              const gradDate = edu.isStillEnrolled 
                ? 'Enrolled' 
                : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
              return (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                      <h3 className="text-lg font-semibold">{edu.school || 'University Name'}</h3>
                      <p className="text-md italic">{edu.degree || 'Degree'}</p>
                  </div>
                  <p className="text-sm text-gray-600">{gradDate || 'Date'}</p>
                </div>
              )
            })
          ) : (
             <p className="text-gray-400 italic text-sm">Your education will appear here.</p>
          )}
        </section>

        {hasCertifications && (
          <section>
            <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-2">CERTIFICATIONS</h2>
            {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-start">
                  <div>
                      <h3 className="text-lg font-semibold">{cert.name || 'Certification Name'}</h3>
                      <p className="text-md italic">{cert.issuer || 'Issuing Body'}</p>
                  </div>
                  <p className="text-sm text-gray-600">{cert.date || 'Date'}</p>
                </div>
              ))}
          </section>
        )}

        {hasAwards && (
          <section>
            <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-2">AWARDS</h2>
            {awards.map((award) => (
                <div key={award.id} className="flex justify-between items-start">
                  <div>
                      <h3 className="text-lg font-semibold">{award.name || 'Award Name'}</h3>
                      <p className="text-md italic">{award.description}</p>
                  </div>
                  <p className="text-sm text-gray-600">{award.date || 'Date'}</p>
                </div>
              ))}
          </section>
        )}

        {hasSkills && (
           <section>
            <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-2">KEY SKILLS</h2>
            <div className="columns-2">
                {skills.filter(skill => skill).map((skill, index) => (
                    <p key={index} className="text-gray-700 mb-1">{skill}</p>
                ))}
            </div>
           </section>
        )}

        {hasActivities && (
            <section>
                <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-2">ACTIVITIES</h2>
                <div className="columns-2">
                    {activities.map((activity, index) => (
                        <p key={index} className="text-gray-700 mb-1">{activity}</p>
                    ))}
                </div>
            </section>
        )}
        
        {hasCustomSections && customSections.map(section => (
          <section key={section.id}>
            <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-2">{section.title}</h2>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-base max-w-none prose-serif text-gray-700">
                {section.content}
            </ReactMarkdown>
          </section>
        ))}

        {hasLanguages && (
            <section>
                <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-2">LANGUAGES</h2>
                <div className="columns-2">
                    {languages.map(lang => (
                        <p key={lang.id} className="text-gray-700 mb-1">{lang.name} ({lang.level})</p>
                    ))}
                </div>
            </section>
        )}
        
        {showReferences && (
            <section>
                <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-2">REFERENCES</h2>
                <p className="text-gray-700">Available upon request.</p>
            </section>
        )}
      </main>
    </div>
  );
};
