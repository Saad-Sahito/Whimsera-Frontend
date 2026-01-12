// src/lib/api/stories/continueStory.ts
export interface ContinueStoryRequest {
  user_id: string;
  story_id: string;
}
export const continueExistingStory = async (
  backend: string,
  storyId: string,
  userId: string,
  token: string
): Promise<void> => {
  const payload: ContinueStoryRequest = {
    user_id: userId,
    story_id: storyId,
  };

  const response = await fetch(`${backend}/stories/${storyId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to continue story: ${response.statusText}`);
  }

  // If your backend returns useful data here, you could return it
  // For now we just ensure it succeeded
};