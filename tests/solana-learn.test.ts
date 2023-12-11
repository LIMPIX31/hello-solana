import * as anchor     from '@coral-xyz/anchor'
import { Program }     from '@coral-xyz/anchor'
import { describe }    from 'bun:test'
import { expect }      from 'bun:test'
import { test }        from 'bun:test'

import { SolanaLearn } from '../target/types/solana_learn'

const WORKSPACE = 'SolanaLearn'

describe(WORKSPACE, () => {
	anchor.setProvider(anchor.AnchorProvider.local('http://127.0.0.1:8899'))

	const program = anchor.workspace[WORKSPACE] as Program<SolanaLearn>

	const stateKey = anchor.web3.Keypair.generate()

	async function increment(value) {
		try {
			await program.methods
				.increment(value)
				.accounts({
					state: stateKey.publicKey,
				})
				.signers([])
				.rpc()
		} catch (err) {
			console.log(err)
			throw err
		}
	}

	test('it works!', async () => {
		const incrementor = (program.provider as anchor.AnchorProvider).wallet

		await program.methods
			.initCounter()
			.accounts({
				state: stateKey.publicKey,
				authority: incrementor.publicKey,
			})
			.signers([stateKey])
			.rpc()

		{
			const counterState = await program.account.counter.fetch(stateKey.publicKey)
			expect(counterState.value).toEqual(0)
		}

		await increment(5)

		{
			const counterState = await program.account.counter.fetch(stateKey.publicKey)
			expect(counterState.value).toEqual(5)
		}

		await increment(2)

		{
			const counterState = await program.account.counter.fetch(stateKey.publicKey)
			expect(counterState.value).toEqual(7)
		}
	})
})
