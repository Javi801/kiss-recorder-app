import { registerPlugin } from '@capacitor/core'

const AppIcon = registerPlugin('AppIcon')

/**
 * Switches the Android launcher icon to the given color variant.
 * No-ops silently on web and iOS (plugin not available there).
 */
export async function setAppIconColor(color) {
  try {
    await AppIcon.setColor({ color })
  } catch {
    // Plugin is unavailable on web and iOS, so this can be ignored.
  }
}
