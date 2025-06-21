
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Star, Megaphone, LineChart } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const MarketingTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');

  return (
    <div className="bg-white text-gray-800 w-full h-full font-sans flex text-sm">
        <aside className="w-1/3 bg-primary/5 p-6 flex flex-col justify-between">
            <div>
                <header className="text-left mb-8">
                    <h1 className="text-3xl font-bold text-primary">{fullName || 'Your Name'}</h1>
                    <h2 className="text-lg text-gray-700">{experience[0]?.role || 'Marketing Specialist'}</h2>
                </header>

                {skills.length > 0 && (
                    <section>
                        <h3 className="text-md font-semibold uppercase tracking-wider mb-3 flex items-center gap-2"><Star size={16} /> Core Competencies</h3>
                        <ul className="flex flex-wrap gap-1.5">
                            {skills.filter(skill => skill).map((skill, index) => (
                                <li key={index} className="bg-primary/10 text-primary-focus text-xs font-medium px-2 py-1 rounded-full">{skill}</li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>

            <div className="space-y-4 text-xs">
                {personalInfo.email && <div className="flex items-center gap-2"><Mail size={14} className="text-primary"/><span>{personalInfo.email}</span></div>}
                {personalInfo.phone && <div className="flex items-center gap-2"><Phone size={14} className="text-primary"/><span>{personalInfo.phone}</span></div>}
                {fullAddress && <div className="flex items-center gap-2"><MapPin size={14} className="text-primary"/><span>{fullAddress}</span></div>}
            </div>
        </aside>

        <main className="w-2/3 p-8 space-y-6">
             {summary && (
              <section>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-2"><Megaphone size={18}/> Career Summary</h3>
                <p className="text-gray-600 leading-relaxed border-l-4 border-primary/20 pl-4">{summary}</p>
              </section>
            )}
            
            {experience.length > 0 && experience[0]?.role && (
              <section>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3"><Briefcase size={18}/> Professional Experience</h3>
                <div className="space-y-4">
                  {experience.map((job) => {
                    const location = [job.city, job.state].filter(Boolean).join(', ');
                    return (
                      <div key={job.id}>
                        <div className="flex justify-between items-baseline">
                          <h4 className="text-md font-bold text-gray-800">{job.role || 'Job Title'}</h4>
                          <p className="text-xs text-gray-500">{job.dates || 'Dates'}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-600 italic">{job.company || 'Company Name'}{location && ` - ${location}`}</p>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm max-w-none text-gray-600">
                            {job.description}
                        </ReactMarkdown>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {education.length > 0 && education[0]?.school && (
              <section>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3"><GraduationCap size={18}/>Education</h3>
                 <div className="space-y-2">
                    {education.map((edu) => (
                      <div key={edu.id}>
                         <h4 className="text-md font-bold text-gray-800">{edu.degree || 'Degree'}</h4>
                         <p className="text-sm text-gray-600 italic">{edu.school || 'School Name'} - {edu.dates || 'Dates'}</p>
                      </div>
                    ))}
                 </div>
              </section>
            )}
        </main>
    </div>
  );
};
