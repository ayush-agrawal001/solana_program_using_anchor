use crate::{accounts, errors::StakeError};

pub fn update_points (pda_account_info : &mut accounts::StakingAccount, time_in_unix : i64 ) -> Result<()> {

    let time_elapsed = clock.unix_timestamp.checked_sub(pda_account_info.last_updated_epoch)
        .ok_or(StakeError::InvalidTimestamp)? as u64;


    let new_points = 


    Ok(())
}