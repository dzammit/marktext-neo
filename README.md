<p align="center"><img src="static/logo-small.png" alt="MarkText Neo" width="100" height="100"></p>

<h1 align="center">MarkText Neo</h1>

<div align="center">
  <strong>A customized MarkText fork focused on theme control, denser layout, and richer editing feedback.</strong><br>
  <sub>Available for Linux, macOS and Windows.</sub>
</div>

<br>

## About

MarkText Neo is a personal/customized fork of [MarkText](https://github.com/marktext/marktext), the open-source realtime preview Markdown editor.

The original MarkText project emphasizes a clean, minimalist writing experience. MarkText Neo keeps the same core editor foundation, but moves in a more configurable direction: visible menus, richer theme customization, runtime color overrides, layout tweaks, and more status information while editing.

This fork is intended for users who like MarkText's editing model but want more control over how the application looks and presents information.

## Neo Changes

Current customizations include:

- Visible top-level menu bar on the custom title bar.
- Theme-aware custom dropdown menus.
- Runtime theme color overrides loaded from user data.
- Theme Color Editor for adjusting theme values without recompiling.
- Added and renamed themes, including Micron, Micron Dark, Royal Blue, Home, and SiteBrief.
- Footer status bar with file name, current row, and document statistics.
- Additional theme colors for quoted/table/code cell display.
- Custom titlebar enforcement so menus can follow theme colors instead of native light/dark rendering.

## Upstream Features

MarkText Neo inherits the main MarkText editor features:

- Realtime preview/WYSIWYG Markdown editing.
- CommonMark and GitHub Flavored Markdown support.
- Markdown extensions such as KaTeX math, front matter, and emojis.
- Source Code, Typewriter, and Focus editing modes.
- HTML and PDF export.
- Image paste support.
- Cross-platform Electron/Vue desktop application.

## Development

Use Yarn, matching the upstream project.

```bash
yarn install
yarn run dev
```

Useful commands:

```bash
yarn run lint
yarn run build:dev
yarn run build
```

See the upstream development docs in [docs/dev](docs/dev) for more detail.

## Relationship To MarkText

MarkText Neo is not the upstream MarkText project. It is a fork with a different UI and customization direction.

Original project:

- Repository: [marktext/marktext](https://github.com/marktext/marktext)
- Creator: [Jocs](https://github.com/Jocs)
- Contributors: [MarkText contributors](https://github.com/marktext/marktext/graphs/contributors)

Where possible, broadly useful fixes should still be considered for upstream contribution. MarkText Neo-specific interface and theme changes are maintained in this fork.

## License

MarkText Neo follows the original MarkText license. See [LICENSE](LICENSE).
