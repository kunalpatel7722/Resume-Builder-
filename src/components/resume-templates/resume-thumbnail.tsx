
import React from 'react';

interface ResumeThumbnailProps {
  templateId: keyof typeof templates;
}

const ModernThumbnail: React.FC = () => (
    <div className="flex h-full bg-white p-1 gap-0.5">
        <div className="w-[30%] bg-[#ECF1FF] rounded-l-sm p-1 space-y-2.5 flex flex-col">
             <div className="h-5 w-5 rounded-full bg-white shadow self-center" />
            <div className="h-1.5 w-1/2 bg-[#3358FF] rounded-sm" />
            <div className="space-y-1">
                <div className="h-1 w-full bg-gray-300 rounded-sm" />
                <div className="h-1 w-[85%] bg-gray-300 rounded-sm" />
            </div>
            <div className="h-1.5 w-1/2 bg-[#3358FF] rounded-sm mt-3" />
            <div className="space-y-1">
                <div className="h-1 w-full bg-gray-300 rounded-sm" />
                <div className="h-1 w-[85%] bg-gray-300 rounded-sm" />
            </div>
        </div>
        <div className="w-[3px] bg-[#3358FF]" />
        <div className="w-[70%] p-1.5 space-y-1.5">
            <div className="h-3 w-3/4 bg-[#3358FF] rounded-sm" />
            <div className="h-1.5 w-1/2 bg-gray-400 rounded-sm" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-2 w-1/3 bg-gray-500 rounded-sm mt-2" />
            <div className="h-5 w-full bg-gray-200 rounded-sm" />
        </div>
    </div>
);

const ClassicThumbnail: React.FC = () => (
    <div className="p-2 space-y-1 bg-white h-full font-serif border border-gray-300">
        <div className="h-3 w-1/2 mx-auto bg-gray-700 rounded-sm" />
        <div className="h-1 w-3/4 mx-auto bg-gray-400 rounded-sm" />
        <div className="w-full h-px bg-gray-300 my-1.5" />
        <div className="h-1.5 w-1/4 bg-gray-800 rounded-sm mb-1" />
        <div className="h-1 w-full bg-gray-300 rounded-sm" />
        <div className="h-1 w-5/6 bg-gray-300 rounded-sm" />
        <div className="h-1.5 w-1/4 bg-gray-800 rounded-sm mt-2 mb-1" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
    </div>
);

const CreativeThumbnail: React.FC = () => (
    <div className="flex h-full bg-white p-1 gap-1">
        <div className="w-[40%] bg-[#FFE9E2] rounded-l-sm p-1.5 space-y-2 flex flex-col items-center">
            <div className="h-6 w-6 rounded-full bg-white shadow-md border-2 border-orange-200" />
            <div className="h-1.5 w-full bg-[#FF6B35] text-white p-1 rounded-sm" />
            <div className="h-4 w-full bg-gray-200 rounded-sm" />
            <div className="h-1.5 w-full bg-[#FF6B35] text-white mt-2 p-1 rounded-sm" />
            <div className="h-4 w-full bg-gray-200 rounded-sm" />
        </div>
        <div className="w-[60%] p-1.5 space-y-1.5">
            <div className="h-3 w-3/4 bg-[#FF6B35] rounded-sm" />
            <div className="h-1.5 w-1/2 bg-gray-400 rounded-sm" />
            <div className="h-2 w-1/3 bg-gray-500 rounded-sm mt-2" />
            <div className="h-5 w-full bg-gray-200 rounded-sm" />
        </div>
    </div>
);

const ProfessionalThumbnail: React.FC = () => (
    <div className="p-2 space-y-1.5 bg-white h-full font-sans border border-gray-300">
        <div className="h-3 w-1/2 mx-auto bg-gray-600 rounded-sm" />
        <div className="h-1.5 w-1/3 mx-auto bg-[#17494D] rounded-sm" />
        <div className="h-1 w-3/4 mx-auto bg-gray-400 rounded-sm mb-1" />
        <hr className="my-1 border-gray-300"/>
        <div className="h-2 w-1/4 bg-[#17494D] rounded-sm" />
        <div className="flex justify-between items-center"><div className="h-1.5 w-1/3 bg-gray-500 rounded-sm" /><div className="flex-grow border-b border-dotted mx-2 border-gray-400"></div><div className="h-1 w-1/4 bg-gray-400 rounded-sm" /></div>
        <div className="h-4 w-full bg-gray-200 rounded-sm" />
    </div>
);

