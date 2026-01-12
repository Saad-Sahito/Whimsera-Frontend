"use client";
import { Sparkles, BookOpen, Users, Layout, Layers, Zap, ListTodo, FileText, PenTool } from "lucide-react";

// --- Data Models matching Backend ---

export interface StoryMetadata {
  story_title: string;
  genre: string[];      // List[str]
  sub_genre: string[];  // List[str]
  themes: string;    
  tone: string;
  story_structure: string;
  total_act: number;
  target_length: number;
  user_notes?: string;
}

// Request Models
export interface DictStrRequest {
  user_id: string;
  story_id: string;
  document_dict: StoryMetadata;
  document_str: string;
}

export interface DocumentRequest {
  user_id: string;
  story_id: string;
  document_dict: StoryMetadata;
}

export interface ContinueStoryRequest {
  user_id: string;
  story_id: string;
}

// --- Configuration ---

export const GENRES = [
  "Fantasy",
  "Mystery",
  "Comedy",
  "Sci-Fi",
  "Romance",
  "Adventure",
  "Horror",
  "Thriller/Suspense",
  "Crime",
  "Drama",
  "Tragedy"
];
export const SUB_GENRES_MAP: Record<string, string[]> = {
  "Thriller/Suspense": [
     "Psychological Thriller", 
    "Action Thriller",
     "Legal Thriller", 
    "Domestic Thriller", 
    "Conspiracy Thriller",
    "Spy/Espionage",
    "Medical Thriller", 
  ],
  "Mystery": [
   "Cozy Mystery", 
     "Whodunit", 
     "Hard-Boiled", 
     "Police Procedural", 
    "Private Investigator",
   "Locked-Room",
    "Noir Mystery",
    "Caper/Heist Mystery"
  ],
  "Horror": [
     "Supernatural",
     "Psychological Horror", 
     "Slasher", 
     "Body Horror", 
     "Folk Horror", 
    "Cosmic/Lovecraftian", 
     "Gothic Horror", 
     "Zombie"
  ],
  "Romance": [
  "Contemporary Romance",
  "Historical Romance",
  "Paranormal Romance",
   "Romantic Suspense",
    "Romantic Comedy",
   "Sports Romance",
    "Dark Romance",
    "Fantasy Romance"
  ],
  "Comedy": [
     "Romantic Comedy", 
    "Dark Comedy", 
    "Satire", 
     "Slapstick", 
    "Buddy Comedy", 
     "Screwball Comedy", 
    "Parody"
  ],
  "Drama": [
     "Family Drama", 
    "Coming-of-Age", 
     "Psychological Drama", 
     "Social Issue Drama", 
     "Melodrama", 
    "Historical Drama"
  ],
  "Tragedy": [
    "Classical Tragedy", 
    "Revenge Tragedy", 
     "Domestic Tragedy", 
     "Modern Tragedy", 
     "Shakespearean Tragedy"
  ],
  "Adventure": [
     "Swashbuckling", 
    "Pulp Adventure", 
   "Survival Adventure", 
     "Jungle/Exploration", 
     "High-Seas/Pirate"
  ],
  "Crime": [
    "Heist/Caper", 
  "Police Procedural", 
     "Noir",
     "Gangster/Mafia", 
     "True Crime-Inspired", 
     "Organized Crime"
  ],
  "Fantasy": [
     "High Fantasy",
    "Urban Fantasy",
     "Dark Fantasy", 
    "Portal/Isekai", 
    "Mythic/Fairy-Tale",
    "Grimdark", 
   "Sword & Sorcery"
  ],
  "Sci-Fi": [
    "Space Opera",
   "Hard Sci-Fi",
   "Cyberpunk",
    "Dystopian", 
   "Post-Apocalyptic",  
   "Military Sci-Fi",  
    "Time Travel",  
   "First Contact" 
  ]
};



export const PHASES = [
  { id: "one_sentence", name: "One-Sentence Summary", description: "The core hook.", icon: Sparkles, queryKey: "one_sentence_form", generateEndpoint: "/generate/snowflake/one_sentence", saveEndpoint: "/save/snowflake/one_sentence", feedbackEndpoint: "/feedback/snowflake/one_sentence" },
  { id: "one_paragraph", name: "One-Paragraph Summary", description: "Three disasters & ending.", icon: BookOpen, queryKey: "one_paragraph_form", generateEndpoint: "/generate/snowflake/one_paragraph", saveEndpoint: "/save/snowflake/one_paragraph", feedbackEndpoint: "/feedback/snowflake/one_paragraph" },
  { id: "character_summaries", name: "Character Summaries", description: "Core cast overviews.", icon: Users, queryKey: "character_summaries", generateEndpoint: "/generate/snowflake/character_summaries", saveEndpoint: "/save/snowflake/character_summaries", feedbackEndpoint: "/feedback/snowflake/character_summaries" },
  { id: "expanded_character_sheets", name: "Character Sheets", description: "Deep dive motivations.", icon: Layout, queryKey: "expanded_character_sheets", generateEndpoint: "/generate/snowflake/expanded_character_sheets", saveEndpoint: "/save/snowflake/expanded_character_sheets", feedbackEndpoint: "/feedback/snowflake/expanded_character_sheets" },
  { id: "story_synopsis", name: "Story Synopsis", description: "Full narrative arc.", icon: Layers, queryKey: "story_synopsis", generateEndpoint: "/generate/snowflake/story_synopsis", saveEndpoint: "/save/snowflake/story_synopsis", feedbackEndpoint: "/feedback/snowflake/story_synopsis" },
  { id: "act_structure", name: "Act Structure", description: "Turning points.", icon: Zap, queryKey: "act_structure", generateEndpoint: "/generate/snowflake/act_structure", saveEndpoint: "/save/snowflake/act_structure", feedbackEndpoint: "/feedback/snowflake/act_structure" },
  { id: "scene_list", name: "Scene List", description: "Spreadsheet of scenes.", icon: ListTodo, queryKey: "scene_list", generateEndpoint: "/generate/snowflake/scene_list", saveEndpoint: "/save/snowflake/scene_list", feedbackEndpoint: "/feedback/snowflake/scene_list" },
  { id: "scene_briefs", name: "Scene Briefs", description: "Conflict and outcome.", icon: FileText, queryKey: "scene_briefs", generateEndpoint: "/generate/snowflake/scene_briefs", saveEndpoint: "/save/snowflake/scene_briefs", feedbackEndpoint: "/feedback/snowflake/scene_briefs" },
  { id: "scene_drafts", name: "Scene Drafts", description: "Writing the prose.", icon: PenTool, queryKey: "scene_drafts", generateEndpoint: "/generate/snowflake/scene_drafts", saveEndpoint: "/save/snowflake/scene_drafts", feedbackEndpoint: "/feedback/snowflake/scene_drafts" }
];

export const DEFAULT_METADATA: StoryMetadata = {
  story_title: "Untitled Story",
  genre: [],
  sub_genre: [],
  themes: "",
  tone: "Hopeful",
  story_structure: "Three-Act",
  total_act: 3,
  target_length: 50000,
  user_notes: ""
};
export const STORY_STRUCTURES = [
  "Three-Act Structure",
  "The Hero's Journey",
  "Save the Cat",
  "Fichtean Curve",
  "Seven-Point Story Structure",
  "Dan Harmon's Story Circle",
  "In Media Res",
  "Freytag's Pyramid"
];