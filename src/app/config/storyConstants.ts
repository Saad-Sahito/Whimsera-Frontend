//config/storyConstants.ts
import {
  Sparkles, Globe, Users, Anchor, Layout, CheckCircle, ListTodo, PenTool,
  Zap, BookOpen, Swords, Layers, FileText
} from "lucide-react";

export const GENRES = [
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Thriller",
  "Romance",
  "Horror",
  "Historical",
  "Literary",
  "Young Adult",
  "Game Narrative / Interactive Fiction"
] as const;

export const CHARACTER_TEMPLATES: Record<string, string[]> = {
  "Fantasy": ["Name", "Role", "External goal", "Internal need", "Moral boundary", "Power or skill", "Cost of power", "Fear", "Lie they believe"],
  "Science Fiction": ["Name", "Profession", "Technological augmentation", "Core conflict", "Ideological belief", "Personal loss", "Secret", "Redemption path", "Key relationship"],
  "Mystery": ["Name", "Secret they hide", "Motive", "Opportunity", "Alibi", "Connection to victim", "Psychological flaw", "Revelation moment"],
  "Thriller": ["Name", "High stakes goal", "Special skill", "Pursuer or pursued", "Moral gray area", "Time pressure", "Betrayal risk", "Ultimate sacrifice"],
  "Romance": ["Name", "Emotional wound", "Desire", "Misbelief about love", "Attachment style", "Fear of intimacy", "What they hide", "What forces change"],
  "Horror": ["Name", "Past trauma", "Vulnerability to horror element", "Denial mechanism", "Survival strategy", "Dark impulse", "Breaking point", "Possible fate"],
  "Historical": ["Name", "Social status", "Historical event involvement", "Personal ambition", "Cultural constraint", "Forbidden desire", "Loyalty conflict", "Legacy"],
  "Literary": ["Name", "Inner turmoil", "Philosophical question", "Key relationship dynamic", "Symbolic element", "Psychological depth", "Transformation trigger", "Ambiguity"],
  "Young Adult": ["Name", "Age", "Identity struggle", "Family dynamic", "Peer pressure", "First love or crush", "Rebellious act", "Lesson learned", "Future dream"],
  "Game Narrative / Interactive Fiction": ["Role", "Player relationship", "Core motivation", "Moral alignment", "Decision pressure points", "Possible state variables", "Failure condition"]
};

export const DEFAULT_CHARACTER_TEMPLATE = ["Name", "Background", "Motivation", "Goal", "Conflict", "Arc", "Relationships"];

export const TONES = ["Hopeful", "Dark", "Bittersweet", "Adventurous", "Serious", "Whimsical", "Epic"];

export interface PhaseConfig {
  id: string;
  name: string;
  description?: string;
  icon: any;
  generateEndpoint: string;
  saveEndpoint: string;
  feedbackEndpoint: string;
  queryKey?: string;
}

export const PHASES: PhaseConfig[] = [
  { id: "one_sentence", name: "One-Sentence Summary", description: "Craft a single sentence that captures the core story, character, conflict, and unique hook.", icon: Sparkles, generateEndpoint: "/generate/snowflake/one_sentence", saveEndpoint: "/save/snowflake/one_sentence", feedbackEndpoint: "/feedback/snowflake/one_sentence", queryKey: "one_sentence" },
  { id: "one_paragraph", name: "One-Paragraph Summary", description: "Expand your sentence into a paragraph covering setup, three major disasters, and ending.", icon: BookOpen, generateEndpoint: "/generate/snowflake/one_paragraph", saveEndpoint: "/save/snowflake/one_paragraph", feedbackEndpoint: "/feedback/snowflake/one_paragraph", queryKey: "one_paragraph" },
  { id: "character_summaries", name: "Main Character Summaries", description: "Write a one-paragraph summary for each major character from their point of view.", icon: Users, generateEndpoint: "/generate/snowflake/character_summaries", saveEndpoint: "/save/snowflake/character_summaries", feedbackEndpoint: "/feedback/snowflake/character_summaries", queryKey: "character_summaries" },
  { id: "expanded_character_sheets", name: "Expanded Character Sheets", description: "Build detailed character sheets using the genre-specific template.", icon: Layout, generateEndpoint: "/generate/snowflake/expanded_character_sheets", saveEndpoint: "/save/snowflake/expanded_character_sheets", feedbackEndpoint: "/feedback/snowflake/expanded_character_sheets", queryKey: "expanded_character_sheets" },
  { id: "story_synopsis", name: "Story Synopsis", description: "Expand into a 1-2 page synopsis detailing the full story arc.", icon: Layers, generateEndpoint: "/generate/snowflake/story_synopsis", saveEndpoint: "/save/snowflake/story_synopsis", feedbackEndpoint: "/feedback/snowflake/story_synopsis", queryKey: "story_synopsis" },
  { id: "act_structure", name: "Act-Level Structure", description: "Break the story into acts with key turning points and goals.", icon: Zap, generateEndpoint: "/generate/snowflake/act_structure", saveEndpoint: "/save/snowflake/act_structure", feedbackEndpoint: "/feedback/snowflake/act_structure", queryKey: "act_structure" },
  { id: "scene_list", name: "Scene List", description: "Create a complete list of scenes in chronological order.", icon: ListTodo, generateEndpoint: "/generate/snowflake/scene_list", saveEndpoint: "/save/snowflake/scene_list", feedbackEndpoint: "/feedback/snowflake/scene_list", queryKey: "scene_list" },
  { id: "scene_briefs", name: "Scene Briefs", description: "Write a short brief for each scene (goal, conflict, outcome).", icon: FileText, generateEndpoint: "/generate/snowflake/scene_briefs", saveEndpoint: "/save/snowflake/scene_briefs", feedbackEndpoint: "/feedback/snowflake/scene_briefs", queryKey: "scene_briefs" },
  { id: "scene_drafts", name: "Scene Drafts", description: "Draft the full text of each scene.", icon: PenTool, generateEndpoint: "/generate/snowflake/scene_drafts", saveEndpoint: "/save/snowflake/scene_drafts", feedbackEndpoint: "/feedback/snowflake/scene_drafts", queryKey: "scene_drafts" },
];





