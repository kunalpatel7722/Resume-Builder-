
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Star, HeartPulse, Award, Globe, Trophy, Activity, Link as LinkIcon, Pencil, Users } from 'lucide-react';
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

export const HealthcareTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
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
    <div className={cn("bg-white text-gray-800 p-8 w-full h-full font-sans", fontClass)}>
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">{fullName || 'Your Name'}</h1>
        <h2 className="text-lg mt-1" style={{ color: accentColor }}>{experience[0]?.role || 'Healthcare Professional'}</h2>
        <div className="text-xs text-gray-600 mt-3 flex justify-center items-center gap-4">
          <span>{fullAddress}</span>
          <span>&bull;</span>
          <span>{personalInfo.phone}</span>
          <span>&bull;</span>
          <span>{personalInfo.email}</span>
        </div>
      </header>

      <div className="w-full h-px bg-gray-200 mb-6" />

      <main className="space-y-6">
        {summary && (
          <section>
            <h3 className="text-md font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Professional Profile</h3>
            <p className="text-gray-700 leading-relaxed text-sm">{summary}</p>
          </section>
        )}

        {experience.length > 0 && experience[0]?.role && (
          <section>
            <h3 className="text-md font-bold uppercase tracking-wider mb-3" style={{ color: accentColor }}>Clinical Experience</h3>
            {experience.map((job) => {
              const location = [job.city, job.state].filter(Boolean).join(', ');
              return (
                <div key={job.id} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-md font-semibold text-gray-800">{job.role || 'Job Title'}</h4>
                    <p className="text-xs text-gray-500">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-600">{job.company || 'Company Name'}{location && ` | ${location}`}</p>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
                      {job.description}
                  </ReactMarkdown>
                </div>
              )
            })}
          </section>
        )}

        {education.length > 0 && education[0]?.school && (
          <section>
            <h3 className="text-md font-bold uppercase tracking-wider mb-3" style={{ color: accentColor }}>Education & Licenses</h3>
            {education.map((edu) => {
              const gradDate = edu.isStillEnrolled 
                ? 'Enrolled' 
                : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
              return (
                <div key={edu.id} className="mb-2">
                   <h4 className="text-md font-semibold">{edu.degree || 'Degree'}</h4>
                   <p className="text-sm text-gray-600">{edu.school || 'School Name'} | {gradDate || 'Date'}</p>
                </div>
              )
            })}
            {certifications.map((cert) => (
                <div key={cert.id} className="mb-2 mt-2">
                   <h4 className="text-md font-semibold">{cert.name || 'Certification Name'}</h4>
                   <p className="text-sm text-gray-600">{cert.issuer || 'Issuing Body'} | {cert.date || 'Date'}</p>
                </div>
            ))}
          </section>
        )}

        {awards.length > 0 && (
          <section>
            <h3 className="text-md font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Awards</h3>
            {awards.map(award => (
              <p key={award.id} className="text-gray-700 text-sm mb-1">{award.name} - {award.date}</p>
            ))}
          </section>
        )}

        {skills.length > 0 && (
           <section>
            <h3 className="text-md font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Skills</h3>
            <p className="text-gray-700 text-sm">{skills.filter(skill => skill).join(' | ')}</p>
           </section>
        )}

        {activities.length > 0 && (
          <section>
            <h3 className="text-md font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Activities</h3>
            <p className="text-gray-700 text-sm">{activities.filter(a => a).join(' | ')}</p>
          </section>
        )}

        {languages.length > 0 && (
           <section>
            <h3 className="text-md font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Languages</h3>
            <p className="text-gray-700 text-sm">{languages.map(lang => `${lang.name} (${lang.level})`).join(' | ')}</p>
           </section>
        )}

        {customSections.map(section => (
          <section key={section.id}>
            <h3 className="text-md font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>{section.title}</h3>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
                {section.content}
            </ReactMarkdown>
          </section>
        ))}

        {showReferences && (
          <section>
            <h3 className="text-md font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>References</h3>
            <p className="text-gray-700 text-sm">Available upon request.</p>
          </section>
        )}
      </main>
    </div>
  );
};
