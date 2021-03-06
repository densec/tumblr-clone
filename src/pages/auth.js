import Head from "next/head";
import { Auth } from "../components/Auth";

export default function auth() {
	return (
		<>
			<Head>
				<title>Auth</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Auth />
		</>
	);
}
