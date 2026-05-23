import { notFound } from 'next/navigation'
import { getLesson } from '@/data/lessons'
import { TRACKS } from '@/data/tracks'
import { LessonPlayer } from '@/components/learn/lesson-player'

export default async function LessonPage({ params }: { params: Promise<{ trackId: string; lessonId: string }> }) {
  const { trackId, lessonId } = await params
  const lesson = getLesson(lessonId)
  if (!lesson || lesson.trackId !== trackId) notFound()
  const track = TRACKS.find(t => t.id === trackId)
  if (!track) notFound()

  return <LessonPlayer lesson={lesson} trackId={trackId} />
}
