import Head from "next/head";
import Content from "../components/Home/Content/Content";
import { Navbar } from "../layout";
import withAuth from "../hooks/withAuth";

function Home() {
	return (
		<>
			<Head>
				<title>Home</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Navbar />
			<Content />
			{/* footer */}
		</>
	);
}

export default withAuth(Home);
