import { useContractWrite, usePrepareContractWrite } from "wagmi";
import GreenTokenVaultAbi from "../abis/GreenTokenVault";
import Button from "./Button";
import { BigNumber, utils } from "ethers";

const GCELO_VAULT_ADDRESS = "0x8A1639098644A229d08F441ea45A63AE050Ee018";

const GCELO_CONTRACT = {
    address: GCELO_VAULT_ADDRESS,
    abi: GreenTokenVaultAbi,
};

export default function Deposit({ value, address }) {
    const { config: depositConfig}  = usePrepareContractWrite({
        abi: GreenTokenVaultAbi,
        address: GCELO_CONTRACT.address as `0x${string}`,
        functionName: "depositETH",
        args: [address],
        overrides: {
            value: value ? utils.parseEther(value.toString()): utils.parseEther("0"),
            gasLimit: BigNumber.from(1631195) 
        },
    });

    const { data, isLoading, write: deposit } = useContractWrite(depositConfig);


    if(!deposit) return null;
    return <Button
            text="Deposit"
            className="w-full"
            disabled={deposit === undefined}
            onClick={() => deposit()}
        />
}
