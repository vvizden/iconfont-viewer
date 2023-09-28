import type { Tabs } from 'webextension-polyfill'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}

browser.runtime.onInstalled.addListener(async (): Promise<void> => {
  browser.action.setBadgeText({
    text: 'ON',
  })
})

browser.webNavigation.onCompleted.addListener(async () => {
  const tab = await getCurrentTab()
  if (tab) {
    const state = await browser.action.getBadgeText({})
    await toggleViewer(tab, state)
  }
})

browser.tabs.onActivated.addListener(async () => {
  const tab = await getCurrentTab()
  if (tab) {
    const state = await browser.action.getBadgeText({})
    await toggleViewer(tab, state)
  }
})

browser.action.onClicked.addListener(async (tab) => {
  // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
  const prevState = await browser.action.getBadgeText({})
  // Next state will always be the opposite
  const nextState = prevState === 'ON' ? 'OFF' : 'ON'

  await toggleViewer(tab, nextState)
})

function toggle(enable = false) {
  const target = document.getElementById(`${__NAME__}-extension`)
  if (target) {
    target.style.display = enable ? 'block' : 'none'
    document.body.style.overflow = enable ? 'hidden' : 'initial'
  }
}

async function getCurrentTab(): Promise<Tabs.Tab | undefined> {
  const queryOptions = { active: true, lastFocusedWindow: true }
  const [tab] = await browser.tabs.query(queryOptions)
  return tab
}

async function toggleViewer(tab: Tabs.Tab, state: string) {
  if (tab.url?.endsWith('.css') && tab.id) {
    // Set the action badge to the next state
    await browser.action.setBadgeText({
      text: state,
    })

    if (state === 'ON') {
      await browser.scripting.executeScript({
        args: [true],
        func: toggle,
        target: { tabId: tab.id },
      })
    }
    else if (state === 'OFF') {
      await browser.scripting.executeScript({
        args: [false],
        func: toggle,
        target: { tabId: tab.id },
      })
    }
  }
}
