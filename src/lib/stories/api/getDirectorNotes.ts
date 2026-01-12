// src/lib/api/stories/getDirectorNotes.ts
export const getDirectorNotes = async (
  backend: string,
  userId: string,
  storyId: string,
  token: string,
  phaseKey: string
): Promise<Record<string, any>> => {
  const response = await fetch(
    `${backend}/stories/director_notes/${userId}/${storyId}/${phaseKey}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch director notes for phase: ${phaseKey}`);
  }

  const json = await response.json();

  if (json.status !== "success") {
    return {};
  }

  return json.data || {};
};