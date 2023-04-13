import { useBalance, useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import GreenTokenVaultAbi from "../abis/GreenTokenVault";
import Button from "./Button";
import { BigNumber, utils } from "ethers";

const GCELO_VAULT_ADDRESS = "0x8A1639098644A229d08F441ea45A63AE050Ee018";

const GCELO_CONTRACT = {
    address: GCELO_VAULT_ADDRESS,
    abi: GreenTokenVaultAbi,
};

export default function Withdraw({ address }) {

    const { data: gCeloBalance} = useContractRead({
        address: GCELO_CONTRACT.address as `0x${string}`,
        abi: GreenTokenVaultAbi,
        functionName:"balanceOf",
        args: [
            address
        ]
      })

    const { config: withdrawConfig}  = usePrepareContractWrite({
        abi: GreenTokenVaultAbi,
        address: GCELO_CONTRACT.address as `0x${string}`,
        functionName: "withdraw",
        args: [utils.parseEther("0.01"), address, address],
        overrides: {
            gasLimit: BigNumber.from(1100417)
        }
    });

    const { data, isLoading, write: withdraw } = useContractWrite(withdrawConfig);

    console.log(withdraw, withdrawConfig);

    if(!withdraw) return null;
    return <Button
            text="Withdraw"
            className="w-full"
            disabled={withdraw === undefined}
            onClick={() => withdraw()}
        />
}
