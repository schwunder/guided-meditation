---
name: initialize-project
description: Initialize empty code/*-gen/ repository with minimal dependencies. Pure setup - no feature code. (Rarely used - most games are existing repos)
allowed-tools: '*'
---

# Initialize Project

**NOTE:** This skill is rarely used. Most browser games will already exist, and you'll copy CLAUDE.md + .claude/ into them.

Use this skill only when creating a brand new game from scratch.

## Commands

```bash
mkdir -p code/{game-name}-gen
cd code/{game-name}-gen
bun init -y
bun add -d @biomejs/biome
```

Add to `package.json`:
```json
"scripts": {
  "lint": "biome check .",
  "dev": "bun server.js"
}
```

Use standard `biome.json` config.

## Report Format

```markdown
## Initialize: {game-name}-gen

**Status:** ✅ Created at `code/{game-name}-gen/`

**Dependencies:** @biomejs/biome (minimal, most games dependency-free)

**Next:** explore-concepts-and-specs
```

## Notes

- Keep dependencies minimal (usually just Biome for linting)
- Most games will be dependency-free
- Working dir: `code/{game-name}-gen/`