const MinimalistThumbnail: React.FC = () => (
    <div className="p-3 space-y-2.5 bg-white h-full font-mono border border-gray-300">
        <div className="h-3 w-3/5 bg-gray-700 rounded-sm" />
        <div className="h-1 w-2/3 bg-gray-500 rounded-sm" />
        <div className="h-1 w-full bg-gray-300 rounded-sm mt-3" />
        <div className="h-1.5 w-1/4 bg-gray-700 rounded-sm mt-3" />
        <div className="h-4 w-full bg-gray-200 rounded-sm" />
    </div>
);

const ExecutiveThumbnail: React.FC = () => (
    <div className="flex h-full bg-white p-1 gap-1">
        <div className="w-[72%] p-1.5 space-y-2">
            <div className="h-3 w-2/3 bg-[#8B4513] rounded-sm" />
            <div className="h-2 w-1/3 bg-[#8B4513] rounded-sm border-b-2 border-yellow-900 pb-1 mt-3" />
            <div className="h-5 w-full bg-gray-300 rounded-sm" />
        </div>
        <div className="w-[28%] p-1.5 space-y-2 bg-[#F2EAE3] rounded-r-sm">
            <div className="h-1.5 w-full bg-gray-500 rounded-sm" />
            <div className="h-4 w-full bg-gray-200 rounded-sm" />
        </div>
    </div>
);

const SimpleThumbnail: React.FC = () => (
    <div className="p-2 space-y-2 bg-white h-full border border-gray-300">
        <div className="h-3 w-1/2 mx-auto bg-gray-600 rounded-sm" />
        <div className="h-1.5 w-1/3 mx-auto bg-gray-500 rounded-sm" />
        <div className="h-1.5 w-1/4 bg-gray-700 rounded-sm mt-2" />
        <div className="h-5 w-full bg-gray-300 rounded-sm" />
        <div className="h-1.5 w-1/4 bg-gray-700 rounded-sm mt-2" />
        <div className="h-5 w-full bg-gray-300 rounded-sm" />
    </div>
);

const TechnicalThumbnail: React.FC = () => (
    <div className="flex h-full bg-white p-1 gap-1.5">
        <div className="w-[60%] p-1.5 space-y-2">
            <div className="h-3 w-2/3 bg-[#009688] rounded-sm" />
            <div className="h-5 w-full bg-gray-200 rounded-sm" />
            <div className="pl-1.5 relative"><div className="absolute left-0 top-0 h-full w-0.5 bg-[#009688]"></div><div className="h-5 w-full bg-gray-300 rounded-sm"></div></div>
        </div>
        <div className="w-[40%] p-1.5 space-y-2">
            <div className="h-1.5 w-1/2 bg-[#009688] rounded-sm" />
            <div className="h-4 w-full bg-gray-200 rounded-sm" />
            <div className="h-1.5 w-1/2 bg-[#009688] rounded-sm mt-2" />
            <div className="h-4 w-full bg-gray-200 rounded-sm" />
        </div>
    </div>
);

const AcademicThumbnail: React.FC = () => (
    <div className="p-2 space-y-1 bg-white h-full font-serif border border-gray-300">
        <div className="h-3 w-1/2 mx-auto bg-gray-600 rounded-sm" />
        <div className="h-1 w-3/4 mx-auto bg-gray-400 rounded-sm" />
        <div className="h-1.5 w-1/3 bg-[#2C3E50] rounded-sm mt-2" />
        <div className="h-1 w-full bg-gray-300 rounded-sm" />
        <div className="h-1 w-5/6 bg-gray-300 rounded-sm" />
    </div>
);

