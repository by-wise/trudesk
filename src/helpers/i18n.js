'use strict'

const fs = require('fs')
const path = require('path')

const LOCALES_DIR = path.join(__dirname, '../../locales')

function normalizeLocale (locale) {
  if (locale === 'pt') return 'pt-BR'
  if (locale === 'en') return 'en-US'
  return locale
}

function loadTranslations (locale) {
  const normalized = normalizeLocale(locale)
  const dir = path.join(LOCALES_DIR, normalized)
  const translations = {}
  try {
    const files = fs
      .readdirSync(dir)
      .filter(f => f.endsWith('.json'))
      .sort()
    if (files.length === 0) throw new Error('No locale files found for ' + normalized)
    files.forEach(file => Object.assign(translations, require(path.join(dir, file))))
  } catch (e) {
    if (normalized !== 'en-US') return loadTranslations('en-US')
  }
  return translations
}

function getAvailableLanguages () {
  try {
    const dirs = fs.readdirSync(LOCALES_DIR).filter(f => fs.statSync(path.join(LOCALES_DIR, f)).isDirectory())
    return dirs.map(dir => {
      const dict = loadTranslations(dir)
      const name = dict.LOCALE_NAME || dir
      const emoji = dict.LOCALE_EMOJI || ''
      return { value: dir, text: (emoji ? emoji + ' ' : '') + name }
    })
  } catch (e) {
    return [
      { value: 'en-US', text: '🇺🇸 English' },
      { value: 'pt-BR', text: '🇧🇷 Português' }
    ]
  }
}

module.exports = { loadTranslations, normalizeLocale, getAvailableLanguages }
