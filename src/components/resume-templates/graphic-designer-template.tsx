import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';
import { Mail, Phone, MapPin, Dribbble } from 'lucide-react';

export interface TemplateProps {
  data: ResumeData;
  accentColor?: string;
}

export const GraphicDesignerTemplate: React.FC<TemplateProps> = ({ data, accentColor: accentColorProp }) => {
  const { personalInfo, summary, experience, education, skills, websites, customSections } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const tools = customSections.filter(s => s.title.toLowerCase().includes('tool'));
  
  const palette = { accent: '#FF3366', text: '#191919', bg: '#FFFFFF' };
  const accentColor = accentColorProp || palette.accent;

  const hasContent = (arr: any[], ...fields: string[]) => arr.some(item => fields.some(field => item[field]));

  const hasExperience = hasContent(experience, 'role', 'company', 'description');
  const hasEducation = hasContent(education, 'school', 'degree');
  const hasSkills = skills.length > 0;
  const hasWebsites = hasContent(websites, 'url');
  const hasTools = hasContent(tools, 'content');

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return '';
    const start = format(startDate, 'yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'yyyy')}`;
    return start;
  };

  const SidebarSection: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-[var(--fs-h2)] font-bold uppercase tracking-wider border-b-2 pb-1 mb-2" style={{borderColor: accentColor}}>{title}</h2>
        {children}
      </section>
    );
  };
  
  const MainSection: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-[var(--fs-h2)] font-bold uppercase tracking-wider text-white p-2 mb-3" style={{ backgroundColor: accentColor }}>{title}</h2>
        {children}
      </section>
    );
  };
  
  return (
    <div className="bg-white text-[var(--fs-body)] w-full h-full flex" style={{ fontFamily: "'Raleway', sans-serif", color: palette.text }}>
      <aside className="w-[36%] bg-gray-100 p-6 flex flex-col gap-6">
        <div className="w-32 h-32 rounded-full mx-auto bg-gray-300 shadow-md flex items-center justify-center">
            <span className="text-5xl font-bold text-gray-500">{personalInfo.firstName?.[0]}{personalInfo.lastName?.[0]}</span>
        </div>
        <SidebarSection title="Contact">
          <div className="space-y-1.5 text-[var(--fs-small)] text-gray-700">
            {personalInfo.email && <div className="flex items-center gap-2"><Mail size={14} style={{color: accentColor}} /><span>{personalInfo.email}</span></div>}
            {personalInfo.phone && <div className="flex items-center gap-2"><Phone size={14} style={{color: accentColor}} /><span>{personalInfo.phone}</span></div>}
            {personalInfo.city && <div className="flex items-center gap-2"><MapPin size={14} style={{color: accentColor}} /><span>{personalInfo.city}{personalInfo.state && `, ${personalInfo.state}`}</span></div>}
          </div>
        </SidebarSection>

        <SidebarSection title="Skills" show={hasSkills}>
          <ul className="text-[var(--fs-body)] space-y-1 list-disc list-inside">
            {skills.map((skill, i) => <li key={i}>{skill}</li>)}
          </ul>
        </SidebarSection>

        <SidebarSection title="Tools" show={hasTools}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-700">
            {tools.map(t => t.content).join('\n') || 'Your design tools will appear here.'}
          </ReactMarkdown>
        </SidebarSection>
      </aside>

      <main className="w-[64%] p-8 overflow-y-auto">
        <header className="mb-8">
            <h1 className="text-5xl font-extrabold">{fullName || 'Your Name'}</h1>
            <h2 className="text-xl font-light" style={{color: accentColor}}>{experience[0]?.role || 'Graphic Designer'}</h2>
        </header>

        <div className="space-y-6">
            <MainSection title="Profile">
              <p className="leading-relaxed">{summary || 'Your professional summary will appear here.'}</p>
            </MainSection>

            <MainSection title="Experience" show={hasExperience}>
              <div className="space-y-4">
              {experience.map(job => (
                <div key={job.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[var(--fs-h3)] font-bold">{job.role || 'Job Title'}</h3>
                    <p className="text-[var(--fs-small)] text-gray-500 font-medium">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                  </div>
                  <p className="font-semibold italic">{job.company || 'Company Name'}</p>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none">
                    {job.description || '* Your job description will appear here.'}
                  </ReactMarkdown>
                </div>
              ))}
              </div>
            </MainSection>
            
            <MainSection title="Portfolio" show={hasWebsites}>
               <div className="grid grid-cols-2 gap-4">
                  {websites.map(site => (
                      <a href={site.url} key={site.id} className="text-center p-4 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                        <Dribbble className="mx-auto mb-2" style={{color: accentColor}}/>
                        <p className="text-[var(--fs-small)] font-bold hover:underline">{site.label || 'Project Link'}</p>
                      </a>
                  ))}
               </div>
            </MainSection>

            <MainSection title="Education" show={hasEducation}>
                {education.map(edu => (
                    <div key={edu.id}>
                        <h3 className="text-[var(--fs-h3)] font-bold">{edu.school || 'University Name'}</h3>
                        <p className="font-semibold">{edu.degree || 'Degree'}</p>
                        <p className="text-[var(--fs-small)] text-gray-500">{edu.isStillEnrolled ? 'Present' : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ')}</p>
                    </div>
                ))}
            </MainSection>
        </div>
      </main>
    </div>
  );
};