const SalesThumbnail: React.FC = () => (
    <div className="p-1 bg-white h-full flex gap-1">
        <div className="w-[73%] p-1.5 space-y-1.5">
            <div className="h-3 w-full bg-red-700 rounded-sm border-b-2 border-red-700 pb-1" />
            <div className="h-1.5 w-1/2 bg-gray-400 rounded-sm" />
            <div className="h-1.5 w-1/3 bg-red-700 mt-2" />
            <div className="h-5 w-full bg-gray-300 rounded-sm" />
        </div>
        <div className="w-[27%] p-1.5 space-y-2 bg-red-50 rounded-r-sm">
            <div className="h-1.5 w-full bg-gray-400 rounded-sm" />
            <div className="h-5 w-full bg-white shadow rounded-sm" />
            <div className="h-1.5 w-full bg-gray-400 rounded-sm mt-2"/>
            <div className="h-4 w-full bg-gray-300 rounded-sm" />
        </div>
    </div>
);

const MarketingThumbnail: React.FC = () => (
    <div className="flex h-full bg-white p-1 gap-1">
        <div className="w-[62%] p-1.5 space-y-1.5">
             <div className="flex items-center gap-1.5">
                <div className="h-5 w-5 rounded-full bg-pink-200" />
                <div className="flex-1 space-y-1">
                  <div className="h-2 w-full bg-[#FF4F81] rounded-sm" />
                  <div className="h-1.5 w-1/2 bg-gray-400 rounded-sm" />
                </div>
            </div>
            <div className="h-2 w-1/3 bg-gray-500 rounded-sm mt-3" />
            <div className="h-5 w-full bg-gray-200 rounded-sm" />
        </div>
        <div className="w-[38%] p-1.5 space-y-2 bg-pink-50 rounded-r-sm">
            <div className="h-1.5 w-full bg-[#FF4F81] rounded-sm" />
            <div className="h-4 w-full bg-white rounded-sm shadow" />
            <div className="h-1.5 w-full bg-[#FF4F81] rounded-sm mt-2" />
            <div className="h-5 w-full bg-white rounded-sm shadow" />
        </div>
    </div>
);

const HealthcareThumbnail: React.FC = () => (
    <div className="p-2 space-y-1 bg-white h-full border border-gray-300">
        <div className="h-3 w-1/2 mx-auto bg-gray-600 rounded-sm" />
        <div className="h-1.5 w-1/3 mx-auto bg-green-600 rounded-sm" />
        <hr className="my-1.5 border-gray-300" />
        <div className="h-1.5 w-1/4 bg-green-600 rounded-sm" />
        <div className="h-4 w-full bg-gray-300 rounded-sm" />
        <div className="h-1.5 w-1/4 bg-green-600 rounded-sm mt-2" />
        <div className="h-4 w-full bg-gray-200 rounded-sm" />
    </div>
);

const LegalThumbnail: React.FC = () => (
    <div className="flex h-full bg-white p-1">
        <div className="w-0.5 bg-[#00264D] rounded-l-sm" />
        <div className="p-1.5 space-y-1 flex-1 font-serif">
            <div className="h-3 w-2/3 bg-gray-700 rounded-sm" />
            <div className="h-1 w-full bg-gray-400 rounded-sm" />
            <div className="h-1.5 w-1/3 bg-gray-700 rounded-sm mt-3" />
            <div className="h-5 w-full bg-gray-200 rounded-sm" />
        </div>
    </div>
);

const FinanceThumbnail: React.FC = () => (
    <div className="p-2 bg-white h-full grid grid-cols-3 gap-1.5 border border-gray-300">
        <div className="col-span-3 h-3 w-1/2 mx-auto bg-gray-600 rounded-sm" />
        <div className="col-span-1 h-4 w-full bg-[#E3ECF9] rounded-sm" />
        <div className="col-span-1 h-4 w-full bg-[#E3ECF9] rounded-sm" />
        <div className="col-span-1 h-4 w-full bg-[#E3ECF9] rounded-sm" />
        <div className="col-span-3 h-2 w-full bg-[#0D47A1] rounded-sm mt-1" />
        <div className="col-span-3 h-5 w-full bg-gray-200 rounded-sm" />
    </div>
);

