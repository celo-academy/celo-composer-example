import { ResolveMasa } from "@/masa-resolver";
import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";

const NETWORKS: Record<string, any> = {
    alfajores: {
        providerUrl: "https://alfajores-forno.celo-testnet.org",
    },
    mainnet: {
        providerUrl: "https://forno.celo.org",
    },
};

export default function Masa() {
    const { isConnected } = useAccount();
    const [isWalletConneted, setWalletConnected] = useState(false);
    const { chain, chains } = useNetwork();
    const [masaResolver, setMasaResolver] = useState<ResolveMasa | undefined>(
        undefined
    );
    useEffect(() => {
        let resolver = new ResolveMasa({
            providerUrl: NETWORKS[chain?.name as string],
            networkName: chain?.name as string,
        });
        setMasaResolver(resolver);
    }, []);

    useEffect(() => {
        setWalletConnected(isConnected);
    }, [isConnected]);

    return (
        <div className="m-auto flex flex-col">
            {isWalletConneted ? (
                <>
                    <InputField
                        className="no-spinner"
                        label="Enter a Number"
                        value={value ?? ""}
                        onChange={({ target }) => {
                            return target.value == ""
                                ? setValue(null)
                                : setValue(Number(target.value));
                        }}
                        type="number"
                    />
                    <Button
                        text="Submit"
                        isLoading={isLoading}
                        disabled={value == null}
                        onClick={write ?? (() => {})}
                    />
                </>
            ) : (
                <div className="flex justify-center">
                    <ConnectButton
                        showBalance={{
                            smallScreen: true,
                            largeScreen: false,
                        }}
                    />
                </div>
            )}
        </div>
    );
}
