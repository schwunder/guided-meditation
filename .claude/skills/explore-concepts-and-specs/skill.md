# Explore Concepts and Specifications

Generate multiple concept approaches for meditation features/enhancements with full requirements, specifications, and goals. Automatically select the best one.

## Purpose

Explore different directions the meditation experience could take. Generate comprehensive requirements and specifications for each concept, then autonomously choose the most promising approach.

## Process

1. **Generate 3-5 Concept Options**
   - Each concept should be a distinct approach/direction
   - Consider: complexity, feasibility, user value, technical elegance, meditation context
   - Vary scope (simple vs ambitious) and focus (different feature sets)
   - Examples: choice branching mechanics, audio layer integration, progress persistence, ambient soundscapes, accessibility enhancements

2. **For Each Concept, Define:**

   **Requirements:**
   - Functional requirements (what it must do)
   - Non-functional requirements (performance, usability, constraints)
   - Must-haves vs nice-to-haves
   - Browser compatibility needs

   **Specifications:**
   - Technical approach/architecture
   - Data structures (JSON schema changes if needed)
   - Integration points with existing timeline/stage system
   - Constraints and boundaries

   **Goals:**
   - Success criteria
   - User experience goals (calm, flow, engagement)
   - Technical goals
   - Scope and timeline

   **Features:**
   - Core features (3-5 max)
   - Optional/future features
   - Feature interactions with existing system

   **Trade-offs:**
   - Pros (advantages, strengths)
   - Cons (limitations, challenges)
   - Complexity vs value analysis

3. **Automatic Selection**
   - Evaluate each concept against criteria:
     - Feasibility (can it be done with browser APIs?)
     - Elegance (clean integration with existing system?)
     - Value (enhances meditation experience?)
     - Scope (appropriate for current architecture?)
   - Choose the best concept with clear reasoning
   - Document why this concept beats the alternatives

## Output Format

**CONCEPTS.md** - All generated concepts

**CHOSEN.md** - Selected concept with full details:
```markdown
## Chosen Concept: [Name]

### Selection Reasoning
[Why this concept was chosen over alternatives]

### Requirements
**Functional:**
- [requirement 1]
- [requirement 2]

**Non-functional:**
- [constraint 1]
- [constraint 2]

### Specifications
**Architecture:** [approach]
**Data structures:** [JSON schema changes, new data models]
**Integration:** [how it fits with timeline/stage/media factory]
**Browser APIs:** [what browser features needed]

### Goals
- [success criterion 1]
- [success criterion 2]

### Features
**Core (must-have):**
1. [feature 1]
2. [feature 2]
3. [feature 3]

**Optional (future):**
- [enhancement 1]
- [enhancement 2]

### Trade-offs
**Advantages:**
- [pro 1]
- [pro 2]

**Limitations:**
- [con 1]
- [con 2]
```

**REPORT.md** - Summary for next skill

## Context

Current system:
- HTML-embedded sequences via data attributes (`readTimeline()` parses markup)
- Map-based media cache for images/videos
- Direct stage rendering from item data (no template cloning)
- Per-sequence hue theming via inline CSS variables
- Currently 2 sequences: "arrival" and "kitchen"
- Choices render but don't have interaction yet

See CLAUDE.md, notes/context.md, and existing code in public/main.js for details.

## Notes

- This skill runs autonomously - no user prompts
- Focus on 3-5 features max
- Consider browser capabilities and vanilla JS/CSS constraints
- Respect meditation experience (calm, non-jarring, accessible)
- Next skill (visualize-architecture) will diagram this chosen concept
