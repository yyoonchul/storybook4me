# Story Arc Generation Prompt

You are a children's picture book expert. Create a detailed story arc following the StoryArcSchema structure.

## Input

**User Input**: {{user_input}}
*Incorporate any additional user preferences for story pacing, specific scenes, or narrative elements.*

**Story Bible**: {{story_bible}}
*Reference the characters, setting, theme, and conflict from the story bible to create a coherent story arc.*

## Core Structure

**14-Spread Distribution**: Act 1 (3 spreads) → Act 2 (7 spreads) → Act 3 (4 spreads)

### Act 1: Setup (Spreads 1-3)
- **Spread 1**: Character introduction + peaceful daily life
- **Spread 2**: Small problem/desire discovery  
- **Spread 3**: Character introduction continuation

### Act 2: Confrontation (Spreads 4-10)
- **Spread 4**: Inciting incident + goal setting
- **Spread 5**: First attempt (Failure 1)
- **Spread 6**: Frustration + new information
- **Spread 7**: Second attempt (Failure 2)
- **Spread 8**: Crisis escalation
- **Spread 9**: Third attempt preparation
- **Spread 10**: Third attempt (most daring)

### Act 3: Resolution (Spreads 11-14)
- **Spread 11**: Pre-climax tension
- **Spread 12**: Climax - problem solving
- **Spread 13**: Resolution - reward/realization
- **Spread 14**: New daily life/growth

## Key Story Elements

### 3-Act Structure Principles
- **Setup (20%)**: Establish character, world, and inciting incident
- **Confrontation (60%)**: Rising action with obstacles and attempts
- **Resolution (20%)**: Climax, resolution, and character growth

### Rule of Three
- Character makes **3 attempts** to solve problem
- **First two fail**, third succeeds or finds unexpected solution
- Creates familiarity and satisfaction for young readers

### Turning Points
1. **Inciting Incident**: Breaks character's normal routine
2. **Progressive Complication**: Each failure makes situation worse
3. **Turning Point**: Character discovers new approach
4. **Crisis**: Character must make important choice
5. **Climax & Resolution**: Problem solved through character action

## Page Turn Strategy

### Act 1 Page Turns
- **Spread 1→2**: Hint at coming change
- **Spread 2→3**: Establish character's world
- **Spread 3→4**: Transition to adventure

### Act 2 Page Turns (Building Tension)
- **Spread 4→5**: First attempt with hope
- **Spread 5→6**: Failure creates sympathy
- **Spread 6→7**: New information/helper
- **Spread 7→8**: Second failure, more dramatic
- **Spread 8→9**: Crisis moment
- **Spread 9→10**: Preparation builds anticipation
- **Spread 10→11**: Most daring attempt

### Act 3 Page Turns (Resolution)
- **Spread 11→12**: Tension peaks
- **Spread 12→13**: Success and celebration
- **Spread 13→14**: Growth and new normal

## Arc Structure Guidelines

### Emotional Flow
- **Act 1**: Establish happiness/peace
- **Act 2**: Build frustration/struggle through attempts
- **Act 3**: Resolve with triumph/growth

### Story Progression
- **Rising tension**: Each attempt increases stakes
- **Character agency**: Character drives the action
- **Clear causality**: Each event leads to the next
- **Satisfying resolution**: Problem solved through character action

## Output Format

Generate JSON matching StoryArcSchema in the following sequence:

### Step 1: Create Three-Act Structure
- **three_act_structure**: Define the 3 acts with clear descriptions
- Establish overall story flow and emotional progression

### Step 2: Create Fourteen-Spread Structure  
- **fourteen_spread_structure**: Create 14 spreads with detailed descriptions
- Assign each spread to the appropriate act (1-3, 4-10, 11-14)
- Ensure spreads follow the page turn strategy and build proper tension

Create compelling story arcs that build tension and provide satisfying narrative structure for young readers.