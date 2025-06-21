
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Star, GanttChartSquare, CheckSquare } from 'lucide-react';

export const ProjectManagerTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');

  return (
    <div className="bg-white text-gray-800 w-full h-full font-sans flex text-sm">
        <aside className="w-1/3 bg-gray-50 p-6 flex flex-col space-y-6">
            <header>
                <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">{fullName || 'Your Name'}</h1>
                <h2 className="text-lg text-primary font-semibold mt-1">{experience[0]?.role || 'Project Manager'}</h2>
            </header>
            <section>
                 <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Contact</h3>
                 <div className="space-y-1.5 text-gray-600 text-xs">
                    {personalInfo.email && <p className="flex items-center gap-2"><Mail size={14}/> {personalInfo.email}</p>}
                    {personalInfo.phone && <p className="flex items-center gap-2"><Phone size={14}/> {personalInfo.phone}</p>}
                    {fullAddress && <p className="flex items-center gap-2"><MapPin size={14}/> {fullAddress}</p>}
                </div>
            </section>
            {skills.length > 0 && (
                <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Core Competencies</h3>
                    <ul className="space-y-1.5 text-xs">
                        {skills.filter(skill => skill).map((skill, index) => (
                            <li key={index} className="flex items-center gap-2"><CheckSquare size={14} className="text-primary"/>{skill}</li>
                        ))}
                    </ul>
                </section>
            )}
            {education.length > 0 && education[0]?.school && (
                <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Education</h3>
                    {education.map((edu) => (
                        <div key={edu.id} className="text-xs">
                            <h4 className="font-bold">{edu.school || 'School Name'}</h4>
                            <p className="text-gray-700">{edu.degree || 'Degree'}</p>
                            <p className="text-gray-500">{edu.dates || 'Dates'}</p>
                        </div>
                    ))}
                </section>
            )}
        </aside>

        <main className="w-2/3 p-8">
            {summary && (
              <section className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 pb-1 border-b-2 border-gray-200 mb-2">Career Summary</h2>
                <p className="text-gray-600 leading-relaxed text-sm">{summary}</p>
              </section>
            )}

            {experience.length > 0 && experience[0]?.role && (
              <section>
                <h2 className="text-xl font-bold text-gray-800 pb-1 border-b-2 border-gray-200 mb-3 flex items-center gap-2"><GanttChartSquare size={20}/>Project Experience</h2>
                <div className="space-y-4">
                  {experience.map((job) => (
                    <div key={job.id}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-base font-bold text-gray-900">{job.role || 'Job Title'}</h3>
                        <p className="text-xs text-gray-500 font-medium">{job.dates || 'Dates'}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-700">{job.company || 'Company Name'}</p>
                      <ul className="mt-2 text-gray-600 space-y-1 text-sm list-disc list-outside pl-4">
                        {job.description.split('\n').filter(line => line.trim() !== '').map((desc, i) => (
                          <li key={i}>{desc.replace(/^•\s*/, '')}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}
        </main>
    </div>
  );
};
