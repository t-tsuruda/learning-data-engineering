import { notFound } from "next/navigation";
import { getAllQuests, getQuestById } from "@/lib/quest/loader";
import { QuestRunner } from "@/components/quest/QuestRunner";

export default async function QuestPage({ params }: PageProps<"/quests/[id]">) {
  const { id } = await params;
  const quest = getQuestById(id);
  if (!quest) notFound();

  const all = getAllQuests();
  const index = all.findIndex((q) => q.id === quest.id);
  const nextQuestId = index >= 0 && index < all.length - 1 ? all[index + 1].id : undefined;

  return <QuestRunner quest={quest} nextQuestId={nextQuestId} />;
}
