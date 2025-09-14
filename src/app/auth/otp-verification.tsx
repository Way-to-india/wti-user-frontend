// src/app/(auth)/otp-verification.tsx
'use client';
import loginBackground from '@/assets/images/loginImage.png';
import { auth } from '@/lib/firebase';
import { CircleNotch } from '@phosphor-icons/react';
import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signInWithPhoneNumber,
} from 'firebase/auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import OtpInput from 'react-otp-input';
import PhoneInput from 'react-phone-input-2';
import CircleLoader from '../../components/CircleLoader';

interface OTPVerificationProps {
  onVerify: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ onVerify }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [verificationId, setVerificationId] = useState('');
  const router = useRouter();

  const handleSendOtp = async () => {
    if (!phoneNumber) {
      toast.error('Please enter a valid phone number.');
      return;
    }

    setLoading(true);
    const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
    });

    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        `+${phoneNumber}`,
        recaptchaVerifier
      );
      setVerificationId(confirmationResult.verificationId);
      setShowOTP(true); // Show the OTP input section
      toast.success(`OTP sent to ${phoneNumber}`);
    } catch (error) {
      toast.error('Error sending OTP. Please try again.');
      console.error('Error sending OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error('Please enter the OTP.');
      return;
    }

    setLoading(true);

    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      await signInWithCredential(auth, credential);
      toast.success('OTP verified successfully!');

      // Redirect to the landing page after successful verification
      onVerify(); // Callback for verification handling
      router.push('/'); // Redirect to landing page
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
      console.error('Error verifying OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex flex-col md:flex-row w-full bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-8 text-black justify-center items-center flex flex-col">
          <div className="w-full max-w-md text-left mx-auto">
            {!showOTP ? (
              // Phone number input section
              <>
                <h2 className="text-3xl mb-8 font-bold">OTP Verification</h2>
                <div id="recaptcha-container"></div>
                <PhoneInput
                  country={'in'}
                  value={phoneNumber}
                  onChange={value => setPhoneNumber(value)}
                  placeholder="Enter your phone number"
                  inputClass="w-full p-2 border border-gray-300 rounded-md mb-4"
                />
                <button
                  onClick={handleSendOtp}
                  className="w-full bg-carrot-orange text-white font-bold p-2 rounded-lg hover:bg-orange-600 transition duration-300"
                  disabled={loading}
                >
                  {loading ? <CircleLoader /> : 'Send OTP'}
                </button>
                <div className="flex items-center justify-center my-8 w-full">
                  <hr className="w-full text-gray-300" />
                  <span className="mx-4 text-gray-500">Or</span>
                  <hr className="w-full border-gray-300" />
                </div>
                <p className="text-center mt-4">
                  Have an account?{' '}
                  <a
                    href="#" // Prevent navigation to a different URL
                    onClick={e => {
                      e.preventDefault();
                      router.push(`/auth?step=login`); // Switch to login mode
                    }}
                    className="text-blue-600 underline"
                  >
                    Sign In
                  </a>
                </p>
              </>
            ) : (
              // OTP input section
              <>
                <h2 className="text-3xl mb-2 font-bold">We've sent you an OTP</h2>
                <div id="recaptcha-container"></div>
                <p className="mb-4"> to the number +{phoneNumber}</p>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={4}
                  inputStyle={{
                    width: '6rem',
                    height: '3rem',
                    margin: '0.5rem',
                    fontSize: '1.5rem',
                    borderRadius: '10px',
                    border: '2px solid rgba(169, 169, 169, 0.5)',
                  }}
                  shouldAutoFocus
                  renderInput={props => <input {...props} />}
                />
                <button
                  onClick={handleVerifyOtp}
                  className="w-full bg-carrot-orange text-white font-bold p-2 rounded-lg hover:bg-orange-600 transition duration-300 mt-8"
                  disabled={loading}
                >
                  {loading ? <CircleNotch size={24} className="animate-spin" /> : 'Verify OTP'}
                </button>
                <div className="flex items-center justify-center my-8 w-full">
                  <hr className="w-full text-gray-300" />
                  <span className="mx-4 text-gray-500">Or</span>
                  <hr className="w-full border-gray-300" />
                </div>
                <p className="text-center mt-4">
                  Have an account?{' '}
                  <a
                    href="#" // Prevent navigation to a different URL
                    onClick={e => {
                      e.preventDefault();
                      router.push(`/auth?step=login`); // Switch to login mode
                    }}
                    className="text-blue-600 underline"
                  >
                    Sign In
                  </a>
                </p>
              </>
            )}
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="relative w-full md:w-1/2 h-64 md:h-screen">
          <Image src={loginBackground} alt="Login Background" fill className="rounded-3xl" />
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
