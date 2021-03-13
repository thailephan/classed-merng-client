/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Button, Confirm, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import MyPopup from '../util/MyPopup';
import { FETCH_POSTS_QUERY } from '../util/graphql';

const DELETE_POST_MUTATION = gql`
	mutation deletePost($postId: ID!) {
		deletePost(postId: $postId)
	}
`;

const DELETE_COMMENT_MUTATION = gql`
	mutation deleteComment($postId: ID!, $commentId: ID!) {
		deleteComment(postId: $postId, commentId: $commentId) {
			id
			comments {
				id
				username
				createdAt
				body
			}
			commentCount
		}
	}
`;

export default function DeleteButton({
	postId,
	commentId,
	deletePostCallback,
}) {
	const [confirmOpen, setConfirmOpen] = useState(false);

	const mutation = commentId
		? DELETE_COMMENT_MUTATION
		: DELETE_POST_MUTATION;

	const [deletePostOrMutation] = useMutation(mutation, {
		update(proxy) {
			setConfirmOpen(false);
			if (!commentId) {
				const data = proxy.readQuery({
					query: FETCH_POSTS_QUERY,
				});
				data.getPosts = data.getPosts.filter((p) => p.id !== postId);
				proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
			}
			if (deletePostCallback) deletePostCallback();
		},
		variables: {
			postId,
			commentId,
		},
	});

	return (
		<>
			<MyPopup content={postId ? 'Delete post' : 'Delete comment'}>
				<Button
					as='div'
					color='red'
					floated='right'
					onClick={() => setConfirmOpen(true)}
				>
					<Icon name='trash' style={{ margin: 0 }} />
				</Button>
			</MyPopup>
			<Confirm
				open={confirmOpen}
				onCancel={() => setConfirmOpen(false)}
				onConfirm={deletePostOrMutation}
			/>
		</>
	);
}

DeleteButton.propTypes = {
	postId: PropTypes.string,
	deletePostCallback: PropTypes.func,
	commentId: PropTypes.string,
};
