use anchor_lang::prelude::*;

declare_id!("9ZiHmb7FzVQYSGahdX6dSN1xZcN33sPY5aVBxQooc4Gy");

#[program]
pub mod cpi_to_any_contract {
    use anchor_lang::solana_program::{instruction::Instruction, program::invoke};

    use super::*;

    pub fn sol_transfer(ctx : Context<SolTransfer>, amount : u64) -> Result<()> {
        let payer = ctx.accounts.sender.to_account_info();
        let receiver = ctx.accounts.receiver.to_account_info();
        let program_id = ctx.accounts.system_program.to_account_info();
        
        let account_meta = vec![
            AccountMeta::new(payer.key(), true),
            AccountMeta::new(receiver.key(), false)
        ];

        let instruction_discriminitor : u32 = 2; // This to call the transfer function inside the system_program we can also convert this with borsh

        let mut instruction_data = Vec::with_capacity(4 + 8);
        instruction_data.extend_from_slice(&instruction_discriminitor.to_le_bytes());
        instruction_data.extend_from_slice(&amount.to_le_bytes());

        let instruction = Instruction {
            program_id : program_id.key(),
            accounts : account_meta,
            data : instruction_data
        };

        invoke(&instruction, &[payer, receiver, program_id])?;

        Ok(())
    }

}


#[derive(Accounts)]
pub struct SolTransfer <'info> {
    #[account(mut)]
    sender : Signer<'info>,
    #[account(mut)]
    receiver : SystemAccount<'info>,
    system_program : Program<'info, System>
}