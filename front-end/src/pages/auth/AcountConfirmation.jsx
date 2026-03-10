import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Api } from '../../Services/App/Api';
import { useNotif } from '../../Services/App/slice/Dispatches/NotifDispatch';

export default function AccountConfirmation() {
  const { token } = useParams();
  const [isValid, setIsValid] = useState(false);
  const { showMessage } = useNotif();

  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await Api.confirmAccount(token);
        console.log(res);
        if (res.status == 200 || res.status == 201) {
          setIsValid(true);
          showMessage({
            message: res.data.message,
            type: 'success',
          });
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } catch (error) {
        showMessage({
          message:
            error?.response?.data?.message ||
            'Failed to validate account. Please try again.',
          type: 'error',
        });

        navigate('/login');
      }
    };

    fetch(); // ✅ Call the async function
  }, [token, showMessage, navigate]);

  return (
    <div>{isValid ? 'Account confirmed! Redirecting...' : 'Verifying...'}</div>
  );
}
