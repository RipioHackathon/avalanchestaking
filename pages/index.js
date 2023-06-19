import {
  ConnectWallet,
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
  useTokenBalance,
  Web3Button,
} from "@thirdweb-dev/react";

import { ethers } from "ethers";

import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { stakingContractAddress } from "../const/Details";

export default function Home() {
  // La wallet del usuario que quiere stakear
  const address = useAddress();
  // La cantidad de tokens que el usuario quiere stakear
  const [amountToStake, setAmountToStake] = useState(0);
 
  // Inicializamos el contrato de stake
  const { contract: staking, isLoading: isStakingLoading } = useContract(
    stakingContractAddress,
    "custom"
  );

   // Tramos los balances de staking y reward token del contrato
   const { data: rewardTokenAddress } = useContractRead(staking, "rewardToken");
   const { data: stakingTokenAddress } = useContractRead(
     staking,
     "stakingToken"
   );
 
  // Inicializamos el contrato del token que se quiere stakear
  const { contract: stakingToken, isLoading: isStakingTokenLoading } =
    useContract(stakingTokenAddress, "token");
  
  // Inicializamos el contrato del token que se quiere recibir como recompensa
  const { contract: rewardToken, isLoading: isRewardTokenLoading } = 
    useContract(rewardTokenAddress, "token");

 

  // Traemos la información del stakeo del usuario.
  // Recuerda que puedes ver la estructura de este objeto en el contrato de staking
  const { data: stakingTokenBalance, refetch: refetchStakingTokenBalance } =
    useTokenBalance(stakingToken, address);
  const { data: rewardTokenBalance, refetch: refetchRewardTokenBalance } =
    useTokenBalance(rewardToken, address);

  
  // Traemos la información del staking del usuario cada 10 segundos.
  // En el contrato de staking, tenemos recompesas por segundo

  const {
    data: stakeInfo,
    refetch: refetchStakingInfo,
    isLoading: isStakeInfoLoading,
  } = useContractRead(staking, "getStakeInfo", [address || "0"]);
  


  useEffect(() => {
    setInterval(() => {
      refetchData();
    }, 10000);
  }, []);

  const refetchData = () => {
    refetchRewardTokenBalance();
    refetchStakingTokenBalance();
    refetchStakingInfo();
  };




  return (
    <div className={styles.container}>
    <main className={styles.main}>
      <h1 className={styles.title}>Tuki: La tarjeta de débito de custodia propia.</h1>

      <p className={styles.description}>
        Conecta tu wallet, ahorra en crypto y gana recompesas! 
      </p>

      <p className={styles.description}>
        Estamos interactuando en la blockchain Avalanche Fuji. Los tokens no tienen valor. Su uso es para fines educativos. 
      </p>
      <div className={styles.connect}>
        <ConnectWallet />
      </div>

      <div className={styles.stakeContainer}>
        <input
          className={styles.textbox}
          type="number"
          value={amountToStake}
          onChange={(e) => setAmountToStake(e.target.value)}
        />

        <Web3Button
          className={styles.button}
          contractAddress={stakingContractAddress}
          action={async (contract) => {
            await stakingToken.setAllowance(
              stakingContractAddress,
              amountToStake
            );
            await contract.call(
              "stake",
              [ethers.utils.parseEther(amountToStake)]
              );
            alert("Tus tokens ya están en staking!");
          }}
        >
          Ahorrar
        </Web3Button>

        <Web3Button
          className={styles.button}
          contractAddress={stakingContractAddress}
          action={async (contract) => {
            await contract.call(
              "withdraw",
              [ethers.utils.parseEther(amountToStake)]
              );
            alert("Liberaste tus tokens!");
          }}
        >
          Retirar
        </Web3Button>

        <Web3Button
          className={styles.button}
          contractAddress={stakingContractAddress}
          action={async (contract) => {
            await contract.call("claimRewards", []);
            alert("Reclamaste recompensa con éxito!");
          }}
        >
          Reclama recompensa
        </Web3Button>
      </div>

      <div className={styles.grid}>
        <a className={styles.card}>
          <h2>Balance en tu cuenta</h2>
          <p>{stakingTokenBalance?.displayValue}</p>
        </a>

        <a className={styles.card}>
          <h2>Recompensas recibidas</h2>
          <p>{rewardTokenBalance?.displayValue}</p>
        </a>

        <a className={styles.card}>
          <h2>Cantidad ahorrada</h2>
          <p>
            {stakeInfo && ethers.utils.formatEther(stakeInfo[0].toString())}
          </p>
        </a>

        <a className={styles.card}>
          <h2>Recompensas por reclamar</h2>
          <p>
            {stakeInfo && ethers.utils.formatEther(stakeInfo[1].toString())}
          </p>
        </a>
      </div>

      <h1 className={styles.title}><a href="https://tukicard.xyz">Visita nuestro sitio para ser de de lxs primerxs en tener su tarjeta Tuki.</a></h1>


    </main>
  </div>
  );
}