// --- TYPES ---
export type FlowType = "Compact" | "Standard" | "Epic";

export interface MainPhaseConfig {
  id: string;
  name: string;
  description?: string;
  icon: any;
  endpoint: string;
  saveEndpoint: string;
  queryKey?: string;
}

export interface StorySeed {
  title?: string;
  pov: string;
  tone: string;
  genre: string[];
  sub_genre: string[];
  setting?: string;
  prose_style: string;
  themes: string[];
  target_audience_age: number;
  target_length: number;
  target_medium: string;
  act_count: number;
  story_structure: string;
  protagonist_specs: {
    name: string;
    age: string;
    gender: string;
    archetype: string;
    core_trait: string;
    background: string;
    desire: string;
    fear: string;
    relationships: string;
    physical_description: string;
    [key: string]: any;
  };
}

// --- CONSTANTS ---
export const ALL_GENRES = [
  "Fantasy", "Mystery", "Sci-Fi", "Romance", "Adventure",
  "Horror", "Thriller/Suspense", "Crime", "Drama", "Comedy", "Tragedy"
];

export const POVS = ["First Person", "Third Person Limited", "Third Person Omniscient", "Second Person"];
export const MEDIUMS = ["Novel", "Game", "Screenplay", "Graphic Novel"];
export const PROSE_STYLES = ["Descriptive", "Minimalist", "Flowery", "Cinematic", "Journalistic"];

export const STRUCTURE_RECOMMENDATIONS: Record<string, string[]> = {
  "Freytag's Pyramid": ["Tragedy", "Horror + Thriller/Suspense", "Drama + Tragedy + Romance", "Mystery + Crime"],
  "The Hero's Journey": ["Fantasy", "Adventure + Sci-Fi", "Comedy + Fantasy + Adventure", "Drama + Romance"],
  "Three Act Structure": ["Thriller/Suspense", "Comedy + Romance", "Sci-Fi + Mystery + Thriller/Suspense", "Crime + Drama"],
  "Dan Harmon's Story Circle": ["Comedy", "Drama + Comedy + Tragedy", "Sci-Fi + Adventure", "Romance + Mystery"],
  "Fichtean Curve": ["Horror", "Thriller/Suspense + Crime", "Adventure + Fantasy + Horror", "Mystery + Thriller/Suspense"],
  "Save the Cat Beat Sheet": ["Drama + Tragedy", "Romance + Comedy", "Adventure + Crime", "Sci-Fi + Thriller/Suspense + Mystery"],
  "Seven-Point Story Structure": ["Fantasy + Adventure", "Horror + Mystery", "Crime + Thriller/Suspense + Drama", "Sci-Fi + Tragedy + Romance"]
};
export const STRUCTURE_LIST = Object.keys(STRUCTURE_RECOMMENDATIONS);
export const STRUCTURE_ACT_MAP: Record<string, number> = {
  "Freytag's Pyramid": 5, "The Hero's Journey": 3, "Three Act Structure": 3,
  "Dan Harmon's Story Circle": 3, "Fichtean Curve": 1, "Save the Cat Beat Sheet": 3,
  "Seven-Point Story Structure": 3
};

