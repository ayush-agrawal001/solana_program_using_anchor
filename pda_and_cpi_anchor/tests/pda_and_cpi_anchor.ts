import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PdaAndCpiAnchor } from "../target/types/pda_and_cpi_anchor";

describe("pda_and_cpi_anchor", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.pdaAndCpiAnchor as Program<PdaAndCpiAnchor>;

  let provider = anchor.getProvider();
  let seeds = [Buffer.from("pda"), provider.publicKey.toBuffer()];

  let [pda_ac, bump] = anchor.web3.PublicKey.findProgramAddressSync(
    seeds,
    program.programId
  )

  let pda_ac_pub = new anchor.web3.PublicKey(pda_ac);

  it("Is initialized!", async () => {
    const tx = await program.methods.initializePda()
      .accounts(
        {
          payer : provider.publicKey,
        }
      )
      .rpc();
    console.log("Your transaction signature", tx);

    const pda_ac_info = await provider.connection.getAccountInfo(pda_ac_pub);
    console.log(pda_ac_info);

  });

  it("Is Transfered", async () => {
    let seeds_2 = [Buffer.from("pdafortransfer"), provider.publicKey.toBuffer()];

    const [pda_ac_transfer, bump_2] = anchor.web3.PublicKey.findProgramAddressSync(
      seeds_2,
      program.programId
    )

    const transferInstruction = anchor.web3.SystemProgram.transfer({
      fromPubkey: provider.wallet.publicKey,
      toPubkey: pda_ac_transfer,
      lamports: 1 * anchor.web3.LAMPORTS_PER_SOL,
    });

    const transaction = new anchor.web3.Transaction().add(transferInstruction);

    const transactionSignature = await anchor.web3.sendAndConfirmTransaction(
      provider.connection,
      transaction,
      [provider.wallet.payer] // signer
    );

    const tx = await program.methods.transferPdaWithCpi(new anchor.BN(946560))
      .accounts({
        payer : provider.publicKey
      })
      .rpc()

      let pda_ac_info = await provider.connection.getAccountInfo(pda_ac_transfer);
      let provider_info = await provider.connection.getAccountInfo(provider.publicKey);
      console.log("pda_ac_info", pda_ac_info);
      console.log("provider_info", provider_info);
  })
});
