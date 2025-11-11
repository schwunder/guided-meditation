---
name: check-code-quality
description: Run all quality checks (lint, manual testing). Final verification.
allowed-tools: '*'
---

# Check Code Quality

Run all quality checks. Final guardrail before completion.

## Checks

```bash
cd code/{game-name}-gen

# 1. Lint
bun run lint

# 2. Start server and test manually
bun server.js
# Open browser to http://localhost:3000 (or configured port)
```

## Quality Criteria

- ✅ Zero lint errors/warnings
- ✅ Server starts without errors
- ✅ Game loads in browser
- ✅ Keyboard navigation works
- ✅ All decision paths reachable
- ✅ No console errors in DevTools
- ✅ UI updates correctly on interactions
- ✅ Clean, readable code

## Report Format

```markdown
## Quality: Check Results

**Lint:** ✅ 0 errors, 0 warnings
**Server:** ✅ Starts successfully
**Browser:** ✅ Game playable, no console errors
**Navigation:** ✅ All keyboard controls work

**Summary:** ✅ All quality checks pass

**Status:** 🎉 Game ready to play
```

## Notes

Hooks will auto-run during implementation. This is final verification.
