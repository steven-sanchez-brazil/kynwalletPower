import { HomeDashboard } from '@/ui/features/home/HomeDashboard';

type WelcomeViewProps = {
  name: string;
  onLogout: () => void;
};

export function WelcomeView({ name, onLogout }: WelcomeViewProps) {
  return <HomeDashboard name={name} onLogout={onLogout} />;
}
