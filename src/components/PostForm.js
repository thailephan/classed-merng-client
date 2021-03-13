import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import useForm from '../util/hooks';
import {
	CREATE_POST_MUTATION,
	FETCH_POSTS_QUERY,
} from '../util/graphql';

export default function PostForm() {
	const { values, onChange, onSubmit } = useForm(createPostCallback, {
		body: '',
	});
	const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
		variables: values,
		update(proxy, { data: { createPost: newPost } }) {
			const data = proxy.readQuery({
				query: FETCH_POSTS_QUERY,
			});
			data.getPosts = [...data.getPosts, newPost];
			proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
			values.body = '';
		},
	});

	function createPostCallback() {
		createPost();
	}

	return (
		<>
			<Form onSubmit={onSubmit}>
				<h2>Create a post:</h2>
				<Form.Field>
					<Form.Input
						placeholder='Hi World!'
						name='body'
						onChange={onChange}
						value={values.body}
						error={error}
					/>
					<Button type='submit' color='teal'>
						Submit
					</Button>
				</Form.Field>
			</Form>
			{error && (
				<div className='ui error message' style={{ marginBottom: 20 }}>
					<ul className='list'>
						<li>{error.graphQLErrors[0].message}</li>
					</ul>
				</div>
			)}
		</>
	);
}
