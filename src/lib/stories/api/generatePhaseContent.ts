// src/lib/api/stories/generatePhaseContent.ts

export interface StoryMetadata {
  story_title: string;
  genre: string[];      // List[str]
  sub_genre: string[];  // List[str]
  themes: string[];     // List[str]
  tone: string;
  story_structure: string;
  total_act: number;
  target_length: number;
  user_notes?: string;
}
export interface DictStrRequest {
  user_id: string;
  story_id: string;
  document_dict: StoryMetadata;
  document_str: string;
}
export const generatePhaseContent = async (
  backend: string,
  endpoint: string,
  userId: string,
  storyId: string,
  token: string,
  metadata: any,
  documentStr: string
): Promise<Record<string, any>> => {
  const payload: DictStrRequest = {
    user_id: userId,
    story_id: storyId,
    document_dict: metadata,
    document_str: documentStr,
  };

  const response = await fetch(`${backend}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Generate failed: ${response.statusText}`);
  }

  const json = await response.json();

  if (json.status !== "success" || !json.data) {
    throw new Error("Invalid generate response");
  }

  return json.data;
};