# Theme Color Values

Source theme files:

- `src/renderer/assets/themes/royal-blue.theme.css`
- `src/renderer/assets/themes/home.theme.css`
- `src/renderer/assets/themes/micron.theme.css`
- `src/renderer/assets/themes/micron-dark.theme.css`
- `src/renderer/assets/themes/sitebrief.theme.css`

The heading color is the resolved value of `--editorColor80`, used by the common Muya heading rule. The quoted cell colors below use the table inline-code rule (`td code`), where the background is `--codeBlockBgColor` and the foreground is `--editorColor`.

| Theme | Background | Font color | Quoted cell background | Quoted cell foreground | Heading color |
| --- | --- | --- | --- | --- | --- |
| Royal Blue | `#0f172a` | `#f1f5f9` | `#385b94` | `#f1f5f9` | `rgba(241, 245, 249, .8)` |
| Home | `#1a1c2c` | `#f0f2f5` | `rgba(18, 17, 17, .25)` | `#f0f2f5` | `rgba(240, 242, 245, .8)` |
| Micron | `#dbd1c2` | `#2c3e50` | `rgba(112, 82, 62, .82)` | `#fbeabc` | `rgba(69, 52, 28, .8)` |
| Micron Dark | `#181614` | `#f4e8d5` | `rgba(63, 44, 32, .92)` | `#fbeabc` | `rgba(251, 234, 188, .84)` |
| SiteBrief | `#f7f2ea` | `#1f3348` | `rgba(255, 255, 255, .72)` | `#1f3348` | `rgba(31, 51, 72, .8)` |

Related blockquote foreground overrides:

| Theme | Blockquote foreground |
| --- | --- |
| Royal Blue | `rgba(241, 245, 249, .68)` |
| Home | `rgba(240, 242, 245, .68)` |
| Micron | `rgba(217, 217, 216, .72)` |
| Micron Dark | `rgba(251, 234, 188, .72)` |
| SiteBrief | `rgba(31, 51, 72, .66)` |
