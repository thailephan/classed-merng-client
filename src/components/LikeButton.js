import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { Button, Label } from 'semantic-ui-react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import MyPopup from '../util/MyPopup';

const LIKE_POST_MUTATION = gql`
	mutation likePost($postId: ID!) {
		likePost(postId: $postId) {
			id
			likes {
				id
				username
			}
			likeCount
		}
	}
`;

export default function LikeButton({
	user,
	post: { likes, likeCount, id },
}) {
	const [liked, setLiked] = useState(false);

	useEffect(() => {
		if (user && likes.find((like) => like.username === user.username)) {
			setLiked(true);
		} else setLiked(false);
	}, [user, likes]);

	const [likePost] = useMutation(LIKE_POST_MUTATION, {
		variables: { postId: id },
	});

	const likeButton = liked ? (
		<Button color='teal' icon='heart' />
	) : (
		<Button basic color='teal' icon='heart' />
	);

	return (
		<Button as='div' labelPosition='right' onClick={likePost}>
			<MyPopup content={liked ? 'Unlike' : 'Like'}>
				{user ? (
					likeButton
				) : (
					<Button
						as={Link}
						to='/login'
						color='teal'
						basic
						icon='heart'
					/>
				)}
			</MyPopup>
			<Label basic color='teal' pointing='left'>
				{likeCount}
			</Label>
		</Button>
	);
}

LikeButton.propTypes = {
	post: PropTypes.object,
	user: PropTypes.object,
};
