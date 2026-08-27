import { getAllQuestSummaries } from "@/lib/quest/loader";
import { QuestMapView } from "@/components/quest/QuestMapView";

export default function QuestMapPage() {
  const quests = getAllQuestSummaries();
  return <QuestMapView quests={quests} />;
}
