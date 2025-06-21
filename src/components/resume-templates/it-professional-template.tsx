
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Star, HardDrive, TerminalSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';

export const ItProfessionalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
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
    <div className="bg-white text-gray-800 p-8 w-full h-full font-['Source_Code_Pro',_monospace] text-sm">
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-primary">{`> ${fullName || 'YOUR_NAME'}`}</h1>
        <h2 className="text-lg text-gray-700">{experience[0]?.role || 'IT Professional'}</h2>
      </header>
      
      <div className="flex justify-between items-center text-xs bg-gray-100 p-2 rounded-md mb-6">
            <span>{personalInfo.email}</span>
            <span>{personalInfo.phone}</span>
            <span>{fullAddress}</span>
      </div>

      <main className="space-y-6">
        {summary && (
          <section>
            <h3 className="text-md font-bold text-primary flex items-center gap-2 mb-2"><TerminalSquare size={16} /> PROFILE_SUMMARY.md</h3>
            <p className="text-gray-600 leading-relaxed bg-gray-50 p-3 rounded">{summary}</p>
          </section>
        )}
        
        {experience.length > 0 && experience[0]?.role && (
          <section>
            <h3 className="text-md font-bold text-primary flex items-center gap-2 mb-3"><Briefcase size={16}/> EXPERIENCE.log</h3>
            <div className="space-y-4">
              {experience.map((job) => {
                const location = [job.city, job.state].filter(Boolean).join(', ');
                return (
                  <div key={job.id}>
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-md font-bold text-gray-800">{job.role || 'Job Title'} @ {job.company || 'Company'}{location && ` - ${location}`}</h4>
                      <p className="text-xs text-gray-500">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                    </div>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none prose-code text-gray-600">
                        {job.description}
                    </ReactMarkdown>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-6">
            {skills.length > 0 && (
            <section>
                <h3 className="text-md font-bold text-primary flex items-center gap-2 mb-3"><Star size={16}/> SKILLS.sh</h3>
                <div className="flex flex-wrap gap-2">
                    {skills.filter(skill => skill).map((skill, index) => (
                        <span key={index} className="bg-primary/10 text-primary-focus text-xs font-medium px-2 py-1 rounded">{skill}</span>
                    ))}
                </div>
            </section>
            )}

            {education.length > 0 && education[0]?.school && (
                <section>
                <h3 className="text-md font-bold text-primary flex items-center gap-2 mb-3"><GraduationCap size={16}/> EDUCATION.cfg</h3>
                {education.map((edu) => {
                  const gradDate = edu.isStillEnrolled 
                    ? 'Enrolled' 
                    : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
                  return (
                    <div key={edu.id} className="mb-2">
                      <h4 className="text-md font-bold text-gray-800">{edu.degree || 'Degree'}</h4>
                      <p className="text-sm text-gray-600">{edu.school || 'School Name'} ({gradDate || 'Date'})</p>
                    </div>
                  )
                })}
                </section>
            )}
        </div>
      </main>
    </div>
  );
};