const HospitalityThumbnail: React.FC = () => (
    <div className="flex h-full bg-white p-1 gap-1">
        <div className="w-[30%] bg-[#FFF4E0] rounded-l-sm p-1.5 space-y-2 flex flex-col items-center">
             <div className="h-5 w-5 bg-gray-300 shadow" />
             <div className="h-2.5 w-full bg-gray-400 rounded-sm" />
             <div className="h-1.5 w-2/3 bg-amber-500 rounded-sm" />
             <div className="h-1.5 w-1/3 bg-amber-500 rounded-sm mt-3" />
             <div className="h-4 w-full bg-gray-200 rounded-sm" />
        </div>
        <div className="w-[70%] p-1.5 space-y-1.5">
            <div className="h-2 w-1/2 bg-gray-500 rounded-sm border-b-2 border-amber-500 pb-0.5" />
            <div className="h-5 w-full bg-gray-300 rounded-sm" />
        </div>
    </div>
);

const SoftwareEngineerThumbnail: React.FC = () => (
    <div className="flex h-full bg-white p-1 gap-1">
        <div className="w-[35%] p-1.5 space-y-2 bg-[#ECECFF] rounded-l-sm">
             <div className="h-5 w-5 bg-gray-300 border-2 border-indigo-300" />
             <div className="h-3 w-full bg-gray-500 rounded-sm" />
             <div className="h-1.5 w-2/3 bg-[#4E44CE] rounded-sm" />
             <div className="h-1.5 w-1/2 bg-gray-500 mt-2" />
             <div className="h-4 w-full bg-white shadow-inner rounded-sm" />
        </div>
        <div className="w-[65%] p-1.5 space-y-1.5">
            <div className="h-1.5 w-1/4 bg-gray-600 rounded-sm" />
            <div className="h-5 w-full bg-gray-200 rounded-sm" />
            <div className="h-1.5 w-1/4 bg-gray-600 rounded-sm mt-2" />
            <div className="h-5 w-full bg-gray-200 rounded-sm" />
        </div>
    </div>
);

const GraphicDesignerThumbnail: React.FC = () => (
    <div className="flex h-full bg-white p-1 gap-1">
        <div className="w-[36%] bg-gray-100 rounded-l-sm p-1.5 flex flex-col items-center space-y-2">
            <div className="h-6 w-6 bg-gray-300" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        </div>
        <div className="w-[64%] p-1.5 space-y-1.5">
            <div className="h-3 w-full bg-[#FF3366] text-white p-1 rounded-sm" />
            <div className="h-1.5 w-1/2 bg-gray-400 rounded-sm" />
            <div className="h-2 w-1/3 bg-gray-500 rounded-sm mt-2" />
            <div className="h-4 w-full bg-gray-200 rounded-sm" />
        </div>
    </div>
);

const CustomerServiceThumbnail: React.FC = () => (
    <div className="flex h-full bg-white p-1 gap-1">
        <div className="w-[33%] p-1.5 space-y-2 bg-[#E0F7FA] rounded-l-sm">
            <div className="h-2.5 w-full bg-gray-500" />
            <div className="h-1.5 w-2/3 bg-[#00838F]" />
            <div className="h-1.5 w-1/2 bg-[#00838F] mt-3" />
            <div className="h-4 w-full bg-white rounded-sm border border-gray-200" />
        </div>
        <div className="w-[67%] p-1.5 space-y-1.5">
            <div className="h-2 w-1/2 bg-[#00838F]" />
            <div className="h-5 w-full bg-gray-300 rounded-sm" />
            <div className="h-2 w-1/2 bg-[#00838F] mt-2" />
            <div className="h-5 w-full bg-gray-300 rounded-sm" />
        </div>
    </div>
);

