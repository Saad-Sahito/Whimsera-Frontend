// src/lib/api/stories/generateStoryMetadata.ts
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
export const generateOrUpdateMetadata = async (
    backend: string,
    userId: string,
    storyId: string,
    token: string,
    currentMetadata: StoryMetadata,
    contextText: string
): Promise<StoryMetadata> => {
    const payload: DictStrRequest = {
        user_id: userId,
        story_id: storyId,
        document_dict: currentMetadata,
        document_str: contextText,
    };

    const response = await fetch(`${backend}/stories/metadata/${userId}/${storyId}/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Metadata generation failed: ${response.status}`);
    }

    const json = await response.json();

    if (json.status !== "success" || !json.data) {
        throw new Error("Invalid metadata generation response");
    }

    return json.data;
};