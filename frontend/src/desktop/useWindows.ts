import { reactive, markRaw, type Component } from 'vue'
import type { AppDef } from './registry'
import { playSound } from './sound'

export interface WinState {
  id: number
  appId: string
  title: string
  icon: string
  component: Component
  x: number
  y: number
  w: number
  h: number
  z: number
  minimized: boolean
  maximized: boolean
  frameless: boolean
}

let uid = 0
let topZ = 10
const windows = reactive<WinState[]>([])

function focus(win: WinState) {
  win.z = ++topZ
  win.minimized = false
}

function open(app: AppDef): WinState {
  const existing = windows.find((w) => w.appId === app.id)
  if (existing) {
    focus(existing)
    return existing
  }
  const n = windows.length
  const win: WinState = reactive({
    id: ++uid,
    appId: app.id,
    title: app.title,
    icon: app.icon,
    component: markRaw(app.component),
    x: 500 + (n % 6) * 28,
    y: 32 + (n % 6) * 28,
    w: app.w,
    h: app.h,
    z: ++topZ,
    minimized: false,
    maximized: false,
    frameless: app.frameless ?? false,
  })
  windows.push(win)
  playSound(app.id === 'bin' ? 'recycle' : 'restore')
  return win
}

function close(win: WinState) {
  const i = windows.indexOf(win)
  if (i >= 0) windows.splice(i, 1)
}

function minimize(win: WinState) {
  win.minimized = true
  playSound('minimize')
}

function toggleMaximize(win: WinState) {
  win.maximized = !win.maximized
}

// Clic sur le bouton de la barre des tâches : focus, ou minimise si déjà au premier plan.
function taskbarToggle(win: WinState) {
  const isTop = windows.every((w) => w.minimized || w.z <= win.z)
  if (win.minimized) focus(win)
  else if (isTop) minimize(win)
  else focus(win)
}

function reset() {
  windows.splice(0, windows.length)
  topZ = 10
}

export function useWindows() {
  return { windows, open, close, focus, minimize, toggleMaximize, taskbarToggle, reset }
}