const ItProfessionalThumbnail: React.FC = () => (
    <div className="p-1.5 bg-white h-full grid grid-cols-5 gap-1.5 border border-gray-300">
        <div className="col-span-3 space-y-1.5">
            <div className="h-2.5 w-2/3 bg-[#512DA8] rounded-sm" />
            <div className="h-1.5 w-1/2 bg-gray-400 rounded-sm" />
            <div className="h-5 w-full bg-gray-200 rounded-sm" />
        </div>
        <div className="col-span-2 space-y-1.5">
            <div className="h-1.5 w-full bg-[#512DA8] rounded-sm" />
            <div className="h-4 w-full bg-gray-200 rounded-sm" />
        </div>
    </div>
);

const ProjectManagerThumbnail: React.FC = () => (
     <div className="flex h-full bg-white p-1 gap-1">
        <div className="w-[72%] p-1.5 space-y-1.5">
            <div className="h-3 w-2/3 bg-[#C2185B] rounded-sm" />
            <div className="h-1.5 w-1/2 bg-gray-400 rounded-sm" />
            <div className="h-1.5 w-1/3 bg-gray-500 border-b-2 border-rose-600 pb-0.5 mt-2" />
            <div className="h-5 w-full bg-gray-300 rounded-sm" />
        </div>
        <div className="w-[28%] p-1.5 space-y-2 bg-[#FFE7F0] rounded-r-sm">
            <div className="h-1.5 w-full bg-[#C2185B] rounded-sm" />
            <div className="h-4 w-full bg-white rounded-sm shadow-inner" />
        </div>
    </div>
);

const CreativeWriterThumbnail: React.FC = () => (
    <div className="p-2 bg-white h-full flex flex-col items-center font-serif border border-gray-300">
        <div className="h-3 w-2/3 bg-gray-600 mt-1 rounded-sm" />
        <div className="h-1.5 w-1/2 bg-gray-400 rounded-sm" />
        <div className="my-2 h-4 w-full border-l-2 border-[#D84315] pl-1"><div className="w-full h-full bg-orange-50"/></div>
        <div className="h-1.5 w-1/3 bg-gray-700 rounded-sm" />
        <div className="h-5 w-full bg-gray-200 rounded-sm" />
    </div>
);

const StellarThumbnail: React.FC = () => (
    <div className="flex h-full bg-white p-1 gap-1">
        <div className="w-[70%] p-1.5 space-y-1.5">
            <div className="h-3 w-2/3 bg-gray-700 rounded-sm" />
            <div className="h-1.5 w-1/2 bg-gray-400 rounded-sm" />
            <div className="h-2 w-1/3 bg-gray-500 rounded-sm mt-3" />
            <div className="h-5 w-full bg-gray-200 rounded-sm" />
        </div>
        <div className="w-[30%] p-1.5 space-y-2 bg-gray-100 rounded-r-sm flex flex-col items-center">
            <div className="h-5 w-5 rounded-full bg-gray-300 shadow-sm" />
            <div className="h-1.5 w-full bg-gray-400 rounded-sm" />
            <div className="h-4 w-full bg-gray-200 rounded-sm" />
        </div>
    </div>
);

const DynamicThumbnail: React.FC = () => (
    <div className="p-1.5 bg-white h-full space-y-1.5 border border-gray-300">
        <div className="p-1 bg-blue-50 rounded-sm flex items-center gap-1.5">
            <div className="h-6 w-6 rounded-full bg-white shadow" />
            <div className="flex-1 space-y-1">
                <div className="h-2 w-full bg-gray-500 rounded-sm" />
                <div className="h-1 w-2/3 bg-gray-400 rounded-sm" />
            </div>
        </div>
        <div className="h-1.5 w-1/4 bg-gray-700 rounded-sm" />
        <div className="h-5 w-full bg-gray-200 rounded-sm" />
    </div>
);

