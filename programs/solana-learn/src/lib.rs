use anchor_lang::prelude::*;

declare_id!("5mbcU5BipQkmgBTeyHnaGAuJ3sFB2V2JWUc4yJWkVg9w");

#[program]
pub mod solana_learn {
	use super::*;

	pub fn init_counter(ctx: Context<InitCounter>) -> Result<()> {
		ctx.accounts.state.init()?;

		Ok(())
	}

	pub fn increment(ctx: Context<IncrementCounter>, value: u32) -> Result<()> {
		ctx.accounts.state.increment(value);

		Ok(())
	}
}

#[derive(Accounts)]
pub struct IncrementCounter<'info> {
	#[account(mut)]
	pub state: Account<'info, Counter>,
}

#[derive(Accounts)]
pub struct InitCounter<'info> {
	#[account(init, payer = authority, space = 8 + 4)]
	pub state: Account<'info, Counter>,
	#[account(mut)]
	pub authority: Signer<'info>,
	pub system_program: Program<'info, System>
}

#[account]
pub struct Counter {
	pub value: u32,
}

impl Counter {
	pub fn init(&mut self) -> Result<()> {
		self.value = 0;

		Ok(())
	}

	pub fn increment(&mut self, value: u32) {
		self.value += value;
	}
}
