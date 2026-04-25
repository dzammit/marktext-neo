<template>
  <div>
    <div
      class="title-bar-editor-bg"
      :class="{ 'tabs-visible': showTabBar }"
    ></div>
    <div
      class="title-bar"
      :class="[{ 'active': active }, { 'tabs-visible': showTabBar }, { 'frameless': titleBarStyle === 'custom' }, { 'isOsx': isOsx }]"
    >
      <div class="title" @dblclick.stop="toggleMaxmizeOnMacOS"></div>
      <div v-if="showCustomTitleBar" class="left-toolbar title-no-drag">
        <button
          v-for="(item, index) in menuItems"
          :key="index"
          class="top-menu-item title-no-drag"
          :class="{ 'menu-active': activeMenuIndex === index }"
          type="button"
          @click.stop="handleMenuClick(item, index, $event)"
          @mouseover.stop="handleMenuMouseOver(item, index, $event)"
        >
          {{ item.label }}
        </button>
        <ul
          v-if="menuOpen && activeMenuItems.length"
          class="top-menu-dropdown title-no-drag"
          :style="menuDropdownStyle"
          @mousedown.stop
        >
          <template v-for="(item, index) in activeMenuItems">
            <li
              v-if="item.type === 'separator'"
              :key="`separator-${index}`"
              class="menu-separator"
            ></li>
            <li
              v-else-if="item.visible !== false"
              :key="index"
              class="menu-entry"
              :class="[{ disabled: !item.enabled }, { checked: item.checked }, { submenu: item.children.length }]"
              @click.stop="activateMenuItem(item)"
            >
              <span class="menu-check">{{ item.checked ? '✓' : '' }}</span>
              <span class="menu-label">{{ item.label }}</span>
              <span class="menu-accelerator">{{ item.accelerator || '' }}</span>
              <span class="menu-arrow">{{ item.children.length ? '›' : '' }}</span>
              <ul v-if="item.children.length" class="nested-menu">
                <template v-for="(child, childIndex) in item.children">
                  <li
                    v-if="child.type === 'separator'"
                    :key="`separator-${childIndex}`"
                    class="menu-separator"
                  ></li>
                  <li
                    v-else-if="child.visible !== false"
                    :key="childIndex"
                    class="menu-entry"
                    :class="[{ disabled: !child.enabled }, { checked: child.checked }, { submenu: child.children.length }]"
                    @click.stop="activateMenuItem(child)"
                  >
                    <span class="menu-check">{{ child.checked ? '✓' : '' }}</span>
                    <span class="menu-label">{{ child.label }}</span>
                    <span class="menu-accelerator">{{ child.accelerator || '' }}</span>
                    <span class="menu-arrow">{{ child.children.length ? '›' : '' }}</span>
                    <ul v-if="child.children.length" class="nested-menu">
                      <template v-for="(grandchild, grandchildIndex) in child.children">
                        <li
                          v-if="grandchild.type === 'separator'"
                          :key="`separator-${grandchildIndex}`"
                          class="menu-separator"
                        ></li>
                        <li
                          v-else-if="grandchild.visible !== false"
                          :key="grandchildIndex"
                          class="menu-entry"
                          :class="[{ disabled: !grandchild.enabled }, { checked: grandchild.checked }]"
                          @click.stop="activateMenuItem(grandchild)"
                        >
                          <span class="menu-check">{{ grandchild.checked ? '✓' : '' }}</span>
                          <span class="menu-label">{{ grandchild.label }}</span>
                          <span class="menu-accelerator">{{ grandchild.accelerator || '' }}</span>
                          <span class="menu-arrow"></span>
                        </li>
                      </template>
                    </ul>
                  </li>
                </template>
              </ul>
            </li>
          </template>
        </ul>
      </div>
      <div
        v-if="titleBarStyle === 'custom' && !isFullScreen && !isOsx"
        class="right-toolbar"
        :class="[{ 'title-no-drag': titleBarStyle === 'custom' }]"
      >
        <div class="frameless-titlebar-button frameless-titlebar-close" @click.stop="handleCloseClick">
          <div>
            <svg width="10" height="10">
              <path :d="windowIconClose" />
            </svg>
          </div>
        </div>
        <div class="frameless-titlebar-button frameless-titlebar-toggle" @click.stop="handleMaximizeClick">
          <div>
            <svg width="10" height="10">
              <path v-show="!isMaximized" :d="windowIconMaximize" />
              <path v-show="isMaximized" :d="windowIconRestore" />
            </svg>
          </div>
        </div>
        <div class="frameless-titlebar-button frameless-titlebar-minimize" @click.stop="handleMinimizeClick">
          <div>
            <svg width="10" height="10">
              <path :d="windowIconMinimize" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { getCurrentWindow, Menu as RemoteMenu } from '@electron/remote'
