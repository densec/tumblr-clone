import {
	Avatar,
	Button,
	Checkbox,
	Col,
	Input,
	Modal,
	Row,
	Spacer,
	Text,
	Tooltip
} from "@nextui-org/react";
import React, { useEffect } from "react";
import { Container, Left, Logo, Right, Wrapper } from "./Navbar.styled";
import { HiLockClosed } from "react-icons/hi";
import { FiMail } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useTheme } from "styled-components";
import axios from "../../utils/axios";
import Link from "next/link";
import { GoogleLogin } from "react-google-login";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/actions/auth";
import { socket, startSocket, stopSocket } from "../../utils/socketio";

const Navbar = () => {
	const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
	const user = useSelector(state => state.auth.user);
	const dispatch = useDispatch();
	const [visible, setVisible] = React.useState(false);
	const [showPass, setShowPass] = React.useState(false);
	const open = () => setVisible(true);
	const close = () => {
		setVisible(false);
	};
	const theme = useTheme();

	useEffect(() => {
		socket.on("connect", () => {
			console.log("connected");
		});

		return () => {
			socket.off("connect");
		};
	}, []);

	function onGoogleSuccess(response) {
		axios
			.post("/auth/google", {
				tokenId: response.tokenId
			})
			.then(res => {
				localStorage.setItem("accesstoken", res.data.accesstoken);
				dispatch({ type: "SET_USER", payload: res.data.user });
				startSocket(res.data.user._id);
				setVisible(false);
				// store user in redux and persist user
			})
			.catch(err => {
				console.log(err);
			});
	}

	function onGoogleFailure(response) {
		console.log(response);
	}
	return (
		<>
			<Modal
				closeButton
				aria-labelledby="modal-title"
				open={visible}
				onClose={close}
			>
				<Modal.Header>
					<Text id="modal-title" size={30}>
						Login
					</Text>
				</Modal.Header>
				<Modal.Body>
					<Input
						clearable
						bordered
						fullWidth
						color="primary"
						size="lg"
						placeholder="Email"
						contentLeft={<FiMail />}
					/>
					<Input
						clearable
						bordered
						fullWidth
						color="primary"
						type={showPass ? "text" : "password"}
						size="lg"
						placeholder="Password"
						contentLeft={<HiLockClosed />}
					/>
					<Button
						css={{
							background: theme.colors.primary
						}}
					>
						Sign In
					</Button>
					<Text css={{ textAlign: "center" }}>OR</Text>
					<Spacer y="$3" />
					<GoogleLogin
						clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
						buttonText="Login with google"
						onSuccess={onGoogleSuccess}
						onFailure={onGoogleFailure}
					/>
				</Modal.Body>
				<Modal.Footer></Modal.Footer>
			</Modal>
			{/* ---------------------------------------------------- */}
			<Wrapper>
				<Container>
					<Left>
						<Logo src="/tumblr-logo.svg" alt="tumblr logo" />
						<Input clearable placeholder="Type something..." />
					</Left>

					<Right>
						{isAuthenticated ? (
							<>
								<img src="/navbar/home.svg" alt="home" />
								<img src="/navbar/explore.svg" alt="explore" />
								<img src="/navbar/chat.svg" alt="chat" />
								<Tooltip
									content={
										<div
											style={{
												display: "flex",
												flexDirection: "column",
												gap: ".3rem"
											}}
										>
											<Text h3 color="primary">
												Following {user?.following?.length}
											</Text>
											<Text
												css={{
													whiteSpace: "nowrap"
												}}
												h3
												color="error"
											>
												Followers {user?.followers?.length}
											</Text>
											<Button
												onClick={() => {
													dispatch(logout());
													stopSocket();
												}}
												color="white"
												css={{ color: "#000", borderRadius: 0 }}
												auto
											>
												Log out
											</Button>
										</div>
									}
									trigger="click"
									css={{ backgroundColor: "#fff", borderRadius: 3 }}
									placement="bottomEnd"
								>
									<Avatar size="md" src={user.avatar} zoomed />
								</Tooltip>
							</>
						) : (
							<Button
								css={{
									background: theme.colors.primary
								}}
								onClick={open}
								auto
							>
								Sign In
							</Button>
						)}
					</Right>
				</Container>
			</Wrapper>
		</>
	);
};

export default Navbar;
