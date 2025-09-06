use anchor_lang::{prelude::*};
pub mod accounts;
pub mod helpers;
pub mod errors ;

declare_id!("5KC9yxyHu4G5j786JiUFbBSzpCSWS4y5wnpoiHwgnx1j");

// 1 SOL return 1 point in every day

#[program]
pub mod staking_contract {
    use super::*;

    pub fn initialize(ctx: Context<InitializeStaking>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);

        let clock = Clock::get()?;

        let payer = ctx.accounts.payer.to_account_info();

        let pda_acc = &mut ctx.accounts.pda_account;

        pda_acc.owner = payer.key();
        pda_acc.staked_amount = 0;
        pda_acc.points = 0;
        pda_acc.last_updated_epoch = clock.unix_timestamp;
        pda_acc.bump = ctx.bumps.pda_account;

        msg!("PDA account created");
        Ok(())
    }

    pub fn stake (ctx: Context<Stake>, amount : u64) -> Result<()> {

        require!( amount > 0, errors::StakeError::InvalidAmount );

        


        Ok(())
    }

}

#[derive(Accounts)]
pub struct InitializeStaking<'info>{
    #[account(mut)]
    payer : Signer<'info>,
    #[account(
        init,
        payer = payer,
        space = 8 + 32 + 8 + 8 + 8 + 1,
        seeds = [b"pdaforstaking", payer.key().as_ref()],
        bump
    )]
    pda_account : Account<'info, accounts::StakingAccount>,
    system_program : Program<'info, System>
}

#[derive(Accounts)]
pub struct Stake<'info>{
    #[account(mut)]
    payer : Signer<'info>,

    #[account(
        mut,
        seeds = [b"pdaforstaking", payer.key().as_ref()],
        bump,
        constraint = pda_account.owner == payer.key() @ errors::StakeError::Unauthorized
    )]
    pda_account : Account<'info, accounts::StakingAccount>,

    system_program : Program<'info, System>,

}
