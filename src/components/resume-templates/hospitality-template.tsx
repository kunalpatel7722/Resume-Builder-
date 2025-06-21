
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Star, Smile, Building } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const HospitalityTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');

  return (
    <div className="bg-white text-gray-800 p-8 w-full h-full font-['Garamond',_serif] text-base">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold">{fullName || 'Your Name'}</h1>
        <p className="text-lg text-gray-600 mt-1">{experience[0]?.role || 'Hospitality Manager'}</p>
        <div className="text-sm text-gray-500 mt-3 border-t border-gray-200 pt-2">
          {personalInfo.phone} &nbsp;&bull;&nbsp; {personalInfo.email} &nbsp;&bull;&nbsp; {fullAddress}
        </div>
      </header>
      
      <main className="space-y-6">
        {summary && (
          <section>
            <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-2">PROFESSIONAL SUMMARY</h2>
            <p className="text-gray-700 leading-snug">{summary}</p>
          </section>
        )}

        {experience.length > 0 && experience[0]?.role && (
          <section>
            <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">EXPERIENCE</h2>
            {experience.map((job) => {
              const location = [job.city, job.state].filter(Boolean).join(', ');
              return (
                <div key={job.id} className="mb-4">
                    <div className="flex justify-between items-baseline">
                        <h3 className="text-lg font-semibold">{job.company || 'Hotel / Restaurant Name'}{location && `, ${location}`}</h3>
                        <p className="text-sm text-gray-600">{job.dates || 'Dates'}</p>
                    </div>
                    <p className="text-md italic">{job.role || 'Job Title'}</p>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-base max-w-none prose-serif text-gray-700">
                      {job.description}
                    </ReactMarkdown>
                </div>
              )
            })}
          </section>
        )}

        {education.length > 0 && education[0]?.school && (
          <section>
            <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-2">EDUCATION</h2>
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-semibold">{edu.school || 'University Name'}</h3>
                    <p className="text-md italic">{edu.degree || 'Degree'}</p>
                </div>
                <p className="text-sm text-gray-600">{edu.dates || 'Dates'}</p>
              </div>
            ))}
          </section>
        )}

        {skills.length > 0 && (
           <section>
            <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-2">KEY SKILLS</h2>
            <div className="columns-2">
                {skills.filter(skill => skill).map((skill, index) => (
                    <p key={index} className="text-gray-700 mb-1">{skill}</p>
                ))}
            </div>
           </section>
        )}
      </main>
    </div>
  );
};
