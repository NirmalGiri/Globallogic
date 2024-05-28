// import React, { useState, FormEvent, ChangeEvent } from 'react';
// import { Box, TextField, Button, Typography, Container, Snackbar, Alert } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import axios from 'axios';

// const FormContainer = styled(Container)({
//   marginTop: '2rem',
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
// });

// interface ApiResponse {
//   error?: string;
//   message?: string;
// }

// const CustomerDetailsForm: React.FC = () => {
//   const [email, setEmail] = useState<string>('');
//   const [dob, setDob] = useState<string>('');
//   const [error, setError] = useState<string>('');
//   const [success, setSuccess] = useState<string>('');
//   const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

//   const validateInputs = (): boolean => {
//     if (!email || !dob) {
//       setError('Email/dob value is required');
//       return false;
//     }
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (!emailRegex.test(email)) {
//       setError('Invalid email');
//       return false;
//     }
//     const dobRegex = /^(0[1-9]|1[0-2])-([0-2][0-9]|3[01])-\d{4}$/;
//     if (!dobRegex.test(dob)) {
//       setError('DOB should be in mm-dd-yyyy format');
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
//         const response = await axios.post<ApiResponse>('http://localhost:3005/api/validate-cust', {
//           email,
//           dob,
//         });

//         if (response.data.error) {
//           setError(response.data.error);
//           setSnackbarOpen(true);
//         } else {
//           setSuccess('Customer details validated successfully.');
//           setSnackbarOpen(true);
//         }
//       } catch (error) {
//         setError('Error validating customer details. Please try again later.');
//         setSnackbarOpen(true);
//       }
//     } else {
//       setSnackbarOpen(true);
//     }
//   };

//   const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setEmail(e.target.value);
//   };

//   const handleDobChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setDob(e.target.value);
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbarOpen(false);
//   };

//   return (
//     <FormContainer maxWidth="sm">
//       <Typography variant="h4" gutterBottom>
//         Customer Details Validation
//       </Typography>
//       <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
//         <TextField
//           margin="normal"
//           required
//           fullWidth
//           id="email"
//           label="Email"
//           name="email"
//           value={email}
//           onChange={handleEmailChange}
//           error={!!error}
//         />
//         <TextField
//           margin="normal"
//           required
//           fullWidth
//           id="dob"
//           label="Date of Birth (mm-dd-yyyy)"
//           name="dob"
//           value={dob}
//           onChange={handleDobChange}
//           error={!!error}
//         />
//         <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
//           Validate
//         </Button>
//       </Box>
//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
//       >
//         {error ? (
//           <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
//             {error}
//           </Alert>
//         ) : (
//           <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
//             {success}
//           </Alert>
//         )}
//       </Snackbar>
//     </FormContainer>
//   );
// };

// export default CustomerDetailsForm;


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

const CustomerDetailsForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [dob, setDob] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  const validateInputs = (): boolean => {
    if (!email || !dob) {
      setError('Email/dob value is required');
      return false;
    }
    // Improved email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,3}$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email');
      return false;
    }
    const dobRegex = /^\d{4}-\d{2}-\d{2}/;
    if (!dobRegex.test(dob)) {
      setError('DOB should be in mm-dd-yyyy format');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (validateInputs()) {
      console.log('Email:', email, 'DOB:', dob); // Logging email and dob
      try {
        const response = await axios.post<ApiResponse>('http://localhost:3005/api/validate-cust', {
          email,
          dob,
        });

        if (response.data.error) {
          setError(response.data.error);
          setSnackbarOpen(true);
        } else {
          setSuccess('Customer details validated successfully.');
          setSnackbarOpen(true);
        }
      } catch (error:any) {
        console.error('Error response:', error.response); // Log the error response
        if (error.response && error.response.data && error.response.data.error) {
          setError(error.response.data.error);
        } else {
          setError('Error validating customer details. Please try again later.');
        }
        setSnackbarOpen(true);
      }
    } else {
      setSnackbarOpen(true);
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleDobChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDob(e.target.value);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <FormContainer maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Customer Details Validation
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          value={email}
          onChange={handleEmailChange}
          error={!!error}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="dob"
          label="Date of Birth (mm-dd-yyyy)"
          name="dob"
          value={dob}
          onChange={handleDobChange}
          error={!!error}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
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

export default CustomerDetailsForm;


