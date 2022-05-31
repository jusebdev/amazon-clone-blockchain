import { createContext, useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
export const AmazonContext = createContext();

export const AmazonProvider = ({ children }) => {
	const [username, setUsername] = useState("");
	const [nickname, setNickname] = useState("");

	const {
		authenticate,
		isAuthenticated,
		enableWeb3,
		Moralis,
		user,
		isWeb3Enabled,
	} = useMoralis();

	useEffect(() => {
		(async () => {
			if (isAuthenticated) {
				const currentUsername = await user?.get("nickname");
                setUsername(currentUsername);
			}
		
		})();
	}, [isAuthenticated, user, username]);

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

	return (
		<AmazonContext.Provider
			// everything in value is gonna be global
			value={{
				isAuthenticated,
				nickname,
				setNickname,
				username,
				handleSetUsername,
			}}>
			{children}
		</AmazonContext.Provider>
	);
};
