import { useEffect, useReducer } from "react";
import {
    useContractRead,
    usePrepareSendTransaction,
    useProvider,
    useSigner,
} from "wagmi";
import GreenTokenVaultAbi from "../abis/GreenTokenVault";
import { utils } from "ethers";

const GCELO_VAULT_ADDRESS = "0x8A1639098644A229d08F441ea45A63AE050Ee018";

const INITIAL_VALUES = {
    apy: 0,
};

function reducer(state, action) {
    switch (action.type) {
        case "apy":
            return { ...state, apy: action.payload };
        default:
            return state;
    }
}

export default function Spirals() {
    const [state, dispatch] = useReducer(reducer, INITIAL_VALUES);
    const provider = useProvider();

    useContractRead({
        address: GCELO_VAULT_ADDRESS,
        abi: GreenTokenVaultAbi,
        functionName: "getAPY",
        onSuccess(data) {
            dispatch({ payload: data, type: "apy" });
        },
    });

    return (
        <div className="w-[500px]  m-auto  flex flex-col space-y-2">
            <div className="border-black border-2 p-4">
                <h1>gCelo (Green Celo)</h1>
                {state.apy && (
                    <h2>{utils.formatEther(state.apy).substring(0, 4)}</h2>
                )}
            </div>
        </div>
    );
}
