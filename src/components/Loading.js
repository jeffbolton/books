import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';

export default ({isLoading}) => {
  console.log(isLoading)
  if (isLoading) {
    return (<LinearProgress />)
  } else {
    return null
  }
}