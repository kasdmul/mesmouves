import { Header } from '@/components/dashboard/header';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { RecruitmentPipeline } from '@/components/dashboard/recruitment-pipeline';
import { JobPostings } from '@/components/dashboard/job-postings';
import { SkillsAnalyzer } from '@/components/dashboard/skills-analyzer';
import { Users, Briefcase, ClipboardList, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-6">
        <h1 className="text-3xl font-bold">Tableau de Bord</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard title="Total Candidates" value="1,250" icon={Users} description="+20.1% from last month" />
          <KpiCard title="Open Positions" value="32" icon={Briefcase} description="+3 since last week" />
          <KpiCard title="Avg. Time to Fill" value="45 days" icon={ClipboardList} description="-5 days vs target" />
          <KpiCard title="Offer Acceptance" value="88%" icon={TrendingUp} description="+2% from last quarter" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
                <RecruitmentPipeline />
            </div>
            <div className="lg:col-span-2">
                <JobPostings />
            </div>
        </div>
        <SkillsAnalyzer />
    </div>
  );
}