// --- PHASE DEFINITIONS ---
const SEED_PHASE: MainPhaseConfig = { id: "seed", name: "Story Seed", icon: Sparkles, endpoint: "/creation/add_story_seed", saveEndpoint: "/change/add_story_seed", queryKey: "story_seed" };
const WORLD_PHASE: MainPhaseConfig = { id: "world", name: "World Foundation", icon: Globe, endpoint: "/creation/generate_world_foundation", saveEndpoint: "/change/generate_world_foundation", queryKey: "world_foundation" };
const AGENTS_PHASE: MainPhaseConfig = { id: "agents", name: "Narrative Agents", icon: Users, endpoint: "/creation/generate_narrative_agents", saveEndpoint: "/change/generate_narrative_agents", queryKey: "narrative_agents" };
const CONNECT_AGENTS_PHASE: MainPhaseConfig = { id: "connect_agents", name: "Connect Agents", icon: Anchor, endpoint: "/creation/connect_agents_to_plot", saveEndpoint: "/change/connect_agents_to_plot", queryKey: "connected_agents" };
const CONNECT_WORLD_PHASE: MainPhaseConfig = { id: "connect_world", name: "Connect World", icon: Globe, endpoint: "/creation/connect_world_to_conflict", saveEndpoint: "/change/connect_world_to_conflict", queryKey: "integrated_world" };
const TRACKER_PHASE: MainPhaseConfig = { id: "tracker", name: "Story Tracker", icon: Layout, endpoint: "/creation/create_story_tracker", saveEndpoint: "/change/create_story_tracker", queryKey: "story_tracker" };
const QUALITY_PHASE: MainPhaseConfig = { id: "quality", name: "Quality Validation", icon: CheckCircle, endpoint: "/creation/validate_story_elements", saveEndpoint: "", queryKey: "quality_report" };

export const FLOWS: Record<FlowType, MainPhaseConfig[]> = {
  Compact: [
    SEED_PHASE, WORLD_PHASE,
    { id: "compact_plot", name: "Compact Plot", icon: Zap, endpoint: "/creation/generate_compact_plot", saveEndpoint: "/change/generate_compact_plot", queryKey: "compact_plot" },
    AGENTS_PHASE,
    { id: "simple_conflict", name: "Simplified Conflicts", icon: Swords, endpoint: "/creation/generate_simplified_conflict", saveEndpoint: "/change/generate_simplified_conflict", queryKey: "conflict_matrix" },
    CONNECT_AGENTS_PHASE, CONNECT_WORLD_PHASE, TRACKER_PHASE
  ],
  Standard: [
    SEED_PHASE, WORLD_PHASE,
    { id: "minimal_plot", name: "Minimal Plot Outline", icon: BookOpen, endpoint: "/creation/generate_minimal_plot_outline", saveEndpoint: "/change/generate_minimal_plot_outline", queryKey: "minimal_plot" },
    AGENTS_PHASE,
    { id: "conflict", name: "Conflict Matrix", icon: Swords, endpoint: "/creation/generate_conflict_layers", saveEndpoint: "/change/generate_conflict_layers", queryKey: "conflict_matrix" },
    CONNECT_AGENTS_PHASE, CONNECT_WORLD_PHASE,
    { id: "expand_plot", name: "Expand Plot", icon: Layers, endpoint: "/creation/expand_plot_outline", saveEndpoint: "/change/expand_plot_outline", queryKey: "expanded_plot" },
    QUALITY_PHASE, TRACKER_PHASE
  ],
  Epic: [
    SEED_PHASE, WORLD_PHASE,
    { id: "minimal_plot", name: "Minimal Plot Outline", icon: BookOpen, endpoint: "/creation/generate_minimal_plot_outline", saveEndpoint: "/change/generate_minimal_plot_outline", queryKey: "minimal_plot" },
    AGENTS_PHASE,
    { id: "conflict", name: "Conflict Matrix", icon: Swords, endpoint: "/creation/generate_conflict_layers", saveEndpoint: "/change/generate_conflict_layers", queryKey: "conflict_matrix" },
    CONNECT_AGENTS_PHASE, CONNECT_WORLD_PHASE,
    { id: "backstories", name: "Character Backstories", icon: BookOpen, endpoint: "/creation/generate_character_backstories", saveEndpoint: "/change/generate_character_backstories", queryKey: "character_backstories" },
    { id: "world_expansion", name: "World Expansion", icon: Globe, endpoint: "/creation/expand_world_detail", saveEndpoint: "/change/expand_world_detail", queryKey: "world_guide" },
    { id: "subplots", name: "Subplot Architecture", icon: Layers, endpoint: "/creation/generate_subplot_architecture", saveEndpoint: "/change/generate_subplot_architecture", queryKey: "subplot_architecture" },
    { id: "expand_plot_enhanced", name: "Expand Plot (Enhanced)", icon: Sparkles, endpoint: "/creation/expand_plot_with_enhancements", saveEndpoint: "/change/expand_plot_with_enhancements", queryKey: "expanded_plot" },
    QUALITY_PHASE, TRACKER_PHASE
  ]
};