const CascadeThumbnail: React.FC = () => (
    <div className="flex h-full bg-white p-1 gap-1">
        <div className="w-[35%] bg-purple-50 rounded-l-sm p-1.5 space-y-2 flex flex-col items-center">
             <div className="h-6 w-6 rounded-full bg-white shadow-md border-2 border-purple-200" />
             <div className="h-4 w-full bg-gray-200 rounded-sm" />
        </div>
        <div className="w-[65%] p-1.5 space-y-1.5">
            <div className="h-3 w-3/4 bg-purple-600 rounded-sm" />
            <div className="h-5 w-full bg-gray-200 rounded-sm" />
        </div>
    </div>
);

const FolioThumbnail: React.FC = () => (
     <div className="flex h-full bg-white p-1 gap-1">
        <div className="w-[33%] bg-gray-100 rounded-l-sm p-1.5 space-y-2 flex flex-col items-center">
             <div className="h-6 w-6 bg-gray-300 shadow" />
             <div className="h-4 w-full bg-white rounded-sm" />
        </div>
        <div className="w-[67%] p-1.5 space-y-1.5">
            <div className="h-3 w-3/4 bg-gray-700 rounded-sm" />
            <div className="h-5 w-full bg-gray-200 rounded-sm" />
        </div>
    </div>
);

const ImpactThumbnail: React.FC = () => (
    <div className="p-1.5 bg-white h-full space-y-1.5 border border-gray-300">
        <div className="flex items-center gap-1.5">
            <div className="h-6 w-6 bg-gray-300 shadow" />
            <div className="flex-1 space-y-1">
                <div className="h-3 w-full bg-orange-700 rounded-sm" />
            </div>
        </div>
        <div className="w-full h-0.5 bg-orange-700 my-1" />
        <div className="h-5 w-full bg-gray-200 rounded-sm" />
    </div>
);

const OnyxThumbnail: React.FC = () => (
    <div className="flex h-full bg-white p-1 gap-0">
        <div className="w-[35%] bg-gray-800 rounded-l-sm p-1.5 space-y-2 flex flex-col items-center">
             <div className="h-6 w-6 bg-gray-600" />
             <div className="h-2.5 w-full bg-gray-300 rounded-sm" />
             <div className="h-4 w-full bg-gray-700 rounded-sm" />
        </div>
        <div className="w-[65%] p-1.5 space-y-1.5">
            <div className="h-2 w-1/3 bg-gray-500 rounded-sm" />
            <div className="h-5 w-full bg-gray-200 rounded-sm" />
        </div>
    </div>
);


const templates = {
    modern: <ModernThumbnail />,
    classic: <ClassicThumbnail />,
    creative: <CreativeThumbnail />,
    professional: <ProfessionalThumbnail />,
    minimalist: <MinimalistThumbnail />,
    executive: <ExecutiveThumbnail />,
    simple: <SimpleThumbnail />,
    technical: <TechnicalThumbnail />,
    academic: <AcademicThumbnail />,
    sales: <SalesThumbnail />,
    marketing: <MarketingThumbnail />,
    healthcare: <HealthcareThumbnail />,
    legal: <LegalThumbnail />,
    finance: <FinanceThumbnail />,
    hospitality: <HospitalityThumbnail />,
    'software-engineer': <SoftwareEngineerThumbnail />,
    'graphic-designer': <GraphicDesignerThumbnail />,
    'customer-service': <CustomerServiceThumbnail />,
    'it-professional': <ItProfessionalThumbnail />,
    'project-manager': <ProjectManagerThumbnail />,
    'creative-writer': <CreativeWriterThumbnail />,
    stellar: <StellarThumbnail />,
    dynamic: <DynamicThumbnail />,
    cascade: <CascadeThumbnail />,
    folio: <FolioThumbnail />,
    impact: <ImpactThumbnail />,
    onyx: <OnyxThumbnail />,
};

export const ResumeThumbnail: React.FC<ResumeThumbnailProps> = ({ templateId }) => {
    return (
        <div className="w-full aspect-[210/297] overflow-hidden rounded-md bg-muted border border-gray-300 shadow-inner">
            {templates[templateId]}
        </div>
    );
};
