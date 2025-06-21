
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { Mail, Phone, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TemplateProps {
  data: ResumeData;
  accentColor?: string;
  fontSize?: 'sm' | 'md' | 'lg';
}

export const CustomerServiceTemplate: React.FC<TemplateProps> = ({ data, accentColor: accentColorProp, fontSize }) => {
  const { personalInfo, summary, experience, education, skills, customSections } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const testimonials = customSections.filter(s => s.title.toLowerCase().includes('testimonial'));

  const palette = { accent: '#00838F', accentSoft: '#E0F7FA', text: '#1E1E1E', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;

  const hasContent = (arr: any[], ...fields: string[]) => Array.isArray(arr) && arr.some(item => item && fields.some(field => item[field]));
  
  const hasExperience = hasContent(experience, 'role', 'company', 'description');
  const hasEducation = hasContent(education, 'school', 'degree');
  const hasSkills = skills.length > 0;
  const hasTestimonials = hasContent(testimonials, 'content');

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'MMM yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'MMM yyyy')}`;
    return start;
  };

  const Section: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-[var(--fs-h2)] font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>{title}</h2>
        {children}
      </section>
    );
  };

  return (
    <div className={cn("bg-white text-[var(--fs-body)] w-full h-full flex font-body-karla", fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-base' : '')}>
      <aside className="w-[33%] p-6 flex flex-col gap-6" style={{ backgroundColor: palette.accentSoft }}>
        <header>
          <h1 className="text-[var(--fs-name)] font-bold text-gray-900">{fullName || 'Your Name'}</h1>
          <h2 className="text-[var(--fs-h3)] font-medium" style={{ color: accentColor }}>{experience[0]?.role || 'Customer Service Professional'}</h2>
        </header>

        <Section title="Contact">
          <div className="space-y-1.5 text-[var(--fs-small)]" style={{color: palette.text}}>
            {personalInfo.email && <div className="flex items-center gap-2"><Mail size={14} style={{color: accentColor}} /><span>{personalInfo.email}</span></div>}
            {personalInfo.phone && <div className="flex items-center gap-2"><Phone size={14} style={{color: accentColor}} /><span>{personalInfo.phone}</span></div>}
            {personalInfo.city && <div className="flex items-center gap-2"><MapPin size={14} style={{color: accentColor}} /><span>{personalInfo.city}{personalInfo.state && `, ${personalInfo.state}`}</span></div>}
          </div>
        </Section>
        
        <Section title="Skills">
          {hasSkills ? (
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, i) => <span key={i} className="text-[var(--fs-small)] bg-white text-gray-800 px-2 py-0.5 rounded-full border">{skill}</span>)}
            </div>
          ) : <p className="text-gray-400 italic text-[var(--fs-small)]">Your skills will appear here.</p>}
        </Section>
        
        <Section title="Education">
            {hasEducation ? (
              education.map((edu) => {
                const gradDate = edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
                return (
                  <div key={edu.id} className="mb-2">
                    <h3 className="font-bold text-[var(--fs-h3)]">{edu.school || 'School Name'}</h3>
                    <p className="text-[var(--fs-body)] text-gray-600">{edu.degree || 'Degree'}</p>
                    <p className="text-[var(--fs-small)] text-gray-500">{gradDate || 'Date'}</p>
                  </div>
                );
              })
            ) : <p className="text-gray-400 italic text-[var(--fs-small)]">Your education details will appear here.</p>}
        </Section>
      </aside>

      <main className="w-[67%] p-8 space-y-6">
        <Section title="Summary">
            {summary ? (
              <p className="leading-relaxed">{summary}</p>
            ) : <p className="leading-relaxed text-gray-400 italic">Your professional summary will appear here.</p>}
        </Section>

        <Section title="Experience">
          <div className="space-y-4">
            {hasExperience ? (
              experience.map(job => (
                <div key={job.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[var(--fs-h3)] font-bold">{job.role || 'Job Title'}</h3>
                    <p className="text-[var(--fs-small)] text-gray-500">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                  </div>
                  <p className="font-semibold" style={{ color: accentColor }}>{job.company || 'Company Name'}</p>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                      {job.description || '* Your job description will appear here.'}
                  </ReactMarkdown>
                </div>
              ))
            ) : <p className="text-gray-400 italic">Your work experience will appear here.</p>}
          </div>
        </Section>
        
        <Section title="Testimonials">
          <div className="space-y-3">
            {hasTestimonials ? (
              testimonials.map(section => (
                  <div key={section.id} className="bg-gray-50 p-3 rounded-lg border-l-4" style={{borderColor: accentColor}}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none italic">
                          {section.content || '"Your testimonial content will appear here."'}
                      </ReactMarkdown>
                  </div>
              ))
            ) : <p className="text-gray-400 italic">Your testimonials will appear here.</p>}
          </div>
        </Section>
      </main>
    </div>
  );
};
