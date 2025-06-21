
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Feather, BookOpen, PenTool } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const CreativeWriterTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');

  return (
    <div className="bg-white text-gray-900 p-10 w-full h-full font-['Lora',_serif] text-base">
      <header className="text-center mb-8">
        <div className="inline-block bg-primary/10 rounded-full p-2 mb-2">
            <Feather className="h-8 w-8 text-primary"/>
        </div>
        <h1 className="text-4xl font-bold">{fullName || 'Your Name'}</h1>
        <p className="text-lg text-gray-600 mt-1">{experience[0]?.role || 'Creative Writer & Editor'}</p>
      </header>
      
      <main className="max-w-3xl mx-auto space-y-8">
        {summary && (
          <section>
            <p className="text-gray-700 leading-relaxed text-center italic">{summary}</p>
          </section>
        )}
        
        <div className="w-1/4 h-px bg-gray-300 mx-auto" />

        {experience.length > 0 && experience[0]?.role && (
          <section>
            <h2 className="text-2xl font-bold mb-4 text-center tracking-wider flex items-center justify-center gap-2"><BookOpen/> Experience</h2>
            {experience.map((job) => (
            <div key={job.id} className="mb-5">
                <div className="text-center mb-1">
                    <h3 className="text-xl font-semibold">{job.role || 'Job Title'}</h3>
                    <p className="text-md italic text-gray-700">{job.company || 'Publisher / Company'} &mdash; <span className="text-sm text-gray-500">{job.dates || 'Dates'}</span></p>
                </div>
                <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm max-w-none prose-serif text-gray-800">
                    {job.description}
                </ReactMarkdown>
            </div>
            ))}
          </section>
        )}
        
        <div className="w-1/4 h-px bg-gray-300 mx-auto" />

        <div className="grid grid-cols-2 gap-8">
            {skills.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold mb-3 text-center tracking-wider flex items-center justify-center gap-2"><PenTool /> Skills</h2>
                    <ul className="text-center space-y-1">
                        {skills.filter(skill => skill).map((skill, index) => (
                            <li key={index} className="text-gray-700">{skill}</li>
                        ))}
                    </ul>
                </section>
            )}
            {education.length > 0 && education[0]?.school && (
              <section>
                <h2 className="text-2xl font-bold mb-3 text-center tracking-wider">Education</h2>
                {education.map((edu) => (
                  <div key={edu.id} className="text-center">
                    <h3 className="text-xl font-semibold">{edu.school || 'University'}</h3>
                    <p className="text-md italic text-gray-700">{edu.degree || 'Degree'}</p>
                    <p className="text-sm text-gray-500">{edu.dates || 'Dates'}</p>
                  </div>
                ))}
              </section>
            )}
        </div>
        
      </main>
      <footer className="text-center text-xs text-gray-500 mt-8 pt-4 border-t">
          {personalInfo.email} | {personalInfo.phone} | {fullAddress}
      </footer>
    </div>
  );
};