import { mapState } from 'vuex'
import { minimizePath, restorePath, maximizePath, closePath } from '../../assets/window-controls.js'
import { isOsx } from '@/util'

export default {
  data () {
    this.isOsx = isOsx
    this.windowIconMinimize = minimizePath
    this.windowIconRestore = restorePath
    this.windowIconMaximize = maximizePath
    this.windowIconClose = closePath
    return {
      isFullScreen: getCurrentWindow().isFullScreen(),
      isMaximized: getCurrentWindow().isMaximized(),
      menuOpen: false,
      activeMenuIndex: -1,
      activeMenuItems: [],
      menuLeft: 0,
      menuVersion: 0,
      menuPalette: {
        background: 'var(--floatBgColor)',
        color: 'var(--floatFontColor)',
        hoverBackground: 'var(--floatHoverColor)',
        hoverColor: 'var(--editorColor)',
        border: 'var(--floatBorderColor)',
        separator: 'var(--editorColor10)'
      }
    }
  },
  created () {
    ipcRenderer.on('mt::window-maximize', this.onMaximize)
    ipcRenderer.on('mt::window-unmaximize', this.onUnmaximize)
    ipcRenderer.on('mt::window-enter-full-screen', this.onEnterFullScreen)
    ipcRenderer.on('mt::window-leave-full-screen', this.onLeaveFullScreen)
    ipcRenderer.on('mt::user-preference', this.handleUserPreferenceChanged)
    document.addEventListener('mousedown', this.closeMenu)
    document.addEventListener('keydown', this.handleKeydown)
    window.addEventListener('blur', this.closeMenu)
  },
  props: {
    project: Object,
    filename: String,
    active: Boolean
  },
  computed: {
    ...mapState({
      titleBarStyle: state => state.preferences.titleBarStyle,
      showTabBar: state => state.layout.showTabBar
    }),
    menuItems () {
      if (this.menuVersion < 0) return []
      const menu = RemoteMenu.getApplicationMenu()
      return menu && menu.items
        ? menu.items
          .filter(item => item.visible !== false)
          .map(item => this.toMenuViewModel(item))
        : []
    },
    showCustomTitleBar () {
      return this.titleBarStyle === 'custom' && !this.isOsx
    },
    menuDropdownStyle () {
      return {
        left: `${this.menuLeft}px`,
        background: this.menuPalette.background,
        color: this.menuPalette.color,
        borderColor: this.menuPalette.border,
        '--menuBgColor': this.menuPalette.background,
        '--menuColor': this.menuPalette.color,
        '--menuHoverBgColor': this.menuPalette.hoverBackground,
        '--menuHoverColor': this.menuPalette.hoverColor,
        '--menuBorderColor': this.menuPalette.border,
        '--menuSeparatorColor': this.menuPalette.separator
      }
    }
  },
  watch: {
    filename: function (value) {
      // Set filename when hover on dock
      const hasOpenFolder = this.project && this.project.name
      let title = ''
      if (value) {
        title = hasOpenFolder ? `${value} - ${this.project.name}` : `${value} - MarkText`
      } else {
        title = hasOpenFolder ? this.project.name : 'MarkText'
      }

      document.title = title
    }
  },
  methods: {
    handleCloseClick () {
      getCurrentWindow().close()
    },

    handleMaximizeClick () {
      const win = getCurrentWindow()
      if (win.isFullScreen()) {
        win.setFullScreen(false)
      } else if (win.isMaximized()) {
        win.unmaximize()
      } else {
        win.maximize()
      }
    },

    toggleMaxmizeOnMacOS () {
      if (this.isOsx) {
        this.handleMaximizeClick()
      }
    },

    handleMinimizeClick () {
      getCurrentWindow().minimize()
    },

    handleMenuClick (item, index, event) {
      if (this.menuOpen && index === this.activeMenuIndex) {
        this.closeMenu()
      } else {
        this.openTopMenu(item, index, event.currentTarget)
      }
    },

    handleMenuMouseOver (item, index, event) {
      if (this.menuOpen && index !== this.activeMenuIndex) {
        this.openTopMenu(item, index, event.currentTarget)
      }
    },

    openTopMenu (item, index, target) {
      if (!item || !item.children.length) return

      const rect = target.getBoundingClientRect()
      target.blur()
      this.menuPalette = this.getMenuPalette()
      this.activeMenuIndex = index
      this.activeMenuItems = item.children
      this.menuLeft = Math.round(rect.left)
      this.menuOpen = true
    },

    closeMenu () {
      this.menuOpen = false
      this.activeMenuIndex = -1
      this.activeMenuItems = []
    },

    handleKeydown (event) {
      if (event.key === 'Escape') {
        this.closeMenu()
      }
    },

    activateMenuItem (item) {
      if (!item.enabled || item.children.length) return

      if (item.raw && typeof item.raw.click === 'function') {
        item.raw.click(item.raw, getCurrentWindow(), null)
      }

      this.$nextTick(() => {
        this.refreshActiveMenuItems()
        this.closeMenu()
      })
    },

    getMenuLabel (item) {
      return (item.label || '').replace(/&/g, '')
    },

    toMenuViewModel (item) {
      const submenu = item.submenu && item.submenu.items ? item.submenu.items : []
      return {
        raw: item,
        label: this.getMenuLabel(item),
        type: item.type,
        visible: item.visible !== false,
        enabled: item.enabled !== false,
        checked: !!item.checked,
        accelerator: item.accelerator || '',
        children: submenu
          .filter(child => child.visible !== false || child.type === 'separator')
          .map(child => this.toMenuViewModel(child))
      }
    },

    refreshActiveMenuItems () {
      if (!this.menuOpen || this.activeMenuIndex < 0) return

      const item = this.menuItems[this.activeMenuIndex]
      if (!item || !item.children.length) {
        this.closeMenu()
        return
      }

      this.activeMenuItems = item.children
    },

    handleUserPreferenceChanged (event, preference) {
      if (preference && preference.theme) {
        this.menuVersion += 1
        this.$nextTick(this.refreshActiveMenuItems)
      }
    },

    getMenuPalette () {
      const style = window.getComputedStyle(document.documentElement)
      const getVar = (name, fallback) => style.getPropertyValue(name).trim() || fallback
      const editorBackground = getVar('--editorBgColor', '#ffffff')
      const editorColor = getVar('--editorColor', '#202020')
      const themeColor = getVar('--themeColor', editorColor)
      const background = this.mixColors(editorBackground, editorColor, 0.08) || editorBackground
      const color = editorColor
      const hoverBackground = this.mixColors(editorBackground, themeColor, 0.18) || getVar('--selectionColor', 'rgba(0, 0, 0, .06)')
      const hoverColor = getVar('--sideBarTitleColor', editorColor)

      return {
        background,
        color,
        hoverBackground,
        hoverColor,
        border: this.mixColors(editorBackground, editorColor, 0.2) || getVar('--editorColor10', 'rgba(0, 0, 0, .1)'),
        separator: this.mixColors(editorBackground, editorColor, 0.16) || getVar('--editorColor10', 'rgba(0, 0, 0, .1)')
      }
    },

    parseColor (value) {
      const raw = value.trim()
      const hex = raw.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
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

      const rgba = raw.match(/^rgba?\(\s*([.\d]+)\s*,\s*([.\d]+)\s*,\s*([.\d]+)(?:\s*,\s*([.\d]+))?\s*\)$/i)
      if (!rgba) return null

      return {
        red: Number(rgba[1]),
        green: Number(rgba[2]),
        blue: Number(rgba[3]),
        alpha: rgba[4] === undefined ? 1 : Number(rgba[4])
      }
    },

    mixColors (baseValue, overlayValue, amount) {
      const base = this.parseColor(baseValue)
      const overlay = this.parseColor(overlayValue)
      if (!base || !overlay) return null

      const normalize = color => ({
        red: color.red * color.alpha + 255 * (1 - color.alpha),
        green: color.green * color.alpha + 255 * (1 - color.alpha),
        blue: color.blue * color.alpha + 255 * (1 - color.alpha)
      })
      const normalizedBase = normalize(base)
      const normalizedOverlay = normalize(overlay)
      const mix = channel => Math.round(normalizedBase[channel] * (1 - amount) + normalizedOverlay[channel] * amount)
      return `rgb(${mix('red')}, ${mix('green')}, ${mix('blue')})`
    },

    onMaximize () {
      this.isMaximized = true
    },
    onUnmaximize () {
      this.isMaximized = false
    },
    onEnterFullScreen () {
      this.isFullScreen = true
    },
    onLeaveFullScreen  () {
      this.isFullScreen = false
    }
  },
  beforeDestroy () {
    document.removeEventListener('mousedown', this.closeMenu)
    document.removeEventListener('keydown', this.handleKeydown)
    window.removeEventListener('blur', this.closeMenu)
    ipcRenderer.off('mt::window-maximize', this.onMaximize)
    ipcRenderer.off('mt::window-unmaximize', this.onUnmaximize)
    ipcRenderer.off('mt::window-enter-full-screen', this.onEnterFullScreen)
    ipcRenderer.off('mt::window-leave-full-screen', this.onLeaveFullScreen)
    ipcRenderer.off('mt::user-preference', this.handleUserPreferenceChanged)
  }
}
</script>

