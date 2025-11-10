---
name: finalize-dependencies
description: Clean up dependencies - install winners (if any), remove exploration cruft. Most games are dependency-free.
allowed-tools: '*'
---

# Finalize Dependencies

Install final chosen libraries (if any), remove experimental ones.

**NOTE:** Most browser games will be dependency-free except for Biome (linting).

## Process

Read `explore-implementation-options` report for chosen stack.

```bash
cd code/{game-name}-gen

# Remove exploration deps (if any were tested)
bun remove [experimental-libs]

# Ensure winners are installed (rarely needed)
# Most games use vanilla JS/CSS only

# Verify
bun install
```

Check `package.json` - should be minimal (usually just @biomejs/biome).

## Report Format

```markdown
## Finalize: Dependencies

**Final Stack:**
- @biomejs/biome (dev - linting)
- [any CDN libraries noted for HTML script tags]

**Removed:** [experimental deps]

**Status:** ✅ Clean, minimal dependencies

**Next:** design-variation-logic
```

## Notes

- Prefer vanilla JS/CSS over dependencies
- CDN libraries don't count as package.json deps
- Keep exploration test files for reference
- Working dir: `code/{game-name}-gen/`
