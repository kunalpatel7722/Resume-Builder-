
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Star } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';

interface ModernTemplateProps {
  data: ResumeData;
}

export const ModernTemplate: React.FC<ModernTemplateProps> = ({ data }) => {
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
    <div className="bg-white text-gray-800 p-8 shadow-lg w-full h-full font-sans text-sm">
      <header className="text-center mb-8 border-b-2 border-gray-300 pb-4">
        <h1 className="text-4xl font-bold tracking-wider uppercase text-gray-800">{fullName || 'Your Name'}</h1>
        <div className="flex justify-center items-center gap-x-4 gap-y-1 text-xs text-gray-600 mt-2 flex-wrap">
          {personalInfo.email && <div className="flex items-center gap-1"><Mail size={12} /><span>{personalInfo.email}</span></div>}
          {personalInfo.phone && <div className="flex items-center gap-1"><Phone size={12} /><span>{personalInfo.phone}</span></div>}
          {fullAddress && <div className="flex items-center gap-1"><MapPin size={12} /><span>{fullAddress}</span></div>}
        </div>
      </header>

      <main>
        {summary && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-gray-700 border-b border-gray-200 pb-1 mb-2">Summary</h2>
            <p className="text-gray-600 leading-relaxed">{summary}</p>
          </section>
        )}

        {experience.length > 0 && experience[0]?.role && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-gray-700 border-b border-gray-200 pb-1 mb-3 flex items-center gap-2"><Briefcase size={18}/> Work Experience</h2>
            {experience.map((job) => {
              const location = [job.city, job.state].filter(Boolean).join(', ');
              return (
                <div key={job.id} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-md font-bold text-gray-800">{job.role || 'Job Title'}</h3>
                    <p className="text-xs text-gray-500">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-600 italic">
                    {job.company || 'Company Name'}{location && ` | ${location}`}
                  </p>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-600">
                    {job.description}
                  </ReactMarkdown>
                </div>
              )
            })}
          </section>
        )}

        {education.length > 0 && education[0]?.school && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-gray-700 border-b border-gray-200 pb-1 mb-3 flex items-center gap-2"><GraduationCap size={18}/> Education</h2>
            {education.map((edu) => {
              const gradDate = edu.isStillEnrolled 
                ? 'Enrolled' 
                : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
              return (
                <div key={edu.id} className="mb-2">
                   <div className="flex justify-between items-baseline">
                      <h3 className="text-md font-bold text-gray-800">{edu.degree || 'Degree'}</h3>
                      <p className="text-xs text-gray-500">{gradDate || 'Date'}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-600 italic">{edu.school || 'School Name'}</p>
                </div>
              )
            })}
          </section>
        )}

        {skills.length > 0 && (
           <section>
            <h2 className="text-lg font-semibold uppercase tracking-wide text-gray-700 border-b border-gray-200 pb-1 mb-3 flex items-center gap-2"><Star size={18}/> Skills</h2>
            <div className="flex flex-wrap gap-2">
                {skills.filter(skill => skill).map((skill, index) => (
                    <span key={index} className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">{skill}</span>
                ))}
            </div>
           </section>
        )}

      </main>
    </div>
  );
};
