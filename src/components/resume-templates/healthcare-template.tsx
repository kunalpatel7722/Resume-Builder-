import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { HeartPulse, Stethoscope, Award, GraduationCap } from 'lucide-react';

export interface TemplateProps {
  data: ResumeData;
  accentColor?: string;
}

export const HealthcareTemplate: React.FC<TemplateProps> = ({ data, accentColor: accentColorProp }) => {
  const { personalInfo, summary, experience, education, skills, certifications, languages } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');

  const palette = { accent: '#4CAF50', accentSoft: '#E8F5E9', text: '#1F1F1F', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;

  const hasContent = (arr: any[], ...fields: string[]) => arr.some(item => fields.some(field => item[field]));

  const hasExperience = hasContent(experience, 'role', 'company', 'description');
  const hasEducation = hasContent(education, 'school', 'degree');
  const hasSkills = skills.length > 0;
  const hasCertifications = hasContent(certifications, 'name');
  const hasLanguages = hasContent(languages, 'name');

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'MM/yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'MM/yyyy')}`;
    return start;
  };

  const Section: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode; show?: boolean }> = ({ title, icon: Icon, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-[var(--fs-h2)] font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: accentColor }}>
          <Icon size={20} />
          {title}
        </h2>
        <div className="pl-8 space-y-3">{children}</div>
      </section>
    );
  };

  return (
    <div className="bg-white text-[var(--fs-body)] p-8 w-full h-full" style={{ fontFamily: "'Nunito', sans-serif", color: palette.text }}>
      <header className="text-center mb-6">
        <h1 className="text-[var(--fs-name)] font-bold">{fullName || 'Your Name'}</h1>
        <h2 className="text-[var(--fs-h3)] font-semibold" style={{ color: accentColor }}>{experience[0]?.role || 'Healthcare Professional'}</h2>
        <p className="text-[var(--fs-small)] text-gray-500 mt-2">{personalInfo.email} &bull; {personalInfo.phone} &bull; {fullAddress}</p>
      </header>
      
      <div className="w-full h-px bg-gray-200 mb-6" />

      <main className="space-y-5">
        <Section title="Professional Profile" icon={HeartPulse}>
          <p className="leading-relaxed">{summary || 'Your professional summary will appear here.'}</p>
        </Section>
        
        <Section title="Clinical Experience" icon={Stethoscope} show={hasExperience}>
            {experience.map(job => (
              <div key={job.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[var(--fs-h3)] font-bold">{job.role || 'Job Title'}</h3>
                  <p className="text-[var(--fs-small)] text-gray-500 font-medium">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                </div>
                <p className="font-semibold italic text-gray-600">{job.company || 'Hospital / Clinic Name'}</p>
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                  {job.description || '* Your job description will appear here.'}
                </ReactMarkdown>
              </div>
            ))}
        </Section>
        
        <div className="grid grid-cols-2 gap-x-8 gap-y-5 pt-2">
          <Section title="Education" icon={GraduationCap} show={hasEducation}>
            {education.map(edu => (
                <div key={edu.id}>
                    <h3 className="text-[var(--fs-h3)] font-bold">{edu.degree || 'Degree'}</h3>
                    <p className="text-[var(--fs-body)] text-gray-600">{edu.school || 'University'}</p>
                    <p className="text-[var(--fs-small)] text-gray-500">{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                </div>
            ))}
          </Section>
          
          <Section title="Licenses & Certifications" icon={Award} show={hasCertifications}>
             {certifications.map(cert => (
                <div key={cert.id}>
                    <h3 className="text-[var(--fs-h3)] font-bold">{cert.name || 'Certification Name'}</h3>
                    <p className="text-[var(--fs-small)] text-gray-600">{cert.issuer}, {cert.date}</p>
                </div>
            ))}
          </Section>
        </div>

        <Section title="Skills">
            <p className="text-[var(--fs-body)]">{hasSkills ? skills.join(' • ') : 'Your skills will appear here.'}</p>
        </Section>
        
        <Section title="Languages" show={hasLanguages}>
            <p className="text-[var(--fs-body)]">{languages.map(l => `${l.name} (${l.level})`).join(', ')}</p>
        </Section>
      </main>
    </div>
  );
};
