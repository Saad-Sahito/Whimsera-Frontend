// src/lib/api/stories/initializeStory.ts

export const initializeNewStory = async (
  backend: string,
  userId: string,
  token: string
): Promise<string> => {
  const response = await fetch(`${backend}/stories/initialize_story?user_id=${userId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to initialize new story");
  }

  const data = await response.json();

  if (data.status !== "success" || !data.story_id) {
    throw new Error("Invalid response from story initialization");
  }

  return data.story_id;
};