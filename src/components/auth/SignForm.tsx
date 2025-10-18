'use client';
import { useState } from 'react';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface SignupFormProps {
  onSuccess: (token: string, userData: any) => void;
  onSwitchToLogin: () => void;
}

export default function SignupForm({ onSuccess, onSwitchToLogin }: SignupFormProps) {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpId, setOtpId] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({ ...prev, phone: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!formData.name.trim()) {
      setErrorMessage('Please enter your name');
      return;
    }

    if (!formData.phone || formData.phone.length < 10) {
      setErrorMessage('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/auth/signup/send-otp`,
        {
          phone: `+${formData.phone}`,
          name: formData.name,
        }
      );

      if (response.data.status) {
        setOtpId(response.data.payload.otpId);
        setStep('otp');
        setSuccessMessage('OTP sent to your WhatsApp!');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to send OTP. Please try again.';
      setErrorMessage(errorMsg);
      console.error('Error sending OTP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    if (errorMessage) setErrorMessage(null);
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setErrorMessage('Please enter complete OTP');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/auth/signup/verify-otp`,
        {
          otpId,
          otp: otpCode,
          name: formData.name,
        }
      );

      if (response.data.status) {
        const { token, user } = response.data.payload;
        onSuccess(token, user);
      }
    } catch (error: any) {
      console.log("error",error);
      const errorMsg = error.response?.data?.message || 'Invalid OTP. Please try again.';
      setErrorMessage(errorMsg);
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
      console.error('Error verifying OTP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/auth/resend-otp`,
        { otpId }
      );

      if (response.data.status) {
        setSuccessMessage('New OTP sent to your WhatsApp!');
        setOtp(['', '', '', '', '', '']);
        document.getElementById('otp-0')?.focus();
      }
    } catch (error: any) {
      console.log(error.response);
      const errorMsg = error.response?.data?.message || 'Failed to resend OTP.';
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  return (
    <div className="w-full max-w-md">
      {step === 'details' ? (
        <>
          <h2 className="text-3xl font-bold mb-2">Get Started Now</h2>
          <p className="text-gray-600 mb-6">Create your account to continue</p>

          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <PhoneInput
                country={'in'}
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="Enter phone number"
                disabled={isLoading}
                inputClass="w-full"
                containerClass="phone-input-container"
                buttonClass="phone-input-button"
                inputStyle={{
                  width: '100%',
                  height: '48px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid #D1D5DB',
                }}
                buttonStyle={{
                  borderRadius: '8px 0 0 8px',
                  border: '1px solid #D1D5DB',
                }}
              />
            </div>

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{errorMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 text-white font-semibold p-3 rounded-lg hover:bg-orange-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[48px]"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Sending OTP...</span>
                </>
              ) : (
                'Send OTP'
              )}
            </button>
          </form>

          <div className="flex items-center justify-center my-6">
            <hr className="w-full border-gray-300" />
            <span className="mx-4 text-gray-500 text-sm">Or</span>
            <hr className="w-full border-gray-300" />
          </div>

          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              disabled={isLoading}
              className="text-orange-500 font-semibold hover:text-orange-600 disabled:opacity-50"
            >
              Sign In
            </button>
          </p>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold mb-2">Verify OTP</h2>
          <p className="text-gray-600 mb-6">
            We've sent a 6-digit code to
            <br />
            <span className="font-semibold">+{formData.phone}</span>
          </p>

          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(index, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  disabled={isLoading}
                />
              ))}
            </div>

            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-600 text-sm text-center">{successMessage}</p>
              </div>
            )}

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm text-center">{errorMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 text-white font-semibold p-3 rounded-lg hover:bg-orange-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[48px]"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Verifying...</span>
                </>
              ) : (
                'Verify OTP'
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isLoading}
                className="text-orange-500 font-semibold hover:text-orange-600 disabled:opacity-50"
              >
                Resend OTP
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setStep('details');
                setOtp(['', '', '', '', '', '']);
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              disabled={isLoading}
              className="w-full text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50"
            >
              ← Change Phone Number
            </button>
          </form>
        </>
      )}
    </div>
  );
}
