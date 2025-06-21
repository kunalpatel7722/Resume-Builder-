import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';

export interface TemplateProps {
  data: ResumeData;
  accentColor?: string;
}

export const AcademicTemplate: React.FC<TemplateProps> = ({ data, accentColor: accentColorProp }) => {
  const { personalInfo, summary, experience, education, skills, certifications, customSections } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');
  const publications = customSections.filter(s => s.title.toLowerCase().includes('publication'));
  const researchExperience = experience.filter(e => e.role.toLowerCase().includes('research'));
  const teachingExperience = experience.filter(e => e.role.toLowerCase().includes('teaching'));


  const palette = { accent: '#2C3E50', text: '#111111', muted: '#555555', line: '#CCCCCC', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;

  const hasContent = (arr: any[], ...fields: string[]) => arr.some(item => fields.some(field => item[field]));
  
  const hasResearch = hasContent(researchExperience, 'role', 'company', 'description');
  const hasTeaching = hasContent(teachingExperience, 'role', 'company', 'description');
  const hasEducation = hasContent(education, 'school', 'degree', 'fieldOfStudy');
  const hasSkills = skills.some(s => s);
  const hasCertifications = hasContent(certifications, 'name', 'issuer');
  const hasPublications = hasContent(publications, 'content');

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'yyyy')}`;
    return start;
  };

  const Section: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-[var(--fs-h2)] font-bold tracking-wide border-b pb-1 mb-3" style={{ color: accentColor, borderColor: palette.line }}>{title}</h2>
        <div className="space-y-4">{children}</div>
      </section>
    );
  };

  return (
    <div className="bg-white text-[var(--fs-body)] p-8 w-full h-full" style={{ fontFamily: "'Merriweather Sans', sans-serif" }}>
      <header className="text-center mb-6">
        <h1 className="text-[var(--fs-name)] font-bold" style={{ fontFamily: "'Merriweather', serif" }}>{fullName || 'Your Name'}</h1>
        <p className="text-[var(--fs-h3)] text-gray-600 mt-1">{experience[0]?.role || 'Academic Title'}</p>
        <div className="text-[var(--fs-small)] text-gray-600 mt-2">
          <span>{fullAddress || 'Address'}</span>
          <span className="mx-2">&bull;</span>
          <span>{personalInfo.phone || 'Phone'}</span>
          <span className="mx-2">&bull;</span>
          <span>{personalInfo.email || 'Email'}</span>
        </div>
      </header>

      <main className="space-y-5">
        <Section title="Summary">
          <p className="leading-relaxed">{summary || 'Your professional summary will appear here.'}</p>
        </Section>
        
        <Section title="Education" show={hasEducation}>
          {education.map((edu) => {
            const gradDate = edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
            return (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[var(--fs-h3)] font-bold">{edu.degree || 'Degree'}</h3>
                  <p className="text-[var(--fs-small)] font-medium text-gray-600">{gradDate || 'Date'}</p>
                </div>
                <p className="font-semibold" style={{fontFamily: "'Merriweather', serif"}}>{edu.school || 'University Name'}</p>
                <p className="italic text-gray-700">{edu.fieldOfStudy || 'Field of Study'}</p>
              </div>
            );
          })}
        </Section>
        
        <Section title="Research Experience" show={hasResearch}>
          {researchExperience.map((job) => (
            <div key={job.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="text-[var(--fs-h3)] font-bold">{job.role || 'Research Position'}</h3>
                <p className="text-[var(--fs-small)] font-medium text-gray-600">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
              </div>
              <p className="font-semibold italic">{job.company || 'Institution Name'}</p>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
                {job.description || '* Your research description will appear here.'}
              </ReactMarkdown>
            </div>
          ))}
        </Section>

        <Section title="Teaching Experience" show={hasTeaching}>
          {teachingExperience.map((job) => (
            <div key={job.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="text-[var(--fs-h3)] font-bold">{job.role || 'Teaching Position'}</h3>
                <p className="text-[var(--fs-small)] font-medium text-gray-600">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
              </div>
              <p className="font-semibold italic">{job.company || 'Institution Name'}</p>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
                {job.description || '* Your teaching description will appear here.'}
              </ReactMarkdown>
            </div>
          ))}
        </Section>
        
        <Section title="Publications" show={hasPublications}>
          {publications.map(section => (
            <ReactMarkdown key={section.id} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
              {section.content || 'Your publications will appear here.'}
            </ReactMarkdown>
          ))}
        </Section>
        
        <Section title="Skills" show={hasSkills}>
          <p>{skills.join(' • ')}</p>
        </Section>
        
        <Section title="Certifications" show={hasCertifications}>
          <ul className="list-disc list-inside">
            {certifications.map(cert => (
              <li key={cert.id}>{cert.name}, {cert.issuer} ({cert.date})</li>
            ))}
          </ul>
        </Section>
      </main>
    </div>
  );
};
