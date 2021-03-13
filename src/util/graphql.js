import gql from 'graphql-tag';

export const FETCH_POSTS_QUERY = gql`
	{
		getPosts {
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

export const LOGIN_USER = gql`
	mutation login($username: String!, $password: String!) {
		login(loginInput: { username: $username, password: $password }) {
			id
			email
			username
			createdAt
			token
		}
	}
`;
export const CREATE_POST_MUTATION = gql`
	mutation createPost($body: String!) {
		createPost(body: $body) {
			id
			body
			createdAt
			username
			likes {
				id
				username
				createdAt
			}
			likeCount
			comments {
				id
				body
				username
				createdAt
			}
			commentCount
		}
	}
`;
