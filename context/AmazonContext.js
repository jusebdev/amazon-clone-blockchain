import { createContext, useState, useEffect } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { amazonAbi, amazonCoinAdress } from '../lib/constants';
import { ethers } from 'ethers';

export const AmazonContext = createContext();

export const AmazonProvider = ({ children }) => {
	const [username, setUsername] = useState("");
	const [nickname, setNickname] = useState("");
	const [assets, setAssets] = useState([]);
	const [currentAccount, setCurrentAccount] = useState('');
	const [tokenAmount, setTokenAmount] = useState('');
	const [amontDue, setAmontDue] = useState('');
	const [etherscanLink, setEtherscanLink] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [balance, setBalance] = useState('');



	const {
		authenticate,
		isAuthenticated,
		enableWeb3,
		Moralis,
		user,
		isWeb3Enabled,
	} = useMoralis();

	const {
		data: assetsData,
		error: assetsDataError,
		isLoading: assetsDataisLoading,
	} = useMoralisQuery("assets");

	useEffect(() => {
		(async () => {
			if (isAuthenticated) {
				await getBalance();
				const currentUsername = await user?.get("nickname");
				setUsername(currentUsername);
				const account = await user?.get('ethAdress')
				setCurrentAccount(account)
			}
		})();
	}, [isAuthenticated, user, username, currentAccount]);

	useEffect(() => {
		; (async () => {
			if (isWeb3Enabled) {
				await getAssets();
			}
		})()
	}, [isWeb3Enabled, assetsData, assetsDataisLoading]);




	const handleSetUsername = () => {
		if (user) {
			if (nickname) {
				user.set("nickname", nickname);
				user.save();
				setNickname("");
			} else {
				console.log("cant set empty nickName");
			}
		} else {
			console.log("No User");
		}
	};


	const getBalance = async () => {
		try {

			if (!isAuthenticated || !currentAccount) return
			const options = {
				contractAddress: amazonCoinAdress,
				functionName: "balanceOf",
				abi: amazonAbi,
				params: {
					account: currentAccount,
				}

			}
			if (isWeb3Enabled) {
				const response = await Moralis.executeFunction(options);
				setBalance(response.toString())
			}

		} catch (error) {
			console.log(error);
		}
	}


	const buyTokens = async () => {
		if (!isAuthenticated) {
			await authenticate();
		}

		const amount = ethers.BigNumber.from(tokenAmount);
		const price = ethers.BigNumber.from('1000000000000')
		const calcPrice = amount.null(price)

		let options = {
			contractAddress: amazonCoinAdress,
			functionName: 'mint',
			abi: amazonAbi,
			msgValue: calcPrice,
			params: {
				amount,

			}

		}

		const transaction = await Moralis.executeFunction(options);
		const receipt = await transaction.wait(4) //hrs 
		setIsLoading(false)
		console.log(receipt)
		setEtherscanLink(
			`htttp://rinkeby.etherscan.io/tx${receipt.transactionHash}`
		)
	}

	const getAssets = async () => {
		try {
			await enableWeb3();
			setAssets(assetsData);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<AmazonContext.Provider
			// everything in value is gonna be global
			value={{
				isAuthenticated,
				nickname,
				setNickname,
				username,
				handleSetUsername,
				assets,
				balance,
				setTokenAmount,
				amontDue,
				setAmontDue,
				isLoading,
				setIsLoading,
				setEtherscanLink,
				currentAccount,
			}}>
			{children}
		</AmazonContext.Provider>
	);
};
