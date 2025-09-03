use anchor_lang::prelude::*;

declare_id!("AHWwUscRA9fwjqRTQjfUPGKqvfQhMMZUt7rfBWRr1w5Q");

#[program]
pub mod proxy_contract {
    use anchor_lang::{accounts::{account_info, system_account}, solana_program::{instruction::Instruction, program::invoke}};

    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Initializing program CPI");
        
        let payer = ctx.accounts.payer.to_account_info();
        let account_data = ctx.accounts.account_data.to_account_info();
        let cpi_program = ctx.accounts.cpi_program.to_account_info();
        let system_program_ctx = ctx.accounts.system_program.to_account_info();
        
        let account_meta: Vec<AccountMeta> = vec![
            AccountMeta::new(account_data.key() , true),
            AccountMeta::new(payer.key() , true),
            AccountMeta::new_readonly(system_program_ctx.key(), false)
        ];

        let instruction = Instruction {
            program_id : cpi_program.key(),
            accounts : account_meta,
            data : vec![0]
        };

        invoke(&instruction, &[account_data, payer, system_program_ctx])?;

        msg!("Account initalized");
        Ok(())
    }


    pub fn double(ctx: Context<Double>) -> Result<()> {

        let account_data = ctx.accounts.account_data.to_account_info();
        let cpi_program = ctx.accounts.cpi_program.to_account_info();

        let account_meta = vec![
            AccountMeta::new(account_data.key(), false)
        ];

        let instruction = Instruction { 
            program_id : cpi_program.key(),
            accounts : account_meta,
            data : vec![1]

        };

        invoke(&instruction, &[account_data])?;

        Ok(())
    }

}

#[derive(Accounts)]
pub struct Initialize <'info> {
    #[account(mut)]
    /// CHECK: This is a passthrough account. 
    account_data : Signer<'info>,
    #[account(mut)]
    /// CHECK: This is the target CPI program.
    payer : Signer<'info>,
    system_program : Program<'info, System>,
    /// CHECK: This is the target CPI program.
    cpi_program : AccountInfo<'info>
}


#[derive(Accounts)]
pub struct Double <'info> {
    #[account(mut)]
    /// CHECK: This is a passthrough account. 
    account_data : AccountInfo<'info>,
    /// CHECK: This is the target CPI program.
    cpi_program : AccountInfo<'info>,
}