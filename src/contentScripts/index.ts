/* eslint-disable no-console */
import { createApp } from 'vue'
import App from './views/App.vue'
import { setupApp } from '~/logic/common-setup'

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  console.info('[Iconfont Viewer] Hello world from content script')

  const applyIconfontStyle = (container: Node) => {
    const styleEl = document.createElement('link')
    styleEl.setAttribute('rel', 'stylesheet')
    styleEl.setAttribute('href', location.href)
    container.appendChild(styleEl)
  }

  // mount component to context window
  const container = document.createElement('div')
  container.id = `${__NAME__}-extension`
  container.style.display = 'none'
  const root = document.createElement('div')
  const styleEl = document.createElement('link')
  const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
  applyIconfontStyle(document.head)
  applyIconfontStyle(shadowDOM)
  shadowDOM.appendChild(styleEl)
  shadowDOM.appendChild(root)
  document.body.appendChild(container)
  const app = createApp(App)
  setupApp(app)
  app.mount(root)
})()
