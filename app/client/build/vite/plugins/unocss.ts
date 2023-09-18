import path from 'path'
import Unocss from 'unocss/vite'

export const configUnocss = () => {
  return Unocss(path.resolve(process.cwd(), 'uno.config.ts'))
}
