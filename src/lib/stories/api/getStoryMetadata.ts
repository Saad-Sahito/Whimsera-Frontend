// src/lib/api/stories/getStoryMetadata.ts
export const getStoryMetadata = async (
  backend: string,
  userId: string,
  storyId: string,
  token: string
): Promise<any> => {   // ← you can create proper StoryMetadata type later
  const response = await fetch(`${backend}/stories/metadata/${userId}/${storyId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch metadata: ${response.status}`);
  }

  const json = await response.json();

  if (json.status !== "success" || !json.data) {
    throw new Error("Invalid metadata response");
  }

  return json.data;
};