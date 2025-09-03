use anchor_lang::prelude::*;

declare_id!("AgztBAHqRCVvsP5VXaCdBgfdxwCfHey2Dbbw8ofwNGmo");

#[program]
pub mod calculator {
    use super::*;

    pub fn init(ctx: Context<Initialize>, init_count : u32) -> Result<()> {
        ctx.accounts.new_account.num = init_count;
        Ok(())
    }

    pub fn double(ctx: Context<Double>) -> Result<()> {
        ctx.accounts.new_account.num = ctx.accounts.new_account.num * 2;
        Ok(())
    }

    pub fn add(ctx: Context<Add>, add_num : u32) -> Result<()> {
        ctx.accounts.new_account.num = ctx.accounts.new_account.num + add_num;
        Ok(())
    }

}

#[account]
pub struct NewAccount{
    num : u32
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + 4)]
    pub new_account : Account<'info, NewAccount>,
    #[account(mut)]
    pub signer : Signer<'info>,
    pub system_program : Program<'info, System>
}

#[derive(Accounts)]
pub struct Double <'info> {
    #[account(mut)]
    pub new_account : Account<'info, NewAccount>,
    pub signer : Signer<'info>
}

#[derive(Accounts)]
pub struct Add <'info> {
    #[account(mut)]
    pub new_account : Account<'info, NewAccount>,
    pub signer : Signer<'info>
}