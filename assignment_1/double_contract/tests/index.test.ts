import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import {beforeAll, describe, expect, test } from "bun:test"
import { LiteSVM } from "litesvm"

describe("Counter program test", () => {
    
    let svm : Connection;
    let admin_ac : Keypair;
    let data_ac : Keypair;
    let program_id : PublicKey;

    beforeAll(async () => {
        svm = new Connection("http://127.0.0.1:8899");
        program_id = new PublicKey("J16K3hd5nhi3FWxsxDXxBJ5L4m24h54FCkTMt1d4oGJr");
        admin_ac = Keypair.generate();
        data_ac = Keypair.generate();
        
        const txn_airdrop = await svm.requestAirdrop(admin_ac.publicKey, 10 * LAMPORTS_PER_SOL)
        console.log(txn_airdrop)
        console.log("---------------")
        const latestBlockHash = await svm.getLatestBlockhash();
        await svm.confirmTransaction({
            signature : txn_airdrop,
            lastValidBlockHeight : latestBlockHash.lastValidBlockHeight,
            blockhash : latestBlockHash.blockhash
        });
        console.log("Airdrop Confirmed ");
        console.log("---------------")
    })


    test("Initialize Account", async () => {
        let instruction = new TransactionInstruction({
            programId : program_id,
            keys : [
                {pubkey : data_ac.publicKey, isSigner : true, isWritable : true},
                {pubkey : admin_ac.publicKey, isSigner : true, isWritable : false},
                {pubkey : SystemProgram.programId, isSigner : false, isWritable : false},
            ],
            data : Buffer.from([0]),
        })

        const recentBlockHash = await svm.getLatestBlockhash();
        const txn = new Transaction();
        txn.recentBlockhash = recentBlockHash.blockhash;
        txn.add(instruction);
        txn.sign(admin_ac, data_ac);
        txn.feePayer = admin_ac.publicKey;

        const sig = await svm.sendTransaction(txn, [admin_ac, data_ac]);
        await svm.confirmTransaction(sig);

        const data_account_data = await svm.getAccountInfo(data_ac.publicKey);

        if (!data_account_data) {
            throw new Error("No data for data_ac found");
        }

        console.log(data_account_data.data);
        expect(data_account_data.data[0]).toBe(1);
        expect(data_account_data.data[1]).toBe(0);
        expect(data_account_data.data[2]).toBe(0);
        expect(data_account_data.data[3]).toBe(0);

    })

    test('Dobule', async () => { 
        let instruction = new TransactionInstruction({
            programId : program_id,
            keys : [
                {pubkey : data_ac.publicKey, isSigner : false, isWritable : true}
            ],
            data : Buffer.from([1])
        })

        const recentBlockHash = await svm.getLatestBlockhash();
        const txn = new Transaction();
        txn.recentBlockhash = recentBlockHash.blockhash;
        txn.add(instruction);
        txn.sign(admin_ac, data_ac);
        txn.feePayer = admin_ac.publicKey;

        const sig = await svm.sendTransaction(txn, [admin_ac, data_ac]);
        await svm.confirmTransaction(sig);

        const data_account_data = await svm.getAccountInfo(data_ac.publicKey);

        if (!data_account_data) {
            throw new Error("No data for data_ac found");
        }

        console.log(data_account_data.data);
        expect(data_account_data.data[0]).toBe(2);
        expect(data_account_data.data[1]).toBe(0);
        expect(data_account_data.data[2]).toBe(0);
        expect(data_account_data.data[3]).toBe(0);

    })



})