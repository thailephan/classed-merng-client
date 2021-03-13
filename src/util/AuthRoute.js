/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-confusing-arrow */

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/auth';

function AuthRoute({ component: Component, ...rest }) {
	const { user } = useContext(AuthContext);

	return (
		<Route
			{...rest}
			render={(props) =>
				user ? <Redirect to='/' /> : <Component {...props} />
			}
		/>
	);
}

AuthRoute.propTypes = {
	component: PropTypes.func,
};

export default AuthRoute;
