/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-console */
import React, { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import { useHistory, Redirect, useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import LinearProgress from '@material-ui/core/LinearProgress';
import {
  Typography,
  Paper,
  Grid,
  Button,
  Box,
} from '@material-ui/core';
import clsx from 'clsx';
import propertiesfile from '../../resource.json';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiFormControl-root': {
      width: '95%',
      margin: theme.spacing(1),
    },
    '& .MuiDropzonePreviewList-image': {
      // width: '100%',
      maxHeight: '120px',
      height: 'auto',
      borderRadius: ['0px', '!important'],
    },
    '& .MuiDropzonePreviewList-removeButton': {
      top: '0px',
      right: '0px',
      color: 'red',
      zIndex: '1000',
    },
    '& .MuiDropzoneArea-text': {
      fontSize: ['12px', '!important'],
    },
    '& .MuiDropzoneArea-icon': {
      width: '20px',
      height: '20px',
    },
    '& .MuiDropzonePreviewList-imageContainer': {
      padding: ['0px', '!important'],
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '120px',
      width: '120px',
    },
  },
  pageTitle: {
    fontWeight: 'bold',
    color: theme.palette.text.primary,
    fontSize: '24px',
    // marginTop:'15px',
    // paddingBottom:'15px'
  },
  gridClass: {
    flexGrow: 1,
  },
  boxDiv: {
    background: '#ffffff',
    marginBottom: '15px',
  },
  boxDivPaper: {
    padding: '8px',
  },
  boxInnerDiv: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: '8px',
  },
  boxInnerDivToolTip: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    cursor: 'default',
  },
  formMargin: {
    marginTop: '8px',
    marginLeft: '8px',
  },
  buttonmargin: {
    margin: '8px',
  },
  cancelmargin: {
    marginLeft: '16px',
  },

}));

interface IcountryData {
  name: string,
  code: string,
  isdCode: string,
  currency: string,
  currencySymbol: string,
}

const ContryDetailComp: React.FC = () => {
  const history = useHistory();
  const classes = useStyles();
  const { id } = useParams<{ id: string }>();
  console.log(id);
  const initialCountryState = {
    name: '',
    code: '',
    isdCode: '',
    currency: '',
    currencySymbol: '',
  };
  const [country, setCountry] = useState<IcountryData>(initialCountryState);
  const [isFormInvalid, setIsFormInvalid] = useState([{
    name: '',
    code: '',
    isdCode: '',
    currency: '',
    currencySymbol: '',
  }] as any);
  const [progress, setProgress] = useState(100);
  const [errorOpen, setErrorOpen] = React.useState(false);
  const [apiError, setApiError] = React.useState('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCountry({ ...country, [name]: value });
  };

  const saveCountry = async () => {
    const errorObj = {} as any;
    let error = false;
    if (country.name !== '') {
      errorObj.name = false;
    } else {
      errorObj.name = true;
      error = true;
    }

    if (country.code !== '') {
      errorObj.code = false;
    } else {
      errorObj.code = true;
      error = true;
    }
    if (country.isdCode !== '') {
      errorObj.isdCode = false;
    } else {
      errorObj.isdCode = true;
      error = true;
    }
    if (country.currency !== '') {
      errorObj.currency = false;
    } else {
      errorObj.currency = true;
      error = true;
    }
    if (country.currencySymbol !== '') {
      errorObj.currencySymbol = false;
    } else {
      errorObj.currencySymbol = true;
      error = true;
    }

    setIsFormInvalid(errorObj);

    if (!error) {
      setProgress(0);
      const countryData = await updateCountry();
      setProgress(100);
      history.push('/countries');
    }
    // console.log(country);
    // axios.patch(`${process.env.REACT_APP_BASE_URL}countries/${id}`, country)
    //   .then((res) => history.push('/countries'));
  };

  const updateCountry = async () => {
    let returnValue;
    try {
      const response = axios.patch(`${process.env.REACT_APP_BASE_URL}countries/${id}`, country);
      returnValue = 'success';
    } catch (e: any) {
      setErrorOpen(true);
      setApiError(e.response.data.message);
      returnValue = 'error';
    }
    return returnValue;
  };

  const cancelClick = () => {
    history.push('/countries');
  };

  useEffect(() => {
    const fetchCountry = async () => {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}countries/${id}`);
      console.log(response.data);
      setCountry(response.data);
    };
    fetchCountry();
  }, []);

  return (
    <>
      { progress < 100
        ? (
          <div>
            <LinearProgress />
          </div>
        )
        : (
          <Grid
            container
            spacing={2}
            className={clsx(classes.gridClass, classes.root)}
          >
            <Grid item xs={12} spacing={1}>
              <Typography component="div" className={classes.pageTitle}>
                {propertiesfile.title_country_detail}
              </Typography>
            </Grid>

            <Grid item xs={9}>

              <Grid item xs={12} justify="flex-start">
                <Box component="div" className={classes.boxDiv} style={{ width: '100%', display: 'inline-block' }}>
                  <Paper elevation={3} className={classes.boxDivPaper} style={{ width: '100%', display: 'inline-block' }}>
                    <div className={classes.boxInnerDiv}>
                      <TextField
                        error={isFormInvalid.name}
                        helperText={isFormInvalid.name && propertiesfile.RequiredErrorMessage}
                        size="small"
                        type="text"
                        name="name"
                        label="Name"
                        variant="outlined"
                        value={country.name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className={classes.boxInnerDiv}>
                      <TextField
                        error={isFormInvalid.code}
                        helperText={isFormInvalid.code && propertiesfile.RequiredErrorMessage}
                        size="small"
                        type="text"
                        name="Code"
                        label="code"
                        variant="outlined"
                        value={country.code}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className={classes.boxInnerDiv}>
                      <TextField
                        error={isFormInvalid.isdCode}
                        helperText={isFormInvalid.isdCode && propertiesfile.RequiredErrorMessage}
                        size="small"
                        type="text"
                        name="isdCode"
                        label="ISD Code"
                        variant="outlined"
                        value={country.isdCode}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className={classes.boxInnerDiv}>
                      <TextField
                        error={isFormInvalid.currency}
                        helperText={isFormInvalid.currency && propertiesfile.RequiredErrorMessage}
                        size="small"
                        type="text"
                        name="currency"
                        label="Currency"
                        variant="outlined"
                        value={country.currency}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className={classes.boxInnerDiv}>
                      <TextField
                        error={isFormInvalid.currencySymbol}
                        helperText={isFormInvalid.currencySymbol && propertiesfile.RequiredErrorMessage}
                        size="small"
                        type="text"
                        name="currencySymbol"
                        label="Currency Symbol"
                        variant="outlined"
                        value={country.currencySymbol}
                        onChange={handleInputChange}
                      />
                    </div>

                    <Box className={classes.buttonmargin}>
                      <Button
                        variant="contained"
                        color="primary"
                        type="button"
                        onClick={saveCountry}
                      >
                        {propertiesfile.button_update}
                      </Button>

                      <Button
                        className={classes.cancelmargin}
                        variant="outlined"
                        type="button"
                        onClick={cancelClick}
                      >
                        {propertiesfile.button_cancel}

                      </Button>
                    </Box>

                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        )}
    </>
  );
};

export default ContryDetailComp;
