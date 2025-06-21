
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Star, Code, Github, Linkedin, Globe } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';

export const SoftwareEngineerTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills } = data;
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
    <div className="bg-white text-gray-800 p-8 w-full h-full font-sans text-sm">
      <header className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-4xl font-bold text-gray-900">{fullName || 'Your Name'}</h1>
            <h2 className="text-lg text-primary font-mono">{experience[0]?.role || 'Software Engineer'}</h2>
        </div>
        <div className="text-xs text-right space-y-1">
            <p className="flex items-center justify-end gap-2"><Mail size={14}/> {personalInfo.email}</p>
            <p className="flex items-center justify-end gap-2"><Phone size={14}/> {personalInfo.phone}</p>
            {fullAddress && <p className="flex items-center justify-end gap-2"><Globe size={14}/> {fullAddress}</p>}
        </div>
      </header>
      
      <main className="space-y-6">
        {skills.length > 0 && (
           <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
                {skills.filter(skill => skill).map((skill, index) => (
                    <span key={index} className="text-sm text-gray-700 font-mono">{skill}</span>
                ))}
            </div>
           </section>
        )}
        
        {experience.length > 0 && experience[0]?.role && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 mt-4">Experience</h3>
            <div className="space-y-5">
              {experience.map((job) => {
                const location = [job.city, job.state].filter(Boolean).join(', ');
                return (
                  <div key={job.id} className="grid grid-cols-4 gap-4">
                    <div className="col-span-1 text-xs text-gray-600">
                      <p className="font-semibold">{job.company || 'Company Name'}{location && ` - ${location}`}</p>
                      <p>{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                    </div>
                    <div className="col-span-3">
                      <h4 className="font-bold text-md text-gray-800">{job.role || 'Job Title'}</h4>
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
                          {job.description}
                      </ReactMarkdown>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {education.length > 0 && education[0]?.school && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 mt-4">Education</h3>
             <div className="space-y-2">
                {education.map((edu) => {
                  const gradDate = edu.isStillEnrolled 
                    ? 'Enrolled' 
                    : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
                  return (
                    <div key={edu.id} className="grid grid-cols-4 gap-4">
                        <div className="col-span-1 text-xs text-gray-600">
                             <p className="font-semibold">{edu.school || 'University'}</p>
                             <p>{gradDate || 'Date'}</p>
                        </div>
                        <div className="col-span-3">
                           <p className="font-semibold text-md text-gray-800">{edu.degree || 'Degree'}</p>
                        </div>
                    </div>
                  )
                })}
             </div>
          </section>
        )}
      </main>
    </div>
  );
};
