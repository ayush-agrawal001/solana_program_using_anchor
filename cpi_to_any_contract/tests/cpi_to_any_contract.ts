import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CpiToAnyContract } from "../target/types/cpi_to_any_contract";
import { assert } from "chai";

describe("cpi_to_any_contract", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.cpiToAnyContract as Program<CpiToAnyContract>;
  const provider = anchor.getProvider();
  const receiver = anchor.web3.Keypair.generate();

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.solTransfer(new anchor.BN(1000000000))
      .accounts({
        sender : provider.publicKey,
        receiver : receiver.publicKey
      })
      .rpc();
    console.log("Your transaction signature", tx);

    const account = await provider.connection.getAccountInfo(receiver.publicKey);

    assert.equal(account.lamports, 1000000000)

  });
});
