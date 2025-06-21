import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';
import { HeartPulse, Stethoscope, Award, GraduationCap } from 'lucide-react';

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
  const { personalInfo, summary, experience, education, skills, certifications, languages } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');

  const hasExperience = experience.some(e => e.role || e.company || e.description);
  const hasEducation = education.some(e => e.school || e.degree || e.fieldOfStudy);
  const hasSkills = skills.some(s => s);
  const hasCertifications = certifications.some(c => c.name);
  const hasLanguages = languages.some(l => l.name);

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'MM/yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'MM/yyyy')}`;
    return start;
  };

  const fontClass = fontClasses[fontSize];
  
  const Section: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode; show?: boolean }> = ({ title, icon: Icon, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-base font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: accentColor }}>
          <Icon size={18} />
          {title}
        </h2>
        <div className="pl-7 space-y-3">{children}</div>
      </section>
    );
  };

  return (
    <div className={cn("bg-white text-gray-800 p-8 w-full h-full", fontClass)} style={{ fontFamily: "'Nunito', sans-serif" }}>
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold">{fullName || 'Your Name'}</h1>
        <h2 className="text-lg font-semibold" style={{ color: accentColor }}>{hasExperience ? experience[0]?.role : 'Healthcare Professional'}</h2>
        <p className="text-xs text-gray-500 mt-2">{personalInfo.email} &bull; {personalInfo.phone} &bull; {fullAddress}</p>
      </header>
      
      <div className="w-full h-px bg-gray-200 mb-6" />

      <main className="space-y-5">
        <Section title="Professional Profile" icon={HeartPulse}>
          {summary ? (
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          ) : (
            <p className="text-gray-400 italic">Your professional summary will appear here.</p>
          )}
        </Section>
        
        <Section title="Clinical Experience" icon={Stethoscope} show={hasExperience}>
            {experience.map(job => (
              <div key={job.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-base font-bold">{job.role || 'Job Title'}</h3>
                  <p className="text-xs text-gray-500 font-medium">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                </div>
                <p className="text-sm font-semibold italic text-gray-600">{job.company || 'Hospital / Clinic Name'}</p>
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
                  {job.description || '* Your job description will appear here.'}
                </ReactMarkdown>
              </div>
            ))}
        </Section>
        
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          <Section title="Education" icon={GraduationCap} show={hasEducation}>
            {education.map(edu => (
                <div key={edu.id}>
                    <h3 className="text-sm font-bold">{edu.degree || 'Degree'}</h3>
                    <p className="text-xs text-gray-600">{edu.school || 'University'}</p>
                    <p className="text-xs text-gray-500">{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                </div>
            ))}
          </Section>
          
          <Section title="Licenses & Certifications" icon={Award} show={hasCertifications}>
             {certifications.map(cert => (
                <div key={cert.id}>
                    <h3 className="text-sm font-bold">{cert.name || 'Certification Name'}</h3>
                    <p className="text-xs text-gray-600">{cert.issuer}, {cert.date}</p>
                </div>
            ))}
          </Section>
        </div>

        <Section title="Skills">
            {hasSkills ? (
                <p className="text-gray-700 text-sm">{skills.join(' • ')}</p>
            ): (
                <p className="text-gray-400 italic">Your skills will appear here.</p>
            )}
        </Section>
        
        <Section title="Languages" show={hasLanguages}>
            <p className="text-gray-700 text-sm">{languages.map(l => `${l.name} (${l.level})`).join(', ')}</p>
        </Section>
      </main>
    </div>
  );
};
