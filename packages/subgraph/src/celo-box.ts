import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  NFTMint as NFTMintEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Transfer as TransferEvent
} from "../generated/CeloBox/CeloBox"
import { Bytes, json, dataSource, BigInt, JSONValueKind } from "@graphprotocol/graph-ts"
import {
  Token,
  TokenMetadata,
  User
} from "../generated/schema"
import {
  TokenMetadata as TokenMetadataTemplate
} from "../generated/templates"

const ipfshash = "QmTTLjbnL4XcdgEPYk76kd5MwXURM7HH2moFVNECUeVXjy"

export function handleTransfer(event: TransferEvent): void {
  let token = Token.load(event.params.tokenId.toString());
  if (!token) {
    token = new Token(event.params.tokenId.toString());
    token.tokenID = event.params.tokenId.plus(BigInt.fromI32(1));
 
    token.tokenURI = "/" + token.tokenID.toString() + ".json";
    const tokenIpfsHash = ipfshash + token.tokenURI
    token.ipfsURI = tokenIpfsHash;

    TokenMetadataTemplate.create(tokenIpfsHash);
  }

  token.updatedAtTimestamp = event.block.timestamp;
  token.owner = event.params.to.toHexString();
  token.save();
 
  let user = User.load(event.params.to.toHexString());
  if (!user) {
    user = new User(event.params.to.toHexString());
    user.save();
  }
 }

 export function handleMetadata(content: Bytes): void {

  let tokenMetadata = new TokenMetadata(dataSource.stringParam());
  const value = json.fromBytes(content).toObject()
  if (value) {
    const image = value.get('image')
    const name = value.get('name')
    const description = value.get('description')
    const externalURL = value.get('external_url')

    if (name && image && description && externalURL) {
      tokenMetadata.name = name.toString()
      tokenMetadata.image = image.toString()
      tokenMetadata.externalURL = externalURL.toString()
      tokenMetadata.description = description.toString()
    }

    const attributesArray = value.get('attributes')
    if (attributesArray) {
      let attributes = attributesArray.toArray()
      for (let i = 0; i < attributes.length; i++) {
        let item = attributes[i].toObject()
        let trait: string
        let traitName = item.get("trait_type")
        if (traitName) {
          trait = traitName.toString()
          let traitValue = item.get("value")
          if (traitValue) {
            // double-checking the value type before adding it to the subgraph
            if (traitValue.kind == JSONValueKind.STRING) {
              if (trait == "upper_left") {
                tokenMetadata.upperLeft = traitValue.toString()
              }
              if (trait == "upper_right") {
                tokenMetadata.upperRight = traitValue.toString()
              }
              if (trait == "lower_left") {
                tokenMetadata.lowerLeft = traitValue.toString()
              }
              if (trait == "lower_right") {
                tokenMetadata.lowerRight = traitValue.toString()
              }
              if (trait == "random_word") {
                tokenMetadata.randomWord = traitValue.toString()
              }
            }
            // double-checking the value type before adding it to the subgraph
            // you can do this for every type
            if (traitValue.kind == JSONValueKind.NUMBER) {
              if (trait == "random_number") {
                tokenMetadata.randomNumber = traitValue.toBigInt()
              }
            }
          }
        }
      }
    }
  tokenMetadata.save()
  }
 }