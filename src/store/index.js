const ctx = require.context('@/pages', true, /.*-store\.js$/)
import React from 'react'
import homeStore from '../pages/home/home-store'
import appStore from './app-store'

const modules = {}

const kebabToCamel = (str) => str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())

ctx.keys().forEach(key => {
  const fileName = key.replace(/^.*\/(.*?)\.js$/, '$1') 
  const moduleName = kebabToCamel(fileName)               
  
  modules[moduleName] = ctx(key).default
})

export const store = {
  ...modules,
  appStore,
  // homeStore
}

export const StoreContext = React.createContext(store)