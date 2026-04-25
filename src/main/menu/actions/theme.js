import path from 'path'
import fs from 'fs'
import { app, BrowserWindow, ipcMain } from 'electron'
import { preferencesWinOptions } from '../../config'

let themeColorEditorWindow = null
let isListeningForOverrideUpdates = false

export const selectTheme = theme => {
  ipcMain.emit('set-user-preference', { theme })
}

export const openThemeColorEditor = browserWindow => {
  if (themeColorEditorWindow && !themeColorEditorWindow.isDestroyed()) {
    themeColorEditorWindow.focus()
    return
  }

  themeColorEditorWindow = new BrowserWindow(Object.assign({}, preferencesWinOptions, {
    width: 1200,
    height: 800,
    parent: browserWindow || undefined,
    modal: false,
    title: 'Theme Color Editor'
  }))

  const appEditorPath = path.join(app.getAppPath(), 'THEME_COLOR_EDITOR.html')
  const editorPath = fs.existsSync(appEditorPath)
    ? appEditorPath
    : path.join(process.cwd(), 'THEME_COLOR_EDITOR.html')
  themeColorEditorWindow.loadFile(editorPath, {
    query: {
      udp: app.getPath('userData')
    }
  })
  themeColorEditorWindow.on('closed', () => {
    themeColorEditorWindow = null
  })
}

if (!isListeningForOverrideUpdates) {
  ipcMain.on('mt::theme-overrides-updated', () => {
    BrowserWindow.getAllWindows().forEach(win => {
      if (!win.isDestroyed()) {
        win.webContents.send('mt::theme-overrides-updated')
      }
    })
  })
  isListeningForOverrideUpdates = true
}
