# Cursor IDE Setup Guide

This guide covers recommended Cursor IDE extensions and configuration for optimal development experience with the guided meditation project.

## Recommended Extensions

### Code Formatting & Linting

#### Biome
- **Extension ID**: `biomejs.biome`
- **Purpose**: Linting and formatting for JavaScript, TypeScript, JSON, and CSS
- **Why**: This project uses Biome.js (configured in `biome.json`) for consistent code style
- **Configuration**: Automatically uses `biome.json` in project root
- **Features**:
  - Auto-format on save
  - Linting errors inline
  - Fast formatting (written in Rust)

### Diagram & Visualization

#### Mermaid Preview
- **Extension ID**: `bierner.markdown-mermaid`
- **Purpose**: Preview Mermaid diagrams in markdown files
- **Why**: Project uses Mermaid for architecture and flow diagrams (stored in `mermaid diagrams/` folder)
- **Features**:
  - Live preview of Mermaid diagrams
  - Syntax highlighting
  - Export to SVG/PNG

#### Markdown Preview Enhanced
- **Extension ID**: `shd101wyy.markdown-preview-enhanced`
- **Purpose**: Enhanced markdown preview with Mermaid support
- **Why**: Better rendering of documentation files with embedded diagrams
- **Features**:
  - Mermaid diagram rendering
  - Math equation support
  - Export to PDF/HTML

### Code Organization

#### File Folding
- **Extension ID**: `maptz.regionfolder`
- **Purpose**: Fold code regions and organize file structure
- **Why**: Helps manage long HTML/CSS files and documentation
- **Features**:
  - Fold by regions (`//#region` comments)
  - Custom fold markers
  - Persistent fold states

#### Fold Plus
- **Extension ID**: `zokugun.fold-plus`
- **Purpose**: Enhanced code folding with more options
- **Why**: Better control over folding behavior for large files
- **Features**:
  - Fold all comments
  - Fold all imports
  - Custom fold patterns

### HTML & CSS

#### HTML CSS Support
- **Extension ID**: `ecmel.vscode-html-css`
- **Purpose**: CSS class name completion in HTML
- **Why**: Project uses utility classes (`.radiant-border`, `.caption`, `.choices`)
- **Features**:
  - Autocomplete CSS classes
  - Jump to definition
  - Show CSS usage

#### CSS Peek
- **Extension ID**: `pranaygp.vscode-css-peek`
- **Purpose**: Peek at CSS definitions from HTML
- **Why**: Quick navigation between HTML and CSS files
- **Features**:
  - Peek at CSS custom properties
  - Go to definition
  - Find all references

### Git Integration

#### GitLens
- **Extension ID**: `eamodio.gitlens`
- **Purpose**: Enhanced Git capabilities
- **Why**: Better visibility into project history and changes
- **Features**:
  - Inline blame annotations
  - File history
  - Commit search

### Productivity

#### Path Intellisense
- **Extension ID**: `christian-kohler.path-intellisense`
- **Purpose**: Autocomplete file paths
- **Why**: Quick navigation to assets in `public/assets/` folder
- **Features**:
  - Autocomplete file paths
  - Image preview
  - Path validation

#### Error Lens
- **Extension ID**: `usernamehw.errorlens`
- **Purpose**: Highlight errors and warnings inline
- **Why**: Quick visibility into Biome linting errors
- **Features**:
  - Inline error messages
  - Warning highlights
  - Error count in status bar

## Cursor-Specific Configuration

### Workspace Settings

Create `.vscode/settings.json` (or use Cursor's settings) with:

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[json]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[css]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "files.associations": {
    "*.mmd": "mermaid"
  },
  "markdown.mermaid.enablePreview": true,
  "files.exclude": {
    "**/.DS_Store": true,
    "**/node_modules": true
  }
}
```

### File Folding Configuration

To enable better folding for HTML/CSS files:

1. Install a file folding extension (see above)
2. Configure fold markers in code:
   ```html
   <!-- #region CSS Variables -->
   :root { ... }
   <!-- #endregion -->
   ```

3. Use Cursor's built-in folding:
   - `Cmd+K, Cmd+0` (Mac) or `Ctrl+K, Ctrl+0` (Windows/Linux) to fold all
   - `Cmd+K, Cmd+J` (Mac) or `Ctrl+K, Ctrl+J` (Windows/Linux) to unfold all

## Project-Specific Tips

### Working with Biome.js
- Biome automatically formats on save if configured
- Check `biome.json` for project-specific rules
- Run `npx @biomejs/biome check .` to see all linting issues

### Working with Mermaid Diagrams
- Store diagrams in `mermaid diagrams/` folder
- Use `.mmd` extension for pure Mermaid files
- Embed in markdown using:
  ````markdown
  ```mermaid
  graph TD
    A[Start] --> B[End]
  ```
  ````

### File Organization
- Keep `public/main.js` under ~200 lines
- Use CSS custom properties for theming
- Reference `.cursor/rules` for project conventions

## Troubleshooting

### Biome Not Formatting
- Check that Biome extension is installed
- Verify `biome.json` exists in project root
- Check Cursor settings for default formatter

### Mermaid Diagrams Not Rendering
- Install Mermaid preview extension
- Check file extension (`.mmd` or `.md` with mermaid code blocks)
- Verify syntax is correct

### File Folding Not Working
- Install a file folding extension
- Check if fold markers are in correct format
- Try Cursor's built-in folding shortcuts

## Additional Resources

- [Biome.js Documentation](https://biomejs.dev/)
- [Mermaid Documentation](https://mermaid.js.org/)
- [Cursor IDE Documentation](https://cursor.sh/docs)

