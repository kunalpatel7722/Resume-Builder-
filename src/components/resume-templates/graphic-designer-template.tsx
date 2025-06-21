
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Star, Palette, Dribbble, Brush } from 'lucide-react';

export const GraphicDesignerTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills } = data;

  return (
    <div className="bg-white text-gray-800 w-full h-full font-sans flex text-sm">
        <aside className="w-1/3 bg-gray-100 p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center ring-4 ring-primary/20">
                <Brush className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{personalInfo.name || 'Your Name'}</h1>
            <h2 className="text-md text-primary font-light tracking-widest">{experience[0]?.role || 'Graphic Designer'}</h2>
            
            <div className="space-y-6 mt-8 text-left w-full">
                <section>
                    <h3 className="font-bold text-sm uppercase tracking-wider mb-2">Contact</h3>
                    <div className="space-y-2 text-xs text-gray-600">
                        {personalInfo.email && <p className="truncate">{personalInfo.email}</p>}
                        {personalInfo.phone && <p>{personalInfo.phone}</p>}
                        {personalInfo.address && <p>{personalInfo.address}</p>}
                    </div>
                </section>
                 {skills.length > 0 && (
                    <section>
                        <h3 className="font-bold text-sm uppercase tracking-wider mb-2">Tools</h3>
                        <div className="flex flex-wrap gap-2">
                            {skills.filter(skill => skill).map((skill, index) => (
                                <span key={index} className="text-primary-focus text-xs font-semibold">{skill}</span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </aside>

        <main className="w-2/3 p-8">
            {summary && (
              <section className="mb-6">
                <p className="text-gray-600 leading-relaxed text-lg italic text-center">"{summary}"</p>
              </section>
            )}

            {experience.length > 0 && experience[0]?.role && (
              <section className="mb-6">
                <h2 className="text-lg font-bold uppercase tracking-wider text-primary flex items-center gap-2 mb-3"><Briefcase size={18}/>Experience</h2>
                <div className="space-y-4 relative border-l-2 border-primary/20 pl-6">
                  {experience.map((job) => (
                    <div key={job.id} className="relative">
                       <div className="absolute -left-[30px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-gray-100"></div>
                      <h3 className="text-base font-bold text-gray-900">{job.role || 'Job Title'}</h3>
                      <p className="text-sm font-semibold text-gray-700">{job.company || 'Company Name'} / <span className="text-xs font-normal text-gray-500">{job.dates || 'Dates'}</span></p>
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

             {education.length > 0 && education[0]?.school && (
              <section>
                <h2 className="text-lg font-bold uppercase tracking-wider text-primary flex items-center gap-2 mb-3"><GraduationCap size={18}/>Education</h2>
                 {education.map((edu) => (
                   <div key={edu.id}>
                     <h3 className="text-base font-bold text-gray-900">{edu.school || 'University'}</h3>
                     <p className="text-sm text-gray-700">{edu.degree || 'Degree'} - {edu.dates || 'Dates'}</p>
                   </div>
                 ))}
              </section>
            )}
        </main>
    </div>
  );
};
