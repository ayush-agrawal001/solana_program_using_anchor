// anchor test --provider.cluster "http://127.0.0.1:8899" 

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ProxyContract } from "../target/types/proxy_contract";

describe("proxy_contract", () => {

  const admin_key = anchor.web3.Keypair.generate();
  const data_acc = anchor.web3.Keypair.generate();
  const admin_wallet = new anchor.Wallet(admin_key);
  // Configure the client to use the local cluster.
  const provider : anchor.Provider = new anchor.AnchorProvider(
    new anchor.web3.Connection("http://127.0.0.1:8899", "confirmed"),
    admin_wallet,
    anchor.AnchorProvider.defaultOptions()
  )

  anchor.setProvider(provider);

  const program = anchor.workspace.proxyContract as Program<ProxyContract>;
  const cpi_program = new anchor.web3.PublicKey("J16K3hd5nhi3FWxsxDXxBJ5L4m24h54FCkTMt1d4oGJr");

  it("Is initialized!", async () => {
    
    const airdropSig = await provider.connection.requestAirdrop(
      admin_key.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSig, "confirmed");

    const tx = await program.methods
      .initialize()
      .accounts({
        accountData: data_acc.publicKey,
        payer: admin_key.publicKey,
        cpiProgram: cpi_program,
      })
      .signers([admin_key, data_acc])
      .rpc();
    
    const account = await provider.connection.getAccountInfo(data_acc.publicKey);

    console.log(account.data);


    console.log("Your transaction signature", tx);
  });

  it("Is doubled!", async () => {
    
    const tx = await program.methods
      .double()
      .accounts({
        accountData: data_acc.publicKey,
        cpiProgram: cpi_program,
      })
      .rpc();
    
    console.log("Your transaction signature", tx);
    
    const account = await provider.connection.getAccountInfo(data_acc.publicKey);
    
    console.log(account.data[0]);
  });

});
