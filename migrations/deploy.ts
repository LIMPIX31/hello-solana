import type { Provider } from '@coral-xyz/anchor'
import      anchor       from '@coral-xyz/anchor'

export default (provider: Provider) => anchor.setProvider(provider)
