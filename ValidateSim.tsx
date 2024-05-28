// import React, { useState, FormEvent, ChangeEvent } from 'react';
// import { Box, TextField, Button, Typography, Container } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import axios from 'axios';

// const FormContainer = styled(Container)({
//   marginTop: '2rem',
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
// });

// const ErrorMessage = styled(Typography)({
//   color: 'red',
//   marginTop: '1rem',
// });

// const SuccessMessage = styled(Typography)({
//   color: 'green',
//   marginTop: '1rem',
// });

// interface ApiResponse {
//   error?: string;
//   message?: string;
// }

// const SIMValidationForm: React.FC = () => {
//   const [simNumber, setSimNumber] = useState<string>('');
//   const [serviceNumber, setServiceNumber] = useState<string>('');
//   const [error, setError] = useState<string>('');
//   const [success, setSuccess] = useState<string>('');

//   const validateInputs = (): boolean => {
//     if (!/^\d{12}$/.test(simNumber)) {
//       setError('Subscriber Identity Module (SIM) number should be a 13-digit numeric value.');
//       return false;
//     }
//     if (!/^\d{10}$/.test(serviceNumber)) {
//       setError('The service number should be a 10-digit numeric value.');
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     if (validateInputs()) {
//       try {
//         const response = await axios.post<ApiResponse>('http://localhost:3005/api/validate-sim', {
//           simNumber,
//           serviceNumber,
//         });

//         if (response.data.error) {
//           setError(response.data.error);
//         } else {
//           setSuccess('Subscriber Identity Module (SIM) details validated successfully. Available offers will be shown here.');
//         }
//       } catch (error) {
//         setError('Error validating SIM and service number. Please try again later.');
//       }
//     }
//   };

//   const handleSimNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setSimNumber(e.target.value);
//   };

//   const handleServiceNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setServiceNumber(e.target.value);
//   };

//   return (
//     <FormContainer maxWidth="sm">
//       <Typography variant="h4" gutterBottom>
//         SIM Validation
//       </Typography>
//       <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
//         <TextField
//           margin="normal"
//           required
//           fullWidth
//           id="simNumber"
//           label="SIM Number"
//           name="simNumber"
//           value={simNumber}
//           onChange={handleSimNumberChange}
//           error={!!error}
//         />
//         <TextField
//           margin="normal"
//           required
//           fullWidth
//           id="serviceNumber"
//           label="Service Number"
//           name="serviceNumber"
//           value={serviceNumber}
//           onChange={handleServiceNumberChange}
//           error={!!error}
//         />
//         <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
//           Validate
//         </Button>
//         {error && <ErrorMessage>{error}</ErrorMessage>}
//         {success && <SuccessMessage>{success}</SuccessMessage>}
//       </Box>
//     </FormContainer>
//   );
// };

// export default SIMValidationForm;



import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Box, TextField, Button, Typography, Container, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const FormContainer = styled(Container)({
  marginTop: '2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

interface ApiResponse {
  error?: string;
  message?: string;
}

const SIMValidationForm: React.FC = () => {
  const [simNumber, setSimNumber] = useState<string>('');
  const [serviceNumber, setServiceNumber] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  const validateInputs = (): boolean => {
    if (!/^\d{12}$/.test(simNumber)) {
      setError('Subscriber Identity Module (SIM) number should be a 13-digit numeric value.');
      return false;
    }
    if (!/^\d{10}$/.test(serviceNumber)) {
      setError('The service number should be a 10-digit numeric value.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (validateInputs()) {
      try {
        const response = await axios.post<ApiResponse>('http://localhost:3005/api/validate-sim', {
          simNumber,
          serviceNumber,
        });

        if (response.data.error) {
          setError(response.data.error);
          setSnackbarOpen(true);
        } else {
          setSuccess('Subscriber Identity Module (SIM) details validated successfully. Available offers will be shown here.');
          setSnackbarOpen(true);
        }
      } catch (error) {
        setError('Error validating SIM and service number. Please try again later.');
        setSnackbarOpen(true);
      }
    } else {
      setSnackbarOpen(true);
    }
  };

  const handleSimNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSimNumber(e.target.value);
  };

  const handleServiceNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setServiceNumber(e.target.value);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <FormContainer maxWidth="sm" style={{marginTop:'8rem', marginLeft:'18rem', border:'0.5px solid black',padding:'50px' , maxWidth:'73%'}}>
      <Typography variant="h4" gutterBottom style={{paddingRight:'39rem', color:'blue'}}>
        Validate SIM
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="simNumber"
          label="SIM Number"
          name="simNumber"
          value={simNumber}
          onChange={handleSimNumberChange}
          error={!!error}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="serviceNumber"
          label="Service Number"
          name="serviceNumber"
          value={serviceNumber}
          onChange={handleServiceNumberChange}
          error={!!error}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}style={{backgroundColor:'orange'}}>
          Validate
        </Button>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        {error ? (
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        ) : (
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        )}
      </Snackbar>
    </FormContainer>
  );
};

export default SIMValidationForm;
