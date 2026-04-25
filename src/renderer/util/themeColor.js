import darkTheme from '../assets/themes/dark.theme.css'
import royalBlueTheme from '../assets/themes/royal-blue.theme.css'
import graphiteTheme from '../assets/themes/graphite.theme.css'
import homeTheme from '../assets/themes/home.theme.css'
import materialDarkTheme from '../assets/themes/material-dark.theme.css'
import micronTheme from '../assets/themes/micron.theme.css'
import micronDarkTheme from '../assets/themes/micron-dark.theme.css'
import oneDarkTheme from '../assets/themes/one-dark.theme.css'
import sitebriefTheme from '../assets/themes/sitebrief.theme.css'
import ulyssesTheme from '../assets/themes/ulysses.theme.css'

import darkPrismTheme from '../assets/themes/prismjs/dark.theme.css'
import oneDarkPrismTheme from '../assets/themes/prismjs/one-dark.theme.css'

export const dark = () => {
  return darkTheme + '\n' + darkPrismTheme
}

export const graphite = () => {
  return graphiteTheme
}

export const royalBlue = () => {
  return royalBlueTheme + '\n' + darkPrismTheme
}

export const home = () => {
  return homeTheme + '\n' + darkPrismTheme
}

export const materialDark = () => {
  return materialDarkTheme + '\n' + darkPrismTheme
}

export const micron = () => {
  return micronTheme
}

export const micronDark = () => {
  return micronDarkTheme + '\n' + darkPrismTheme
}

export const oneDark = () => {
  return oneDarkTheme + '\n' + oneDarkPrismTheme
}

export const sitebrief = () => {
  return sitebriefTheme
}

export const ulysses = () => {
  return ulyssesTheme
}
