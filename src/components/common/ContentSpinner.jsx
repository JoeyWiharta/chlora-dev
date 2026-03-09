import React from 'react';
import PropTypes from 'prop-types';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Spinner } from '../ui/spinner';

const ContentSpinner = (props) => {
    return (
        <div className={`flex flex-col items-center justify-center gap-3 w-full h-full`}>
            <Spinner className="size-8" />
            {props.text && (
                <span className="text-sm text-muted-foreground">
                    {props.text}
                </span>
            )}
        </div>
    );
};

ContentSpinner.propTypes = {
    text: PropTypes.any,
};

export default ContentSpinner;