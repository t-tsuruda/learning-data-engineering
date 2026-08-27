import { getAllQuestSummaries } from "@/lib/quest/loader";
import { HomeView } from "@/components/home/HomeView";

export default function HomePage() {
  const quests = getAllQuestSummaries();
  return <HomeView quests={quests} />;
}
