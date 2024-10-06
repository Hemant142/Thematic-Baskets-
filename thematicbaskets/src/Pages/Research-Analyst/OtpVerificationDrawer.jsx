import axios from "axios";
import { useState, useEffect } from "react";
import {
  Button,
  HStack,
  PinInput,
  PinInputField,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useToast,
  Text,
  Box,
  Stack,
  Icon,
} from "@chakra-ui/react";
import { BiTimeFive } from "react-icons/bi"; // For timer icon
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { otpVarificationManager } from "../../Redux/authReducer/action";

const OtpVerificationDrawer = ({ isOpen, onClose, onVerify, authToken, onResendOtp }) => {
  const [otp, setOtp] = useState(""); // OTP input state
  const [timer, setTimer] = useState(60); // Timer state, starting at 60 seconds
  const [isDisabled, setIsDisabled] = useState(false); // State to disable/enable Verify button
  const toast = useToast();
  const dispatch = useDispatch();

  // Countdown timer to manage OTP input expiry
  useEffect(() => {
    if (isOpen) {
      setTimer(60); // Reset the timer to 60 seconds each time the drawer opens
      setIsDisabled(false); // Re-enable the OTP input and verify button
    }

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(countdown);
          setIsDisabled(true); // Disable OTP input and Verify button when time runs out
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown); // Cleanup timer when component unmounts
  }, [isOpen]);

  // Function to handle OTP submission
  const handleOtpSubmit = () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Please enter a valid 6-digit OTP",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    // Dispatch OTP verification action
    dispatch(otpVarificationManager(otp, authToken))
      .then((response) => {
        if (response.data.status === "success") {
          Cookies.set("login_token_ra", `${authToken}`);
          Cookies.set("username_ra", `${response.data.data.centrumId}`);

          toast({
            title: "OTP verified successfully!",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
          setTimeout(() => {
            onVerify();
            onClose();
          }, 1000);
        } else if (response.data.status === "failed" && response.data.message === "OTP Expired") {
          toast({
            title: "OTP Expired!",
            status: "warning",
            duration: 2000,
            isClosable: true,
          });
        } else if (response.data.status === "failed" && response.data.message === "Invalid OTP") {
          toast({
            title: "Invalid OTP",
            status: "warning",
            duration: 2000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        toast({
          title: "Failed to verify OTP",
          description: "An error occurred",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent bg="#f9f9f9">
        <DrawerHeader textAlign="center" borderBottomWidth="1px">
          <Text fontSize="2xl" fontWeight="bold" color="#244c9c">
            OTP Verification
          </Text>
        </DrawerHeader>

        <DrawerBody>
          <Text mb={4} textAlign="center" fontWeight="medium">
            Enter the 6-digit OTP sent to your phone:
          </Text>

          <HStack justify="center" spacing={3} mb={6}>
            <PinInput
              value={otp}
              onChange={(value) => setOtp(value)}
              otp
              isDisabled={isDisabled} // Disable input if time runs out
              size="lg"
              focusBorderColor="#244c9c"
              variant="outline"
              borderColor="gray.300"
            >
              {[...Array(6)].map((_, i) => (
                <PinInputField key={i} borderRadius="md" />
              ))}
            </PinInput>
          </HStack>

          <Box display="flex" justifyContent="center" alignItems="center" mb={6}>
            <Icon as={BiTimeFive} boxSize={6} color="gray.500" mr={2} />
            <Text fontSize="lg" color={timer <= 10 ? "red.500" : "gray.700"}>
              Time remaining: <strong>{timer}s</strong>
            </Text>
          </Box>

            {/* Show Resend OTP button after the timer runs out */}
        {isDisabled && (
          <Box justifyContent="center" pt={0}>
            <Button
              colorScheme="teal"
              variant="ghost"
              onClick={() => {
                setOtp(""); // Clear OTP input
                onResendOtp(); // Trigger OTP resend function
                setIsDisabled(false); // Re-enable the button
                setTimer(60); // Reset the timer
              }}
              size="md"
              transition="all 0.3s ease"
            >
              Resend OTP
            </Button>
          </Box>
        )}
        </DrawerBody>

        <DrawerFooter justifyContent="space-between">
          <Button variant="outline" onClick={onClose} colorScheme="gray">
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleOtpSubmit}
            isDisabled={isDisabled} // Disable the button after timer runs out
            size="lg"
            transition="all 0.3s ease"
          >
            Verify OTP
          </Button>
        </DrawerFooter>

      
      </DrawerContent>
    </Drawer>
  );
};

export default OtpVerificationDrawer;
