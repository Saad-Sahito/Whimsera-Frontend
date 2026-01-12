// src/lib/api/stories/saveStoryMetadata.ts
export interface DocumentRequest {
    user_id: string;
    story_id: string;
    document_dict: StoryMetadata;
}
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
export const saveStoryMetadata = async (
    backend: string,
    userId: string,
    storyId: string,
    token: string,
    metadata: StoryMetadata
): Promise<void> => {
    const payload: DocumentRequest = {
        user_id: userId,
        story_id: storyId,
        document_dict: metadata,
    };

    const response = await fetch(`${backend}/stories/metadata/${userId}/${storyId}/save`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Failed to save metadata: ${response.statusText}`);
    }
};