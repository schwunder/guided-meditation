# Cursor IDE Setup Guide

Recommended extensions and configuration for optimal development experience.

## Recommended Extensions

### Code Formatting & Linting
**Biome** (`biomejs.biome`): Linting/formatting for JS/TS/JSON/CSS. Auto-format on save, inline errors, fast Rust-based formatting. Uses `biome.json` in project root.

### Diagram & Visualization
**Mermaid Preview** (`bierner.markdown-mermaid`): Preview Mermaid diagrams in markdown. Live preview, syntax highlighting, export to SVG/PNG. **Markdown Preview Enhanced** (`shd101wyy.markdown-preview-enhanced`): Enhanced markdown preview with Mermaid support, export to PDF/HTML.

### Code Organization
**File Folding** (`maptz.regionfolder`): Fold code regions via `//#region` comments. **Fold Plus** (`zokugun.fold-plus`): Enhanced folding with custom patterns, fold comments/imports.

### HTML & CSS
**HTML CSS Support** (`ecmel.vscode-html-css`): CSS class autocomplete in HTML, jump to definition. **CSS Peek** (`pranaygp.vscode-css-peek`): Peek at CSS definitions from HTML, find references.

### Git Integration
**GitLens** (`eamodio.gitlens`): Enhanced Git capabilities—inline blame, file history, commit search.

### Productivity
**Path Intellisense** (`christian-kohler.path-intellisense`): Autocomplete file paths, image preview. **Error Lens** (`usernamehw.errorlens`): Inline error/warning highlights, status bar error count.

## Workspace Settings

Create `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "[javascript]": { "editor.defaultFormatter": "biomejs.biome" },
  "[json]": { "editor.defaultFormatter": "biomejs.biome" },
  "[css]": { "editor.defaultFormatter": "biomejs.biome" },
  "files.associations": { "*.mmd": "mermaid" },
  "markdown.mermaid.enablePreview": true,
  "files.exclude": { "**/.DS_Store": true, "**/node_modules": true }
}
```

## File Folding

Use `//#region` comments or Cursor shortcuts: `Cmd+K, Cmd+0` (fold all), `Cmd+K, Cmd+J` (unfold all).

## Project-Specific Tips

**Biome.js:** Auto-formats on save. Check `biome.json` for rules. Run `npx @biomejs/biome check .` for linting issues.

**Mermaid Diagrams:** Store in `mermaid/` folder. Use `.mmd` extension or embed in markdown with ` ```mermaid ` code blocks.

**File Organization:** Keep `public/index.html` concise (all code inline). Use CSS custom properties for theming. Reference `.cursor/rules` for conventions.

## Troubleshooting

**Biome not formatting:** Verify extension installed, `biome.json` exists, check default formatter in settings.

**Mermaid not rendering:** Install preview extension, check file extension (`.mmd` or `.md` with mermaid blocks), verify syntax.

**Folding not working:** Install folding extension, check fold marker format, try built-in shortcuts.

## Resources

- [Biome.js](https://biomejs.dev/) | [Mermaid](https://mermaid.js.org/) | [Cursor IDE](https://cursor.sh/docs)
