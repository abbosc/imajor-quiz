import { SoundProvider } from "@/components/audio/SoundManager";

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SoundProvider>{children}</SoundProvider>;
}
