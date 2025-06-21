import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';
import { Mail, Phone, MapPin } from 'lucide-react';

export interface TemplateProps {
  data: ResumeData;
  accentColor: string;
  fontSize: 'sm' | 'md' | 'lg';
}

const fontClasses = {
  sm: 'text-[10pt]',
  md: 'text-[11pt]',
  lg: 'text-[12pt]',
};

export const AcademicTemplate: React.FC<TemplateProps> = ({ data, accentColor, fontSize }) => {
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
    if (!startDate) return '';
    const start = format(startDate, 'yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'yyyy')}`;
    return start;
  };

  const fontClass = fontClasses[fontSize];

  const Section: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3" style={{ color: accentColor, borderColor: accentColor }}>{title}</h2>
        {children}
      </section>
    );
  };

  return (
    <div className={cn("bg-white text-gray-800 p-8 w-full h-full", fontClass)} style={{ fontFamily: "'Merriweather', serif" }}>
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold">{fullName || 'Your Name'}</h1>
        <div className="text-sm text-gray-600 mt-2 flex justify-center items-center gap-x-3">
          {fullAddress && <div className="flex items-center gap-1.5"><MapPin size={12} /><span>{fullAddress}</span></div>}
          {personalInfo.phone && <div className="flex items-center gap-1.5"><Phone size={12} /><span>{personalInfo.phone}</span></div>}
          {personalInfo.email && <div className="flex items-center gap-1.5"><Mail size={12} /><span>{personalInfo.email}</span></div>}
        </div>
      </header>

      <main className="space-y-4">
        <Section title="Summary">
          {summary ? (
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          ) : (
            <p className="text-gray-400 italic">Your professional summary will appear here.</p>
          )}
        </Section>

        <Section title="Education">
          {hasEducation ? (
            education.map((edu) => {
              const gradDate = edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
              return (
                <div key={edu.id} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-base font-bold">{edu.degree || 'Degree'}</h3>
                    <p className="text-xs text-gray-600 font-medium">{gradDate || 'Date'}</p>
                  </div>
                  <p className="text-sm italic">{edu.school || 'University Name'}, {edu.fieldOfStudy || 'Field of Study'}</p>
                </div>
              );
            })
          ) : (
            <p className="text-gray-400 italic">Your education details will appear here.</p>
          )}
        </Section>
        
        <Section title="Research Experience" show={hasExperience}>
          <div className="space-y-3">
            {experience.map((job) => (
              <div key={job.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-base font-bold">{job.role || 'Research Position'}</h3>
                  <p className="text-xs text-gray-600 font-medium">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                </div>
                <p className="text-sm italic">{job.company || 'Institution Name'}</p>
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
                  {job.description || '* Your research description will appear here.'}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </Section>
        
        <Section title="Publications" show={hasCustomSections && customSections.some(s => s.title.toLowerCase().includes('publication'))}>
          {customSections.filter(s => s.title.toLowerCase().includes('publication')).map(section => (
            <ReactMarkdown key={section.id} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
              {section.content || 'Your publications will appear here.'}
            </ReactMarkdown>
          ))}
        </Section>
        
        <Section title="Teaching Experience" show={hasCustomSections && customSections.some(s => s.title.toLowerCase().includes('teaching'))}>
          {customSections.filter(s => s.title.toLowerCase().includes('teaching')).map(section => (
             <ReactMarkdown key={section.id} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
              {section.content || 'Your teaching experience will appear here.'}
            </ReactMarkdown>
          ))}
        </Section>
        
        <Section title="Skills">
          {hasSkills ? (
            <p className="text-gray-700">{skills.join(' • ')}</p>
          ) : (
            <p className="text-gray-400 italic">Your skills will appear here.</p>
          )}
        </Section>
        
        <Section title="Awards and Honors" show={hasAwards}>
          <ul className="list-disc list-inside space-y-1">
            {awards.map((award) => (
              <li key={award.id}>{award.name}, {award.date}</li>
            ))}
          </ul>
        </Section>
      </main>
    </div>
  );
};
