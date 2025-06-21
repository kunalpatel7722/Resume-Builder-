
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Star, Code, Github, Linkedin, Globe } from 'lucide-react';

export const SoftwareEngineerTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills } = data;

  return (
    <div className="bg-white text-gray-800 p-8 w-full h-full font-sans text-sm">
      <header className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-4xl font-bold text-gray-900">{personalInfo.name || 'Your Name'}</h1>
            <h2 className="text-lg text-primary font-mono">{experience[0]?.role || 'Software Engineer'}</h2>
        </div>
        <div className="text-xs text-right space-y-1">
            <p className="flex items-center justify-end gap-2"><Mail size={14}/> {personalInfo.email}</p>
            <p className="flex items-center justify-end gap-2"><Phone size={14}/> {personalInfo.phone}</p>
            <p className="flex items-center justify-end gap-2"><Globe size={14}/> {personalInfo.address}</p>
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
              {experience.map((job) => (
                <div key={job.id} className="grid grid-cols-4 gap-4">
                  <div className="col-span-1 text-xs text-gray-600">
                    <p className="font-semibold">{job.company || 'Company Name'}</p>
                    <p>{job.dates || 'Dates'}</p>
                  </div>
                  <div className="col-span-3">
                    <h4 className="font-bold text-md text-gray-800">{job.role || 'Job Title'}</h4>
                    <ul className="mt-1 text-gray-700 space-y-1 list-disc list-outside pl-4">
                      {job.description.split('\n').filter(line => line.trim() !== '').map((desc, i) => (
                        <li key={i}>{desc.replace(/^•\s*/, '')}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && education[0]?.school && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 mt-4">Education</h3>
             <div className="space-y-2">
                {education.map((edu) => (
                    <div key={edu.id} className="grid grid-cols-4 gap-4">
                        <div className="col-span-1 text-xs text-gray-600">
                             <p className="font-semibold">{edu.school || 'University'}</p>
                             <p>{edu.dates || 'Dates'}</p>
                        </div>
                        <div className="col-span-3">
                           <p className="font-semibold text-md text-gray-800">{edu.degree || 'Degree'}</p>
                        </div>
                    </div>
                ))}
             </div>
          </section>
        )}
      </main>
    </div>
  );
};
