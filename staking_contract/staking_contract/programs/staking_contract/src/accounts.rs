use anchor_lang::{account, prelude::Pubkey};

#[account]
pub struct StakingAccount {
    pub owner : Pubkey,
    pub staked_amount : u64,
    pub points : u64,
    pub last_updated_epoch : i64,
    pub bump : u8
}