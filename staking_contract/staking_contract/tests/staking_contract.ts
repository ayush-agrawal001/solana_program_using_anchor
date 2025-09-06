import * as anchor from "@coral-xyz/anchor";
import { web3 } from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { StakingContract } from "../target/types/staking_contract";

describe("staking_contract", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.stakingContract as Program<StakingContract>;

  const provider = anchor.getProvider();
  const connection = provider.connection;
  const andmin_wallet = provider.wallet;

  const [pda_ac, bump] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("pdaforstaking"), provider.publicKey.toBuffer()],
    program.programId
  );

  it("Is initialized!", async () => {

    const tx = await program.methods.initialize()
      .accounts({
        payer : provider.publicKey
      })
      .rpc();
    console.log("Your transaction signatre", tx);
    
    const pda_ac_info = await connection.getAccountInfo(pda_ac);
    
    console.log(pda_ac_info.data.subarray());
  
  });
});
