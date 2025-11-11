---
name: explore-implementation-options
description: Test CDN libraries, Bun server patterns, browser APIs. Try multiple approaches before committing.
allowed-tools: '*'
---

# Explore Implementation Options

Experiment with browser libraries and patterns. Write real code to compare options.

## What to Explore

Identify technology decisions for browser game development:

**Potential areas:**
- CDN libraries (if any - prefer vanilla)
- Bun server patterns (static file serving, routing)
- Browser APIs (keyboard events, DOM manipulation, localStorage)
- Animation approaches (CSS transitions vs JS)
- Game state management patterns
- Data structure for decision trees

## Process

1. Identify 2-4 approaches per decision point
2. Test CDN libraries via HTML script tags
3. Write comparison scripts testing real use cases
4. Evaluate trade-offs: features, simplicity, bundle size, browser compatibility
5. Choose winners with clear reasoning (vanilla preferred)

## Evaluation Criteria

- Does it provide needed capabilities?
- Can it be used via CDN or vanilla implementation?
- Is the API simple and intuitive?
- What's the performance impact?
- Is it actively maintained and browser-compatible?
- Can we achieve the same with vanilla JS/CSS?

## Report Format

```markdown
## Explore: Implementation Options

### Decision: {area}
**Tested:** {candidate1, candidate2, vanilla approach}
**Winner:** {chosen option}
**Reasoning:** {why this over others}

**Keep:** {final dependencies/CDN libraries}
**Remove:** {experimental dependencies}

**Next:** finalize-dependencies
```
