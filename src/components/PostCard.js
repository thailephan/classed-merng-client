/* eslint-disable object-curly-newline */
import React, { useContext } from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';

import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import { AuthContext } from '../context/auth';
import MyPopup from '../util/MyPopup';

const PostCard = ({ post }) => {
	const {
		body,
		createdAt,
		id,
		username,
		likeCount,
		commentCount,
		likes,
	} = post;

	const { user } = useContext(AuthContext);

	return (
		<Card fluid>
			<Card.Content>
				<Image
					floated='right'
					size='mini'
					src='https://react.semantic-ui.com/images/avatar/large/molly.png'
				/>
				<Card.Header>{username}</Card.Header>
				<Card.Meta as={Link} to={`/posts/${id}`}>
					{moment(createdAt).fromNow(true)}
				</Card.Meta>
				<Card.Description>{body}</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<LikeButton user={user} post={{ id, likes, likeCount }} />
				<MyPopup content='Comment on Post'>
					<Button
						as={Link}
						to={`/posts/${id}`}
						color='blue'
						icon='comments'
						label={{
							basic: true,
							color: `blue`,
							pointing: 'left',
							content: `${commentCount}`,
						}}
					/>
				</MyPopup>
				{user && user.username === username && (
					<DeleteButton postId={id} />
				)}
			</Card.Content>
		</Card>
	);
};
PostCard.propTypes = {
	post: PropTypes.shape({
		body: PropTypes.string,
		id: PropTypes.string,
		createdAt: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.instanceOf(Date),
		]),
		username: PropTypes.string,
		likeCount: PropTypes.number,
		commentCount: PropTypes.number,
		likes: PropTypes.arrayOf(PropTypes.object),
	}),
};

PostCard.defaultProps = {
	post: {
		body: 'Empty post',
		id: Math.random().toString(10),
		createdAt: new Date().toISOString(),
		username: 'anonymous',
		likeCount: 0,
		commentCount: 0,
		likes: [],
	},
};

export default PostCard;
