## Finalize: Dependencies

### Final Stack

**Production:**
- ansi-escapes@7.2.0 (cursor/screen control utilities)

**Development:**
- @biomejs/biome@2.3.4 (linting)
- typescript@5.9.3 (type checking)
- @types/bun@1.3.1 (Bun type definitions)

**Native Bun APIs (zero-dependency):**
- process.stdin (keyboard input)
- process.stdout (terminal output)
- Raw ANSI escape codes (styling & colors)

### Removed Experimental Dependencies

**Styling libraries:**
- chalk (feature-rich but unnecessary)
- picocolors (too limited - no RGB)
- cli-boxes (manual box drawing preferred)

**Framework libraries:**
- blessed (outdated, compatibility issues)
- @types/blessed
- ink (React for terminals - too heavy)
- react (36 package overhead)
- @types/react

**Total removed:** 8 packages

### Architecture Decision

**Chosen:** Raw ANSI + functional rendering + manual layout

**Rationale:**
- Maximum control over rendering
- Minimal dependency footprint (1 prod dep)
- Direct RGB color manipulation
- Perfect for precise diff/comparison rendering
- No framework overhead
- Leverages Bun's native capabilities

### Verification

```bash
bun pm ls
```

**Result:** ✅ Clean dependency tree (11 total packages including transitive deps)

### Status

✅ Dependencies finalized
✅ Exploration packages removed
✅ Clean node_modules
✅ Ready for implementation

**Next:** design-variation-logic
