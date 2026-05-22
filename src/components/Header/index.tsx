import { getCachedGlobal, getGlobal } from '@/utilities/getGlobals'

import './index.css'
import { HeaderClient } from './index.client'

export async function Header() {
  // const header = await getCachedGlobal('header', 1)()
  const header = await getGlobal('header', 1)

  return <HeaderClient header={header} />
}
