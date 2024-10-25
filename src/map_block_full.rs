use substreams_solana::pb::sf::solana::r#type::v1::{Block, CompiledInstruction, ConfirmedTransaction};
use anyhow::anyhow;
use serde::Deserialize;

#[derive(Deserialize, Debug)]
struct BlockFullFilterParams {
    program_id: String,
    signature: Option<String>,
}

#[substreams::handlers::map]
fn map_block_full(params: String, blk: Block) -> Result<Block, substreams::errors::Error> {
    let filters = parse_filters_from_params(params)?;

    let filtered_transactions: Vec<ConfirmedTransaction> = blk.transactions
        .into_iter()
        .filter(|tx| {
            let msg = tx.transaction.as_ref().unwrap().message.as_ref().unwrap();
            let acct_keys = tx.resolved_accounts();

            msg.instructions.iter().any(|inst: &CompiledInstruction| apply_filter(inst, &filters, &acct_keys, tx))
        })
        .collect();

    let filtered_block = Block {
        transactions: filtered_transactions,
        ..blk
    };

    Ok(filtered_block)
}

fn parse_filters_from_params(params: String) -> Result<BlockFullFilterParams, substreams::errors::Error> {
    match serde_qs::from_str(&params) {
        Ok(filters) => Ok(filters),
        Err(e) => Err(anyhow!("Failed to parse filters from params: {}", e))
    }
}

fn apply_filter(instruction: &CompiledInstruction, filters: &BlockFullFilterParams, account_keys: &Vec<&Vec<u8>>, tx: &ConfirmedTransaction) -> bool {
    let program_id_match = if let Some(program_account_key) = account_keys.get(instruction.program_id_index as usize) {
        let program_account_key_val = bs58::encode(program_account_key).into_string();
        program_account_key_val == filters.program_id
    } else {
        false
    };

    program_id_match && apply_filter_signature(tx, &filters)
}

fn apply_filter_signature(transaction: &ConfirmedTransaction, filters: &BlockFullFilterParams) -> bool {
    if filters.signature.is_none() {
        return true;
    }

    let mut found = false;

    transaction
        .transaction
        .as_ref()
        .unwrap()
        .signatures
        .iter()
        .for_each(|sig| {
            let xsig = bs58::encode(&sig).into_string();
            if xsig == filters.signature.clone().unwrap() {
                found = true;
            }
        });

    found
}