<style scoped>
  .title-bar-editor-bg {
    height: var(--titleBarHeight);
    background: var(--editorBgColor);
    position: relative;
    left: 0;
    top: 0;
    right: 0;
  }
  .title-bar {
    -webkit-app-region: drag;
    user-select: none;
    background: transparent;
    height: var(--titleBarHeight);
    box-sizing: border-box;
    color: var(--editorColor50);
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    z-index: 2;
    transition: color .4s ease-in-out;
    cursor: default;
  }
  .active {
    color: var(--editorColor);
  }
  img {
    height: 90%;
    margin-top: 1px;
    vertical-align: top;
  }
  .title {
    padding: 0 142px 0 320px;
    height: 100%;
  }

  .left-toolbar {
    padding: 0 8px;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    width: auto;
    max-width: calc(100% - 138px);
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: visible;
  }
  .top-menu-item {
    height: 24px;
    padding: 0 9px;
    border: 0;
    border-radius: 3px;
    background: transparent;
    color: var(--editorColor60);
    font-size: 13px;
    line-height: 24px;
    font-family: inherit;
    cursor: default;
    transition: background .15s ease-in-out, color .15s ease-in-out;
    &:hover,
    &.menu-active {
      background: var(--sideBarItemHoverBgColor);
      color: var(--editorColor);
    }
    &:focus {
      outline: none;
    }
  }
  .top-menu-dropdown,
  .nested-menu {
    position: fixed;
    min-width: 230px;
    margin: 0;
    padding: 4px 0;
    list-style: none;
    border: 1px solid var(--menuBorderColor);
    border-radius: 4px;
    background: var(--menuBgColor);
    color: var(--menuColor);
    box-shadow: var(--floatShadow);
    z-index: 2000;
  }
  .top-menu-dropdown {
    top: var(--titleBarHeight);
  }
  .nested-menu {
    display: none;
    top: -5px;
    left: 100%;
  }
  .menu-entry {
    position: relative;
    height: 26px;
    padding: 0 26px 0 28px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-sizing: border-box;
    white-space: nowrap;
    font-size: 13px;
    line-height: 26px;
    cursor: default;
  }
  .menu-entry:hover {
    background: var(--menuHoverBgColor);
    color: var(--menuHoverColor);
  }
  .menu-entry.disabled {
    opacity: .45;
  }
  .menu-entry.disabled:hover {
    background: transparent;
    color: var(--menuColor);
  }
  .menu-entry.submenu:hover > .nested-menu {
    display: block;
  }
  .menu-check {
    width: 14px;
    margin-left: -20px;
    color: var(--themeColor);
    text-align: center;
    flex: 0 0 auto;
  }
  .menu-label {
    flex: 1 1 auto;
  }
  .menu-accelerator {
    color: var(--editorColor40);
    flex: 0 0 auto;
  }
  .menu-arrow {
    width: 8px;
    margin-right: -14px;
    color: var(--editorColor40);
    text-align: right;
    flex: 0 0 auto;
  }
  .menu-separator {
    height: 1px;
    margin: 4px 8px;
    background: var(--menuSeparatorColor);
  }
  .right-toolbar {
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    width: 138px;
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
  }

  .title-no-drag {
    -webkit-app-region: no-drag;
  }
  /* frameless window controls */
  .frameless-titlebar-button {
    position: relative;
    display: block;
    width: 46px;
    height: var(--titleBarHeight);
  }
  .frameless-titlebar-button > div {
    position: absolute;
    display: inline-flex;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
  .frameless-titlebar-close:hover {
    background-color: rgb(228, 79, 79);
  }
  .frameless-titlebar-minimize:hover,
  .frameless-titlebar-toggle:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  .frameless-titlebar-button svg {
    fill: #000000
  }
  .frameless-titlebar-close:hover svg {
    fill: #ffffff
  }

  .text-center-vertical {
    display: inline-block;
    vertical-align: middle;
    line-height: normal;
  }
</style>
