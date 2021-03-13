import React from 'react';
import { Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';

function MyPopup({ content, children }) {
	return <Popup inverted content={content} trigger={children} />;
}

MyPopup.propTypes = {
	content: PropTypes.string,
	children: PropTypes.element,
};

export default MyPopup;
