import React from 'react';
import PropTypes from 'prop-types';
import { favoritesWrapper } from './favorites.styled';

const favorites = () => (
 <favoritesWrapper data-testid="favorites">
    favorites Component
 </favoritesWrapper>
);

favorites.propTypes = {};

favorites.defaultProps = {};

export default favorites;
