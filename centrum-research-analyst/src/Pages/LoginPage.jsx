import React, { useState } from "react";
import {
  Flex,
  Box,
  Text,
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  Button,
  Select,
  useToast,
  Image,
  Card,
  CardBody,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import "animate.css";
import Navbar from "../Components/Navbar";
import { useDispatch } from "react-redux";
import { userlogin } from "../Redux/authReducer/action";
import Cookies from "js-cookie";
import { USER_LOGIN_SUCCESS } from "../Redux/actionTypes";

import Login from "../Images/login.png";
export default function LoginPage() {
  const lock = <FontAwesomeIcon size="lg" icon={faLock} />;
  const eye = <FontAwesomeIcon size="lg" icon={faEye} />;
  const closeye = <FontAwesomeIcon size="lg" icon={faEyeSlash} />;
  const user = <FontAwesomeIcon size="lg" icon={faUserCircle} />;
  const [show, setShow] = useState(false);
  const [formdata, setFormdata] = useState({
    userType: "research analyst",
    username: "",
    password: "",
  });
  const token = Cookies.get("login_token_ra");
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(userlogin(formdata))
      .then((res) => {
      
        dispatch({ type: USER_LOGIN_SUCCESS });

        if (res.data.status === "success") {
          Cookies.set("login_token_ra", `${res.data.response.access_token}`);
          Cookies.set("username_ra", formdata.username);

          toast({
            title: `${res.data.response.message}`,
            position: "bottom",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
          toast({
            title: `Welcome ${formdata.username}`,
            position: "bottom",
            status: "success",
            duration: 2000,
            isClosable: true,
          });

          setTimeout(() => {
            navigate("/dashboard");
          }, 1000);
        }
      })
      .catch((error) => {
     
        if (error.response.data.detail == "Invalid credentials") {
          toast({
            title: `Invalid User Name or Password`,
            position: "bottom",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        } else {
          toast({
            title: `${error.response.data.detail}`,
            position: "bottom",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        }
      });
  };

  return (
    <Box>
      <Box>
        <Navbar />
      </Box>
      <Flex
        justifyContent="space-between"
        w="100%"
        direction={{ base: "column", md: "row" }}
      >
        <Box
          w={{ base: "100%", md: "50%" }}
          p={{ base: "20px", md: "50px" }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Card>
            <CardBody>
              <Image src={Login} alt="Login" borderRadius="lg" />
            </CardBody>
          </Card>
        </Box>

        <Box w={{ base: "100%", md: "50%" }} p={{ base: "20px", md: "50px" }}>
          <Box
            w="100%"
            maxW="400px"
            m="auto"
            className="animate__animated animate__fadeInUp"
          >
            {/* <Image w="50%" src={""} alt="Logo" m="auto" /> */}
            <Text
              mt="25px"
              color="#244c9c"
              fontWeight="bold"
              fontSize="27px"
              fontFamily="Franklin Gothic Medium"
            >
              Log in
            </Text>

            <br />
            <form onSubmit={handleSubmit}>
              <FormControl isRequired>
                {/* <FormLabel>USER TYPE</FormLabel>
              <Select
                value={formdata.userType}
                onChange={(e) =>
                  setFormdata({ ...formdata, userType: e.target.value })
                }
                placeholder="Select user type"
                border="1px solid #5274ac"
                bg="#f5f5f5"
                _focus={{
                  border: "1px solid #5274ac",
                  boxShadow: "#5274ac 0px 3px 8px",
                  bg: "#fff",
                }}
                _hover={{ bg: "#fff" }}
              >
                <option value="Admin">Admin</option>
                <option value="Research Analyst">Research Analyst</option>
                <option value="Research Head">Research Head</option>
              </Select> */}
                <br />

                <FormLabel>USERNAME</FormLabel>
                <InputGroup>
                  <InputLeftElement
                    borderRadius="5px 0px 0px 5px"
                    color="white"
                    bg="#244c9c"
                  >
                    {user}
                  </InputLeftElement>
                  <Input
                    value={formdata.username}
                    onChange={(e) =>
                      setFormdata({ ...formdata, username: e.target.value })
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
                    placeholder="Enter Your Username"
                    required
                  />
                </InputGroup>
                <br />

                <FormLabel>PASSWORD</FormLabel>
                <InputGroup>
                  <InputLeftElement
                    borderRadius="5px 0px 0px 5px"
                    color="white"
                    bg="#244c9c"
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
                      setFormdata({ ...formdata, password: e.target.value })
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
                    required
                  />
                </InputGroup>

                <Text
                  m="5px 0px 15px 0px"
                  textAlign="right"
                  fontSize="14px"
                  fontWeight="semibold"
                  _hover={{ cursor: "pointer", textDecoration: "underline" }}
                  color="#244c9c"
                  onClick={() => navigate("/forgot_password")}
                >
                  {/* Forgot Password? */}
                </Text>

                <Button
                  type="submit"
                  w="100%"
                  color="white"
                  bg="#244c9c"
                  _hover={{ bg: "#244c9c" }}
                >
                  Log in
                </Button>

                {/* <Text textAlign="center" mt="10px">
                New User?{" "}
                <span
                  onClick={() => navigate("/signup")}
                  style={{
                    color: "#244c9c",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Create Account
                </span>
              </Text> */}
              </FormControl>
            </form>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
