import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost, fetchPosts, removePost } from "../../../redux/actions/post";
import { socket } from "../../../utils/socketio";
import { Container, Left, Right } from "./Content.styled";
import Post from "./Post";
import PostHeader from "./PostHeader";
import Users from "./Users";

function Content() {
	const dispatch = useDispatch();
	const posts = useSelector(state => state.post.posts);

	useEffect(() => {
		socket.on("new-post", data => {
			dispatch(addPost(data));
		});

		socket.on("delete-post", data => {
			dispatch(removePost(data.postId));
		});

		return () => {
			socket.off("new-post");
			socket.off("delete-post");
		};
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchPosts());
	}, [dispatch]);

	return (
		<Container>
			<Left>
				<PostHeader />
				{posts?.map(p => {
					return <Post p={p} key={p._id} />;
				})}
			</Left>
			<Right>
				<Users />
			</Right>
		</Container>
	);
}
export default Content;
