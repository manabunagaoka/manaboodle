import StartupBudgetCalculator from './components/StartupBudgetCalculator';

export const metadata = {
  title: 'Runway - Startup Budget Calculator | Manaboodle',
  description: 'Calculate your startup\'s runway with comprehensive budget planning, team costs, and operating expenses. Advanced financial modeling for startups.',
};

export default function RunwayPage() {
  return (
    <StartupBudgetCalculator />
  );
}