import React, { useState, useContext } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import PropTypes from 'prop-types';

import { LOGIN_USER } from '../util/graphql';
import { AuthContext } from '../context/auth';
import useForm from '../util/hooks';

export default function Login(props) {
	const context = useContext(AuthContext);
	const [errors, setErrors] = useState({});

	const { values, onChange, onSubmit } = useForm(loginUserCallback, {
		username: '',
		password: '',
	});

	const [loginUser, { loading }] = useMutation(LOGIN_USER, {
		update(_, { data: { login: userData } }) {
			// console.log(_result);
			context.login(userData);
			props.history.push('/');
		},
		onError(err) {
			setErrors(err.graphQLErrors[0].extensions.exception.errors);
		},
		variables: values,
	});

	function loginUserCallback() {
		loginUser();
	}
	return (
		<div className='form-container'>
			<Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
				<h1>Login</h1>
				<Form.Input
					label='Username'
					placeholder='Username..'
					name='username'
					error={errors.username}
					type='text'
					value={values.username}
					onChange={onChange}
				/>
				<Form.Input
					label='Password'
					placeholder='Password..'
					name='password'
					type='password'
					value={values.password}
					error={errors.password}
					onChange={onChange}
				/>
				<Button type='submit' primary>
					Login
				</Button>
			</Form>
			{Object.keys(errors).length > 0 && (
				<div className='ui error message'>
					<ul className='list'>
						{Object.values(errors).map((value) => (
							<li key={value}>{value}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

Login.propTypes = {
	history: PropTypes.object,
};
