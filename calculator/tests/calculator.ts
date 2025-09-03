import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Calculator } from "../target/types/calculator";
import { assert } from "chai";

describe("calculator", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.calculator as Program<Calculator>;
  const new_account = anchor.web3.Keypair.generate();

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.init(10)
      .accounts({
        newAccount : new_account.publicKey,
        signer : anchor.getProvider().wallet.publicKey
      })
      .signers([new_account])
      .rpc();
    console.log("Your transaction signature", tx);

    const account = await program.account.newAccount.fetch(new_account.publicKey);
    console.log(account)
    assert.equal(account.num, 10);
    
  });

  it("Is Doubled!", async () => {
    const tx = await program.methods.double()
      .accounts({
        newAccount : new_account.publicKey,
        signer : anchor.getProvider().wallet.publicKey
      })
      .rpc();

    const account = await program.account.newAccount.fetch(new_account.publicKey);
    console.log(account);

    assert.equal(account.num, 20);
  })

  it("Is Added!", async () => {
    const tx = await program.methods.add(100)
      .accounts({
        newAccount : new_account.publicKey,
        signer : anchor.getProvider().wallet.publicKey
      })
      .rpc();

    const account = await program.account.newAccount.fetch(new_account.publicKey);
    console.log(account);

    assert.equal(account.num, 120);
  })

});
