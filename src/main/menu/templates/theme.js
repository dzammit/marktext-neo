import * as actions from '../actions/theme'

export default function (userPreference) {
  const { theme } = userPreference.getAll()
  return {
    label: '&Theme',
    id: 'themeMenu',
    submenu: [{
      label: 'Cadmium Light',
      type: 'radio',
      id: 'light',
      checked: theme === 'light',
      click (menuItem, browserWindow) {
        actions.selectTheme('light')
      }
    }, {
      label: 'Dark',
      type: 'radio',
      id: 'dark',
      checked: theme === 'dark',
      click (menuItem, browserWindow) {
        actions.selectTheme('dark')
      }
    }, {
      label: 'Royal Blue',
      type: 'radio',
      id: 'royal-blue',
      checked: theme === 'royal-blue',
      click (menuItem, browserWindow) {
        actions.selectTheme('royal-blue')
      }
    }, {
      label: 'Graphite Light',
      type: 'radio',
      id: 'graphite',
      checked: theme === 'graphite',
      click (menuItem, browserWindow) {
        actions.selectTheme('graphite')
      }
    }, {
      label: 'Home',
      type: 'radio',
      id: 'home',
      checked: theme === 'home',
      click (menuItem, browserWindow) {
        actions.selectTheme('home')
      }
    }, {
      label: 'Material Dark',
      type: 'radio',
      id: 'material-dark',
      checked: theme === 'material-dark',
      click (menuItem, browserWindow) {
        actions.selectTheme('material-dark')
      }
    }, {
      label: 'Micron',
      type: 'radio',
      id: 'micron',
      checked: theme === 'micron',
      click (menuItem, browserWindow) {
        actions.selectTheme('micron')
      }
    }, {
      label: 'Micron Dark',
      type: 'radio',
      id: 'micron-dark',
      checked: theme === 'micron-dark',
      click (menuItem, browserWindow) {
        actions.selectTheme('micron-dark')
      }
    }, {
      label: 'One Dark',
      type: 'radio',
      id: 'one-dark',
      checked: theme === 'one-dark',
      click (menuItem, browserWindow) {
        actions.selectTheme('one-dark')
      }
    }, {
      label: 'Ulysses Light',
      type: 'radio',
      id: 'ulysses',
      checked: theme === 'ulysses',
      click (menuItem, browserWindow) {
        actions.selectTheme('ulysses')
      }
    }, {
      label: 'SiteBrief',
      type: 'radio',
      id: 'sitebrief',
      checked: theme === 'sitebrief',
      click (menuItem, browserWindow) {
        actions.selectTheme('sitebrief')
      }
    }, {
      type: 'separator'
    }, {
      label: 'Theme Color Editor...',
      click (menuItem, browserWindow) {
        actions.openThemeColorEditor(browserWindow)
      }
    }]
  }
}
