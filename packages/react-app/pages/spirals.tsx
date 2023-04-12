import { useEffect, useReducer } from "react";
import { useAccount, useContractReads } from "wagmi";
import GreenTokenVaultAbi from "../abis/GreenTokenVault";
import { utils } from "ethers";
import { fetchBalance, fetchToken } from "wagmi/actions";
import Button from "@/components/Button";

const GCELO_VAULT_ADDRESS = "0x8A1639098644A229d08F441ea45A63AE050Ee018";

const INITIAL_VALUES = {
    apy: 0,
    yieldAsset: "",
    asset: "",
    balance: 0,
};

const GCELO_CONTRACT = {
    address: GCELO_VAULT_ADDRESS,
    abi: GreenTokenVaultAbi,
};

function reducer(state, action) {
    switch (action.type) {
        case "apy":
            return { ...state, apy: action.payload };
        case "yieldAsset":
            return { ...state, yieldAsset: action.payload };
        case "asset":
            return { ...state, asset: action.payload };
        case "balance":
            return { ...state, balance: action.payload };
        case "state":
            return action.payload;
        default:
            return state;
    }
}

export default function Spirals() {
    const { address, isConnected } = useAccount();
    const [state, dispatch] = useReducer(reducer, INITIAL_VALUES);

    // useEffect(() => {
    //     (async () => {})();
    // }, [state]);

    useContractReads({
        contracts: [
            {
                ...GCELO_CONTRACT,
                functionName: "getAPY",
            },
            {
                ...GCELO_CONTRACT,
                functionName: "yieldAsset",
            },
            {
                ...GCELO_CONTRACT,
                functionName: "asset",
            },
        ],
        onSuccess(data) {
            console.log(data);
            dispatch({ payload: data[0], type: "apy" });

            (async () => {
                let asset = await fetchToken({
                    address: data[2],
                });
                let yieldAsset = await fetchToken({
                    address: data[1],
                });

                console.log(asset, yieldAsset);

                dispatch({ payload: yieldAsset, type: "yieldAsset" });
                dispatch({ payload: asset, type: "asset" });
            })();
        },
    });

    return (
        <div className="w-[900px]   m-auto  flex flex-col space-y-2">
            <div className="border-black border-2 p-4 flex flex-col space-y-4">
                <h1>gCelo (Green Celo)</h1>
                {state.apy && (
                    <div className="flex flex-col">
                        <h2>APY: </h2>
                        <h3 className="font-bold">
                            {utils
                                .formatEther(state.apy.toString())
                                .substring(0, 4)}
                            %
                        </h3>
                    </div>
                )}
                <div className="flex justify-between">
                    {state.yieldAsset && (
                        <div className="flex flex-col space-y-2 border-black border-2 p-4">
                            <h2>Yield Asset: </h2>
                            <div className="flex">
                                <h3>{state.yieldAsset.name}</h3>
                                <h3 className="font-bold ml-2">
                                    ({state.yieldAsset.symbol})
                                </h3>
                            </div>
                            <a
                                target="_blank"
                                href={`https://celoscan.io/address/${state.yieldAsset.address}`}
                            >
                                <h3 className="underline">
                                    {state.yieldAsset.address}
                                </h3>
                            </a>
                        </div>
                    )}
                    {state.asset && (
                        <div className="flex flex-col space-y-2 border-black border-2 p-4">
                            <h2>Asset: </h2>
                            <div className="flex">
                                <h3>{state.asset.name}</h3>
                                <h3 className="font-bold ml-2">
                                    ({state.asset.symbol})
                                </h3>
                            </div>
                            <a
                                target="_blank"
                                href={`https://celoscan.io/address/${state.asset.address}`}
                            >
                                <h3 className="underline">
                                    {state.asset.address}
                                </h3>
                            </a>
                        </div>
                    )}
                </div>
                <div className="flex justify-between space-x-2">
                    <Button
                        text="Deposit"
                        className="w-full"
                        disabled={false}
                        onClick={() => console.log("deposit")}
                    />
                    <Button
                        text="Withdraw"
                        className="w-full"
                        disabled={false}
                        onClick={() => console.log("withdraw")}
                    />
                </div>
            </div>
        </div>
    );
}
