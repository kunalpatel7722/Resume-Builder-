
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Smile, Star, Heart, MessageSquare, Award, Globe } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';

export const CustomerServiceTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, languages, certifications } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return 'Dates';
    const start = format(startDate, 'MMM yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'MMM yyyy')}`;
    return start;
  };

  return (
    <div className="bg-white text-gray-800 p-8 w-full h-full font-['Roboto',_sans-serif] text-sm">
      <header className="flex items-center justify-between mb-6 pb-4 border-b-2 border-primary/50">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{fullName || 'Your Name'}</h1>
          <h2 className="text-lg font-medium text-primary">{experience[0]?.role || 'Customer Service Professional'}</h2>
        </div>
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Smile className="h-10 w-10 text-primary" />
        </div>
      </header>

      <div className="grid grid-cols-3 gap-8">
        <main className="col-span-2 space-y-6">
          {summary && (
            <section>
              <h3 className="text-md font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-2"><MessageSquare size={16} /> Summary</h3>
              <p className="text-gray-600 leading-relaxed">{summary}</p>
            </section>
          )}
          {experience.length > 0 && experience[0]?.role && (
            <section>
              <h3 className="text-md font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-2"><Heart size={16}/> Professional Experience</h3>
              {experience.map((job) => {
                const location = [job.city, job.state].filter(Boolean).join(', ');
                return (
                  <div key={job.id} className="mb-4">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-md font-bold text-gray-800">{job.role || 'Job Title'}</h4>
                      <p className="text-xs text-gray-500">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                    </div>
                    <p className="text-sm font-semibold text-primary">{job.company || 'Company Name'}{location && ` | ${location}`}</p>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-600">
                        {job.description}
                    </ReactMarkdown>
                  </div>
                )
              })}
            </section>
          )}
        </main>
        <aside className="col-span-1 space-y-6">
           <section>
                <h3 className="text-md font-bold uppercase tracking-wider text-gray-700 mb-3">Contact</h3>
                <div className="space-y-2 text-xs">
                    {personalInfo.email && <p className="flex items-center gap-2"><Mail size={14}/> {personalInfo.email}</p>}
                    {personalInfo.phone && <p className="flex items-center gap-2"><Phone size={14}/> {personalInfo.phone}</p>}
                    {fullAddress && <p className="flex items-center gap-2"><MapPin size={14}/> {fullAddress}</p>}
                </div>
           </section>
           <section>
                <h3 className="text-md font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-2"><Star size={16} /> Skills</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                    {skills.filter(skill => skill).map((skill, index) => (
                        <li key={index} className="bg-primary/10 rounded-md px-2 py-1">{skill}</li>
                    ))}
                </ul>
           </section>
           {education.length > 0 && education[0]?.school && (
            <section>
              <h3 className="text-md font-bold uppercase tracking-wider text-gray-700 mb-3">Education</h3>
              {education.map((edu) => {
                const gradDate = edu.isStillEnrolled 
                    ? 'Enrolled' 
                    : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
                return (
                  <div key={edu.id} className="mb-2">
                     <h4 className="text-md font-bold text-gray-800">{edu.degree || 'Degree'}</h4>
                     <p className="text-sm font-semibold text-primary">{edu.school || 'School Name'}</p>
                     <p className="text-xs text-gray-500">{gradDate || 'Date'}</p>
                  </div>
                )
              })}
            </section>
          )}
          {certifications.length > 0 && (
            <section>
              <h3 className="text-md font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-2"><Award size={16} /> Certifications</h3>
              {certifications.map((cert) => (
                <div key={cert.id} className="mb-2">
                   <h4 className="text-md font-bold text-gray-800">{cert.name || 'Certification Name'}</h4>
                   <p className="text-sm font-semibold text-primary">{cert.issuer || 'Issuing Body'}</p>
                   <p className="text-xs text-gray-500">{cert.date || 'Date'}</p>
                </div>
              ))}
            </section>
          )}
          {languages.length > 0 && (
            <section>
              <h3 className="text-md font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-2"><Globe size={16} /> Languages</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                {languages.map((lang) => (
                    <li key={lang.id} className="bg-primary/10 rounded-md px-2 py-1">{lang.name} - {lang.level}</li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
};
