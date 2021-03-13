/* eslint-disable operator-linebreak */
import React, { useContext, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import moment from 'moment';
import { useQuery, useMutation } from '@apollo/react-hooks';

import {
	Button,
	Card,
	Form,
	Grid,
	Icon,
	Image,
	Label,
} from 'semantic-ui-react';
import LikeButton from '../components/LikeButton';
import { AuthContext } from '../context/auth';
import DeleteButton from '../components/DeleteButton';
import MyPopup from '../util/MyPopup';

const FETCH_POST_QUERY = gql`
	query($postId: ID!) {
		getPost(postId: $postId) {
			id
			body
			createdAt
			username
			likeCount
			likes {
				username
			}
			commentCount
			comments {
				id
				username
				createdAt
				body
			}
		}
	}
`;

const SUBMIT_COMMENT_MUTATION = gql`
	mutation($postId: String!, $body: String!) {
		createComment(postId: $postId, body: $body) {
			id
			comments {
				id
				body
				createdAt
				username
			}
			commentCount
		}
	}
`;

export default function SinglePost(props) {
	const { postId } = props.match.params;
	const { user } = useContext(AuthContext);

	const commentInputRef = useRef(null);

	const [comment, setComment] = useState('');

	const { data } = useQuery(FETCH_POST_QUERY, {
		variables: {
			postId,
		},
	});

	const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
		update() {
			setComment('');
			commentInputRef.current.blur();
		},
		variables: {
			postId,
			body: comment,
		},
	});

	function deletePostCallback() {
		props.history.push('/');
	}

	let postMarkup;
	if (data === undefined) {
		postMarkup = <p>Loading post...</p>;
	} else if (data.getPost) {
		const {
			id,
			body,
			createdAt,
			username,
			comments,
			likes,
			commentCount,
			likeCount,
		} = data.getPost;

		postMarkup = (
			<Grid>
				<Grid.Row>
					<Grid.Column width='2'>
						<Image
							src='https://react.semantic-ui.com/images/avatar/large/molly.png'
							size='small'
							floated='right'
						/>
					</Grid.Column>
					<Grid.Column width={10}>
						<Card fluid>
							<Card.Content>
								<Card.Header>{username}</Card.Header>
								<Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
								<Card.Description>{body}</Card.Description>
							</Card.Content>
							<hr />
							<Card.Content>
								<LikeButton
									user={user}
									post={{ id, likes, likeCount }}
								/>
								<MyPopup content='Comment on Post'>
									<Button basic as='div' labelPosition='right'>
										<Button basic color='blue'>
											<Icon name='comments' />
										</Button>
										<Label basic color='blue' pointing='left'>
											{commentCount}
										</Label>
									</Button>
								</MyPopup>
								{user && user.username === username && (
									<DeleteButton
										postId={id}
										callback={deletePostCallback}
									/>
								)}
								{user && (
									<Card fluid>
										<Card.Content>
											<p>Post a comment</p>
											<Form>
												<div className='ui action input fluid'>
													<input
														type='text'
														name='comment'
														value={comment}
														onChange={(event) =>
															setComment(event.target.value)
														}
														placeholder='Comment...'
														ref={commentInputRef}
													/>
													<button
														type='submit'
														className='ui button teal'
														disabled={comment.trim() === ''}
														onClick={submitComment}
													>
														Submit
													</button>
												</div>
											</Form>
										</Card.Content>
									</Card>
								)}
							</Card.Content>
						</Card>
						{comments.map((item) => (
							<Card fluid key={item.id}>
								<Card.Content>
									{user && user.username === item.username && (
										<DeleteButton postId={id} commentId={item.id} />
									)}
									<Card.Header>
										{item.username}
										<Card.Meta>
											{moment(item.createdAt).fromNow()}
										</Card.Meta>
										<Card.Description>{item.body}</Card.Description>
									</Card.Header>
								</Card.Content>
							</Card>
						))}
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}
	return postMarkup;
}

SinglePost.propTypes = {
	match: PropTypes.object,
};
