// There are 2 ways to create PDA's, with the account macro and the other is with CPI to system program!
// The account PDA is using the same method under the hood! 

use anchor_lang::prelude::*;

declare_id!("Et4zKHC2kjF5HqCGFiqhL1SfuconNjMB8Vi9obZF8hwi");

#[program]
pub mod pda_and_cpi_anchor {
    use anchor_lang::system_program::{Transfer, transfer};

    use super::*;

    pub fn initialize_pda(ctx: Context<InitializePDA>) -> Result<()> {
        msg!("Account Created");
        Ok(())
    }

    pub fn transfer_pda_with_cpi(ctx: Context<TransferCPI>, amount : u64) -> Result<()> {
        msg!("CPI Init Begins ------> ");
        
        let program_id = ctx.accounts.system_program.to_account_info();
        let payer = ctx.accounts.payer.to_account_info();
        let pda_account = ctx.accounts.pda_account.to_account_info();

        let bump = ctx.bumps.pda_account;
        let payer_key = payer.key();
        let seeds : &[&[&[u8]]] = &[&[b"pdafortransfer", payer_key.as_ref(), &[bump]]];

        let cpi_context = CpiContext::new(
            program_id,
            Transfer {
                from : pda_account,
                to : payer,
            },
        ).with_signer(seeds);

        transfer(cpi_context, amount)?;
        Ok(())
    }
}


#[derive(Accounts)]
pub struct InitializePDA<'info>{
    #[account(
        init,
        payer = payer,
        space = 8,
        seeds = [b"pda", payer.key().as_ref()],
        bump
    )]
    /// CHECK: ad
    pda_account : AccountInfo<'info>,
    #[account(mut)]
    payer : Signer<'info>,
    system_program : Program<'info, System>

}


#[derive(Accounts)]
pub struct TransferCPI <'info> {
    #[account(
        mut,
        seeds = [b"pdafortransfer", payer.key().as_ref()],
        bump,
    )]
    /// CHECK: ad
    pda_account : AccountInfo<'info>,
    #[account(mut)]
    /// CHECK: ad
    payer : AccountInfo<'info>, // There is no need to use the Signer type here because we are not making account inside this struct
    system_program : Program<'info, System> 
}
