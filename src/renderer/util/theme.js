import fs from 'fs'
import path from 'path'
import { ipcRenderer } from 'electron'
import { THEME_STYLE_ID, COMMON_STYLE_ID, DEFAULT_CODE_FONT_FAMILY, oneDarkThemes, railscastsThemes } from '../config'
import { dark, royalBlue, graphite, home, materialDark, micron, micronDark, oneDark, sitebrief, ulysses } from './themeColor'
import { isLinux } from './index'
import elementStyle from 'element-ui/lib/theme-chalk/index.css'

const ORIGINAL_THEME = '#409EFF'
const patchTheme = css => {
  return `@media not print {\n${css}\n}`
}

const THEME_OVERRIDES_STYLE_ID = 'ag-theme-overrides'
const THEME_OVERRIDES_FILE_NAME = 'theme-color-overrides.css'
const THEME_ALIASES = Object.freeze({
  'git-training': 'royal-blue',
  'home-ai': 'home',
  'micron-cctv': 'micron'
})

const normalizeTheme = theme => THEME_ALIASES[theme] || theme

const normalizeThemeOverrides = css => {
  return css
    .replace(/data-marktext-theme="git-training"/g, 'data-marktext-theme="royal-blue"')
    .replace(/data-marktext-theme="home-ai"/g, 'data-marktext-theme="home"')
    .replace(/data-marktext-theme="micron-cctv"/g, 'data-marktext-theme="micron"')
}

const getThemeOverrides = () => {
  const userDataPath = global.marktext && global.marktext.paths && global.marktext.paths.userDataPath
  if (!userDataPath) return ''

  const overridesPath = path.join(userDataPath, THEME_OVERRIDES_FILE_NAME)
  if (!fs.existsSync(overridesPath)) return ''

  try {
    return normalizeThemeOverrides(fs.readFileSync(overridesPath, 'utf8'))
  } catch (err) {
    console.warn(`Unable to read theme overrides from "${overridesPath}".`, err)
    return ''
  }
}

const applyThemeOverrides = () => {
  let styleEle = document.querySelector(`#${THEME_OVERRIDES_STYLE_ID}`)
  if (!styleEle) {
    styleEle = document.createElement('style')
    styleEle.id = THEME_OVERRIDES_STYLE_ID
    document.head.appendChild(styleEle)
  }
  styleEle.innerHTML = patchTheme(getThemeOverrides())
}

let currentTheme = 'light'
let isListeningForThemeOverrideUpdates = false

const parseCssColor = value => {
  const color = value.trim()
  const hex = color.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (hex) {
    const body = hex[1].length === 3
      ? hex[1].split('').map(char => char + char).join('')
      : hex[1]
    return {
      red: parseInt(body.slice(0, 2), 16),
      green: parseInt(body.slice(2, 4), 16),
      blue: parseInt(body.slice(4, 6), 16),
      alpha: 1
    }
  }

  const rgba = color.match(/^rgba?\(\s*([.\d]+)\s*,\s*([.\d]+)\s*,\s*([.\d]+)(?:\s*,\s*([.\d]+))?\s*\)$/i)
  if (!rgba) return null

  return {
    red: Number(rgba[1]),
    green: Number(rgba[2]),
    blue: Number(rgba[3]),
    alpha: rgba[4] === undefined ? 1 : Number(rgba[4])
  }
}

const isDarkColor = value => {
  const color = parseCssColor(value)
  if (!color) return false

  const red = color.red * color.alpha + 255 * (1 - color.alpha)
  const green = color.green * color.alpha + 255 * (1 - color.alpha)
  const blue = color.blue * color.alpha + 255 * (1 - color.alpha)
  const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255
  return luminance < 0.5
}

const syncNativeThemeSource = () => {
  const style = window.getComputedStyle(document.documentElement)
  const background = style.getPropertyValue('--editorBgColor')
  ipcRenderer.send('mt::set-native-theme-source', isDarkColor(background) ? 'dark' : 'light')
}

const getEmojiPickerPatch = () => {
  return isLinux
    ? '.ag-emoji-picker section .emoji-wrapper .item span { font-family: sans-serif, "Noto Color Emoji"; }'
    : ''
}

const getThemeCluster = themeColor => {
  const tintColor = (color, tint) => {
    let red = parseInt(color.slice(1, 3), 16)
    let green = parseInt(color.slice(3, 5), 16)
    let blue = parseInt(color.slice(5, 7), 16)
    if (tint === 0) { // when primary color is in its rgb space
      return [red, green, blue].join(',')
    } else {
      red += Math.round(tint * (255 - red))
      green += Math.round(tint * (255 - green))
      blue += Math.round(tint * (255 - blue))
      red = red.toString(16)
      green = green.toString(16)
      blue = blue.toString(16)
      return `#${red}${green}${blue}`
    }
  }

  const clusters = [{
    color: themeColor,
    variable: 'var(--themeColor)'
  }]
  for (let i = 9; i >= 1; i--) {
    clusters.push({
      color: tintColor(themeColor, Number((i / 10).toFixed(2))),
      variable: `var(--themeColor${10 - i}0)`
    })
  }

  return clusters
}

