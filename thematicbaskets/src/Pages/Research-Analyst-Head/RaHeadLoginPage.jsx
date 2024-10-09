import React, { useState, useEffect } from "react";
import {
  Flex,
  Box,
  Text,
  FormControl,
  FormLabel,
  HStack,
  PinInput,
  PinInputField,
  Button,
  useToast,
  Image,
  Card,
  CardBody,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Input,
  Divider,
  Heading,

} from "@chakra-ui/react";
import 'animate.css/animate.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
import {
  faEye,
  faEyeSlash,
  faLock,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Flipper, Flipped } from "react-flip-toolkit";
import axios from "axios";
import Navbar from "../../Components/Research-Analyst/Navbar";
import { useDispatch } from "react-redux";
import {
  managerToken,
  otpVarificationManager,
} from "../../Redux/authReducer/action";
import Login from "../../Images/login.png";
import Logo from "../../Images/logo.png"

export default function RaHeadLoginPage() {
  const lock = <FontAwesomeIcon size="lg" icon={faLock} />;
  const eye = <FontAwesomeIcon size="lg" icon={faEye} />;
  const closeye = <FontAwesomeIcon size="lg" icon={faEyeSlash} />;
  const user = <FontAwesomeIcon size="lg" icon={faUserCircle} />;

  const [showOtpDrawer, setShowOtpDrawer] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [show, setShow] = useState(false);
  const [formdata, setFormdata] = useState({
    userId: "",
    password: "",
    userRole:"researchAnalystHead"
  });
  const [flipLoginBox, setFlipLoginBox] = useState(false);
  const [otp, setOtp] = useState(""); // OTP value as a single string
  const [timer, setTimer] = useState(60); // Timer state
  const [otpSent, setOtpSent] = useState(false); // Flag to track if OTP has been sent
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch();
  const token = Cookies.get("login_token_rh");

  useEffect(()=>{
    if (token) {
      return navigate("/rahead/dashboard");
    }

  },[])

  const NewURL = process.env.REACT_APP_NewURL;

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(managerToken(formdata))
      .then((res) => {
        console.log(res,"RESponse manager Token")
        if (
          res.data.status === "failed" &&
          res.data.message === "Incorrect username or password"
        ) {
          toast({
            title: res.data.message,
            position: "bottom",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        }
        if (res.data?.access_token) {
          const token = res.data.access_token;
          setAuthToken(token);

          toast({
            title: "Please Wait",
            position: "bottom",
            status: "success",
            duration: 2000,
            isClosable: true,
          });

          // Send OTP request using the Bearer token
          axios
            .post(
              `${NewURL}web-app/manager/request-otp?managerRole=researchAnalystHead`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((otpResponse) => {
              console.log(otpResponse,"otpResponse")
              toast({
                title: "OTP sent to your registered email!",
                position: "bottom",
                status: "success",
                duration: 2000,
                isClosable: true,
              });

              // Start the timer
              setTimer(60);
              setOtpSent(true); // Set flag to indicate OTP sent
              setFlipLoginBox(true); // Flip the login box to show OTP verification
            })
            .catch((otpError) => {
              toast({
                title: "Failed to send OTP",
                position: "bottom",
                status: "error",
                duration: 2000,
                isClosable: true,
              });
            });
        }
      })
      .catch((error) => {
        console.log(error,"Error")
        const errorMessage = error.response?.data?.detail || "Login failed";
        toast({
          title: errorMessage,
          position: "bottom",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  };

  const handleOtpVerification = () => {
    if (otp === "" || otp.length < 6) {
      toast({
        title: "Please enter a valid OTP",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }

    let data={
      otp:otp,
      mangerRole:"researchAnalystHead"
    }
    // Dispatch OTP verification action
    dispatch(otpVarificationManager(data, authToken))
      .then((response) => {
        console.log(response, "otpVarificationManager");
        if (response.data.status === "success") {
          Cookies.set("login_token_rh", `${response.data.data.verifiedAccessToken}`);
          Cookies.set("username_rh", `${response.data.data.username}`);

          toast({
            title: "OTP verified successfully!",
            status: "success",
            duration: 2000,
            isClosable: true,
          });

          setTimeout(() => {
            toast({
              title: "Login successful",
              status: "success",
              duration: 2000,
              isClosable: true,
            });
            navigate("/rahead/dashboard");
          }, 1000);
        } else if (
          response.data.status === "failed" &&
          response.data.message === "OTP Expired"
        ) {
          toast({
            title: "OTP Expired!",
            status: "warning",
            duration: 2000,
            isClosable: true,
          });
        } else if (
          response.data.status === "failed" &&
          response.data.message === "Invalid OTP"
        ) {
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

  // Timer logic
  useEffect(() => {
    let timerInterval;
    if (otpSent && timer > 0) {
      timerInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [otpSent, timer]);

  const resendOtp = () => {
    // setTimer(60);
    setOtp("")
    setOtpSent(false); // Reset OTP sent flag
    // Here you can call the API to resend the OTP
    handleResendOTP();
  };

  const handleResendOTP = () => {
    // Send OTP request using the Bearer token
    axios
      .post(
        `${NewURL}web-app/manager/request-otp?managerRole=researchAnalystHead`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((otpResponse) => {
        toast({
          title: "OTP sent to your registered email!",
          position: "bottom",
          status: "success",
          duration: 2000,
          isClosable: true,
        });

        // Start the timer
        setTimer(60);
        setOtpSent(true); // Set flag to indicate OTP sent
        setFlipLoginBox(true); // Flip the login box to show OTP verification
      })
      .catch((otpError) => {
        toast({
          title: "Failed to send OTP",
          position: "bottom",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  };

  return (
    <Box w="100%" minH="100vh" bg="#f0f4fa">
    <Flex
      justifyContent="space-between"
      w="100%"
      direction={{ base: "column", md: "row" }}
      py={{ base: "20px", md: "0" }}
    >
      {/* Left Side (Login Image) */}
      <Box
        margin="auto"
        w={{ base: "90%", md: "50%" }}
        p={{ base: "20px", md: "50px" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Card mt={{ base: "10px", md: "5%" }}>
          <CardBody>
            <Image
              src={Login}
              alt="Login"
              borderRadius="lg"
              objectFit="contain"
              boxSize={{ base: "250px", md: "100%" }}
            />
          </CardBody>
        </Card>
      </Box>

      {/* Right Side (Form Section) */}
      <Box
        w={{ base: "90%", md: "50%" }}
        margin="auto"
        p={{ base: "20px", md: "50px" }}
      >
        <Box
          display="flex"
          justifyContent="center"
          mb={{ base: "10%", md: "15%" }}
          mt={{ base: "10%", md: "5%" }}
          className="animate__animated animate__backInDown"
        >
          <Image
            src={Logo}
            alt="Logo"
            boxSize={{ base: "50%", md: "50%" }}
            objectFit="contain"
          />
        </Box>

        <Box
          w="80%"
          margin="auto"
          className="animate__animated animate__backInRight"
        >
          <Heading
            as="h3"
            size="md"
            height="auto"
            fontSize={{ base: "20px", md: "24px" }}
            fontWeight="400"
            lineHeight={{ base: "26px", md: "30px" }}
            letterSpacing="0.4px"
            textAlign="center"
            color="#244C9B"
          >
            Welcome to Research Analyst Head portal
          </Heading>
        </Box>

        <Flipper flipKey={flipLoginBox}>
          <Flipped flipId="loginBox">
            <Box
              w="100%"
              maxW="500px"
              m="auto"
              boxShadow={"0px 5px 12.1px 0px #758DE594"}
              borderRadius={"16px"}
              bg="white"
              className="animate__animated animate__fadeInUp"
              p={{ base: "20px", md: "30px" }}
            >
              {!flipLoginBox ? (
                // Login Form
                <Box>
                  <HStack mb="20px">
                    <Divider
                      orientation="horizontal"
                      borderColor="#758DE5"
                      flex="1"
                      ml={6}
                    />
                    <Text
                      color="#244C9B"
                      fontWeight="bold"
                      fontSize={{ base: "22px", md: "27px" }}
                      fontFamily="Franklin Gothic Medium"
                      textAlign="center"
                      px="4"
                    >
                      RA Head Login
                    </Text>
                    <Divider
                      orientation="horizontal"
                      borderColor="#758DE5"
                      flex="1"
                      mr={6}
                    />
                  </HStack>

                  <form onSubmit={handleSubmit}>
                    <FormControl isRequired gap={4}>
                      <FormLabel fontWeight="medium" color="#7A7A7A">
                        USER ID
                      </FormLabel>
                      <InputGroup>
                        <InputLeftElement
                          borderRadius="5px 0px 0px 5px"
                          color="white"
                          bg="#244C9B"
                        >
                          {user}
                        </InputLeftElement>
                        <Input
                          value={formdata.userId}
                          onChange={(e) =>
                            setFormdata({
                              ...formdata,
                              userId: e.target.value,
                            })
                          }
                          border="1px solid #5274ac"
                          bg="#f5f5f5"
                          _focus={{
                            border: "1px solid #5274ac",
                            boxShadow: "#5274ac 0px 3px 8px",
                            bg: "#fff",
                          }}
                          _hover={{ bg: "#fff" }}
                          type="text"
                          placeholder="Enter Your User ID"
                          borderRadius="md"
                        />
                      </InputGroup>

                      <FormLabel mt={4} fontWeight="medium" color="#7A7A7A">
                        PASSWORD
                      </FormLabel>
                      <InputGroup>
                        <InputLeftElement
                          borderRadius="5px 0px 0px 5px"
                          color="white"
                          bg="#244C9B"
                        >
                          {lock}
                        </InputLeftElement>
                        <InputRightElement
                          cursor="pointer"
                          onClick={() => setShow(!show)}
                        >
                          {show ? eye : closeye}
                        </InputRightElement>
                        <Input
                          value={formdata.password}
                          onChange={(e) =>
                            setFormdata({
                              ...formdata,
                              password: e.target.value,
                            })
                          }
                          border="1px solid #5474b4"
                          bg="#f5f5f5"
                          _focus={{
                            border: "1px solid #5274ac",
                            boxShadow: "#5274ac 0px 3px 8px",
                            bg: "#fff",
                          }}
                          _hover={{ bg: "#fff" }}
                          type={show ? "text" : "password"}
                          placeholder="Enter Your Password"
                          borderRadius="md"
                        />
                      </InputGroup>

                      <Text
                        m="5px 0px 15px 0px"
                        textAlign="right"
                        fontSize="14px"
                        fontWeight="semibold"
                        _hover={{
                          cursor: "pointer",
                          textDecoration: "underline",
                          color: "#758DE5",
                        }}
                        color="#244c9c"
                        onClick={() => navigate("/forgot_password")}
                      >
                        Forgot Password?
                      </Text>

                      <Button
                        type="submit"
                        w="50%"
                        color="white"
                        bg="#758DE5"
                        borderRadius="md"
                        _hover={{ bg: "#5f8aeb", transform: "scale(1.02)" }}
                        transition="0.2s"
                        fontSize={{ base: "14px", md: "16px" }}
                      >
                        Get OTP
                      </Button>
                    </FormControl>
                  </form>
                </Box>
              ) : (
                // OTP Verification Form
                <Box>
                  <HStack mb="20px">
                    <Divider
                      orientation="horizontal"
                      borderColor="#758DE5"
                      flex="1"
                      ml={6}
                    />
                    <Text
                      color="#244C9B"
                      fontWeight="bold"
                      fontSize={{ base: "22px", md: "27px" }}
                      fontFamily="Franklin Gothic Medium"
                      textAlign="center"
                      px="4"
                    >
                      Verify OTP
                    </Text>
                    <Divider
                      orientation="horizontal"
                      borderColor="#758DE5"
                      flex="1"
                      mr={6}
                    />
                  </HStack>

                  <Text
                    color="#787878"
                    fontSize={{ base: "14px", md: "16px" }}
                    mb="20px"
                    textAlign="center"
                  >
                    Enter the OTP sent to your registered email address.
                  </Text>

                  <HStack spacing={4} justify="center" mb="20px">
                    <PinInput
                      value={otp}
                      onChange={(value) => setOtp(value)}
                      size="lg"
                      type="alphanumeric"
                      colorScheme="blue"
                    >
                      {Array(6)
                        .fill(null)
                        .map((_, index) => (
                          <PinInputField
                            key={index}
                            borderColor="#244c9c"
                            bg="#ffffff"
                            borderRadius="md"
                            boxShadow="sm"
                            _focus={{
                              borderColor: "#3e94d8",
                              boxShadow: "0 0 0 1px #3e94d8",
                            }}
                          />
                        ))}
                    </PinInput>
                  </HStack>

                  <HStack justify="space-between" mt="20px">
                    <Text
                      fontSize="14px"
                      color="#787878"
                      cursor="pointer"
                      onClick={resendOtp}
                      _hover={{
                        textDecoration: "underline",
                        color: "#244c9c",
                      }}
                    >
                      Resend OTP {timer > 0 ? `(${timer}s)` : ""}
                    </Text>
                    <Button
                      onClick={handleOtpVerification}
                      color="white"
                      bg="#244c9c"
                      borderRadius="md"
                      _hover={{ bg: "#3e94d8", transform: "scale(1.02)" }}
                      transition="0.2s"
                      px="8"
                      fontSize={{ base: "14px", md: "16px" }}
                    >
                      Verify
                    </Button>
                  </HStack>
                </Box>
              )}
            </Box>
          </Flipped>
        </Flipper>
      </Box>
    </Flex>
  </Box>
  );
}
