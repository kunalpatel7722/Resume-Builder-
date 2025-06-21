import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Star, Users, Award, Link as LinkIcon, MessageSquare } from 'lucide-react';
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
  const { personalInfo, summary, experience, education, skills, certifications, websites, customSections } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');

  const hasExperience = experience.some(e => e.role || e.company || e.description);
  const hasEducation = education.some(e => e.school || e.degree || e.fieldOfStudy);
  const hasSkills = skills.some(s => s);
  const hasCertifications = certifications.some(c => c.name);
  const hasWebsites = websites.some(w => w.url);
  const testimonials = customSections.filter(s => s.title.toLowerCase().includes('testimonial'));
  const hasTestimonials = testimonials.length > 0;

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'MMM yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'MMM yyyy')}`;
    return start;
  };

  const fontClass = fontClasses[fontSize];

  const Section: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-base font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>{title}</h2>
        {children}
      </section>
    );
  };

  return (
    <div className={cn("bg-white text-gray-800 w-full h-full flex", fontClass)} style={{ fontFamily: "'Karla', sans-serif" }}>
      <aside className="w-[33%] p-6 flex flex-col gap-6" style={{ backgroundColor: `${accentColor}1A` }}>
        <header>
          <h1 className="text-3xl font-bold text-gray-900">{fullName || 'Your Name'}</h1>
          <h2 className="text-lg font-medium" style={{ color: accentColor }}>{hasExperience ? experience[0]?.role : 'Customer Service Professional'}</h2>
        </header>

        <Section title="Contact">
          <div className="space-y-1.5 text-xs text-gray-700">
            {personalInfo.email && <div className="flex items-center gap-2"><Mail size={14} /><span>{personalInfo.email}</span></div>}
            {personalInfo.phone && <div className="flex items-center gap-2"><Phone size={14} /><span>{personalInfo.phone}</span></div>}
            {personalInfo.city && <div className="flex items-center gap-2"><MapPin size={14} /><span>{personalInfo.city}{personalInfo.state && `, ${personalInfo.state}`}</span></div>}
            {hasWebsites && websites.map(site => (
                <div key={site.id} className="flex items-center gap-2"><LinkIcon size={14} /><a href={site.url} className="hover:underline" style={{ color: accentColor }}>{site.label || site.url}</a></div>
            ))}
          </div>
        </Section>
        
        <Section title="Skills" show={hasSkills}>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, i) => <span key={i} className="text-xs bg-white text-gray-800 px-2 py-0.5 rounded-full border">{skill}</span>)}
          </div>
        </Section>
        
        <Section title="Education" show={hasEducation}>
            {education.map((edu) => {
              const gradDate = edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
              return (
                <div key={edu.id}>
                  <h3 className="font-bold text-sm">{edu.school || 'School Name'}</h3>
                  <p className="text-xs text-gray-600">{edu.degree || 'Degree'}</p>
                  <p className="text-xs text-gray-500">{gradDate || 'Date'}</p>
                </div>
              );
            })}
        </Section>

        <Section title="Certifications" show={hasCertifications}>
            {certifications.map((cert) => (
                <div key={cert.id}>
                  <h3 className="font-bold text-sm">{cert.name || 'Certification Name'}</h3>
                  <p className="text-xs text-gray-600">{cert.issuer}, {cert.date}</p>
                </div>
            ))}
        </Section>

      </aside>

      <main className="w-[67%] p-8 space-y-6">
        <Section title="Summary">
            {summary ? (
                <p className="text-gray-700 leading-relaxed">{summary}</p>
            ): (
                <p className="text-gray-400 italic">Your professional summary will appear here.</p>
            )}
        </Section>

        <Section title="Experience" show={hasExperience}>
          <div className="space-y-4">
            {experience.map(job => (
              <div key={job.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-base font-bold">{job.role || 'Job Title'}</h3>
                  <p className="text-xs text-gray-500">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                </div>
                <p className="text-sm font-semibold" style={{ color: accentColor }}>{job.company || 'Company Name'}</p>
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
                    {job.description || '* Your job description will appear here.'}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </Section>
        
        <Section title="Testimonials" show={hasTestimonials}>
          <div className="space-y-3">
            {testimonials.map(section => (
                <div key={section.id} className="bg-gray-50 p-3 rounded-lg border-l-4" style={{borderColor: accentColor}}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700 italic">
                        {section.content || '"Your testimonial content will appear here."'}
                    </ReactMarkdown>
                </div>
            ))}
          </div>
        </Section>
      </main>
    </div>
  );
};