export const addThemeStyle = theme => {
  theme = normalizeTheme(theme)
  currentTheme = theme
  document.documentElement.setAttribute('data-marktext-theme', theme)

  const isCmRailscasts = railscastsThemes.includes(theme)
  const isCmOneDark = oneDarkThemes.includes(theme)
  const isDarkTheme = isCmOneDark || isCmRailscasts
  let themeStyleEle = document.querySelector(`#${THEME_STYLE_ID}`)
  if (!themeStyleEle) {
    themeStyleEle = document.createElement('style')
    themeStyleEle.id = THEME_STYLE_ID
    document.head.appendChild(themeStyleEle)
  }

  switch (theme) {
    case 'light':
      themeStyleEle.innerHTML = ''
      break
    case 'dark':
      themeStyleEle.innerHTML = patchTheme(dark())
      break
    case 'royal-blue':
      themeStyleEle.innerHTML = patchTheme(royalBlue())
      break
    case 'home':
      themeStyleEle.innerHTML = patchTheme(home())
      break
    case 'material-dark':
      themeStyleEle.innerHTML = patchTheme(materialDark())
      break
    case 'micron':
      themeStyleEle.innerHTML = patchTheme(micron())
      break
    case 'micron-dark':
      themeStyleEle.innerHTML = patchTheme(micronDark())
      break
    case 'ulysses':
      themeStyleEle.innerHTML = patchTheme(ulysses())
      break
    case 'graphite':
      themeStyleEle.innerHTML = patchTheme(graphite())
      break
    case 'one-dark':
      themeStyleEle.innerHTML = patchTheme(oneDark())
      break
    case 'sitebrief':
      themeStyleEle.innerHTML = patchTheme(sitebrief())
      break
    default:
      console.log('unknown theme')
      break
  }

  // workaround: use dark icons
  document.body.classList.remove('dark')
  if (isDarkTheme) {
    document.body.classList.add('dark')
  }

  // change CodeMirror theme
  const cm = document.querySelector('.CodeMirror')
  if (cm) {
    cm.classList.remove('cm-s-default')
    cm.classList.remove('cm-s-one-dark')
    cm.classList.remove('cm-s-railscasts')
    if (isCmOneDark) {
      cm.classList.add('cm-s-one-dark')
    } else if (isCmRailscasts) {
      cm.classList.add('cm-s-railscasts')
    } else {
      cm.classList.add('cm-s-default')
    }
  }

  applyThemeOverrides()
  syncNativeThemeSource()

  if (!isListeningForThemeOverrideUpdates) {
    ipcRenderer.on('mt::theme-overrides-updated', () => {
      addThemeStyle(currentTheme)
    })
    isListeningForThemeOverrideUpdates = true
  }
}

export const setEditorWidth = value => {
  const EDITOR_WIDTH_STYLE_ID = 'editor-width'
  let result = ''
  if (value && /^[0-9]+(?:ch|px|%)$/.test(value)) {
    // Overwrite the theme value and add 100px for padding.
    result = `:root { --editorAreaWidth: calc(100px + ${value}); }`
  }
  let styleEle = document.querySelector(`#${EDITOR_WIDTH_STYLE_ID}`)
  if (!styleEle) {
    styleEle = document.createElement('style')
    styleEle.setAttribute('id', EDITOR_WIDTH_STYLE_ID)
    document.head.appendChild(styleEle)
  }

  styleEle.innerHTML = result
}

export const addCommonStyle = options => {
  const { codeFontFamily, codeFontSize, hideScrollbar } = options
  let sheet = document.querySelector(`#${COMMON_STYLE_ID}`)
  if (!sheet) {
    sheet = document.createElement('style')
    sheet.id = COMMON_STYLE_ID
    document.head.appendChild(sheet)
  }

  let scrollbarStyle = ''
  if (hideScrollbar) {
    scrollbarStyle = '::-webkit-scrollbar {display: none;}'
  }

  sheet.innerHTML = `${scrollbarStyle}
span code,
td code,
th code,
code,
code[class*="language-"],
.CodeMirror,
pre.ag-paragraph {
font-family: ${codeFontFamily}, ${DEFAULT_CODE_FONT_FAMILY};
font-size: ${codeFontSize}px;
}

${getEmojiPickerPatch()}
`
}

export const addElementStyle = () => {
  const ID = 'mt-el-style'
  let sheet = document.querySelector(`#${ID}`)
  if (sheet) {
    return
  }
  const themeCluster = getThemeCluster(ORIGINAL_THEME)
  let newElementStyle = elementStyle
  for (const { color, variable } of themeCluster) {
    newElementStyle = newElementStyle.replace(new RegExp(color, 'ig'), variable)
  }
  sheet = document.createElement('style')
  sheet.id = ID
  // NOTE: Prepend element UI style, otherwise we cannot overwrite the style with the default light theme.
  document.head.insertBefore(sheet, document.head.firstChild)
  sheet.innerHTML = newElementStyle
}

// Append common sheet and theme at the end of head - order is important.
export const addStyles = options => {
  const { theme } = options
  addThemeStyle(theme)
  addCommonStyle(options)
}
