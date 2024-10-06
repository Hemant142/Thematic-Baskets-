import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Admin/Navbar"
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Heading,
  Stack,
  useToast,
  Text,
  Switch,
} from "@chakra-ui/react";
import Cookies from "cookies-js";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getResearchAnalysts,
  postResearchAnalyst,
  postResearchAnalystAndDealer,
  postResearchAnalystDealer,
  updateStatusResearchAnalyst,
} from "../../Redux/raDealerReducer/action";

export default function CreateResearchAnalyst() {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [toggle, setToggle] = useState(false);
  const itemsPerPage = 10;
  const toast = useToast();
  const dispatch = useDispatch();
  let raList = useSelector((store) => store.raDealerReducer.researchAnalyst);
  let token = Cookies.get("login_token_admin");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  // const [raList, setRAList] = useState(data);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    dispatch(getResearchAnalysts(token));
  }, [toggle]);

  const totalPages = Math.ceil(raList.length / itemsPerPage);

  const currentItems = raList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.phone) newErrors.phone = "Phone number is required";
    if (!form.password) newErrors.password = "Password is required";
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddRA = () => {
    if (!validateForm()) {
      return;
    }
    let sendData = {
      // id: raList.length + 1,
      profile: {
        emailId: form.email,
        number: form.phone,
      },
      passWord: form.password,
      roll: "research analyst",
      userName: form.name,
    };
    dispatch(postResearchAnalystAndDealer(sendData, token))
      .then((res) => {
     
        if (res.status == "success") {
          toast({
            title: "RA added.",
            description: "The Research Analyst has been added successfully.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });

          setForm({
            name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
          });
          setErrors({});
        }

        if (res.status == "error") {
          toast({
            title: "RA warring.",
            description: res.message,
            status: res.staus,
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        toast({
          title: `${error.response.data.message} error`,
          position: "bottom",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  };

  const toggleStatus = (id, isActive) => {
 
    if (isActive == true) {
      let status = "False";

      dispatch(updateStatusResearchAnalyst(id, status, token))
        .then((res) => {

        
          if (res.status == "success") {
            setToggle(!toggle);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      let status = "True";
      dispatch(updateStatusResearchAnalyst(id, status, token))
        .then((res) => {
          if (res.status == "success") {
            setToggle(!toggle);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <Box bg="gray.100" minHeight="100vh">
      <Navbar />

      <Tabs variant="unstyled" mt="10px" borderBottomColor="gray.200">
        <TabList display="flex">
          {/* <===================================== Basket List====================> */}
          <Tab
            as={Link}
            to="/admin/dashboard"
            fontWeight="bold"
            color={location.pathname === "/admin/dashboard" ? "#244c9c" : "gray.500"}
            borderBottom={location.pathname === "/admin/dashboard" && "2px solid"}
            borderColor={location.pathname === "/admin/dashboard" && "#244c9c"}
            pb={2}
            _hover={{ color: "#244c9c" }}
            _focus={{ outline: "none" }}
          >
            Basket List
          </Tab>
          {/* <===================================== Algo List List====================> */}
          <Tab
            as={Link}
            to="/admin/algolist"
            fontWeight="bold"
            color={location.pathname === "/admin/algolist" ? "#244c9c" : "gray.500"}
            borderBottom={location.pathname === "/admin/algolist" && "2px solid"}
            borderColor={location.pathname === "/admin/algolist" && "#244c9c"}
            pb={2}
            _hover={{ color: "#244c9c" }}
            _focus={{ outline: "none" }}
          >
            Algo List
          </Tab>
          {/* <===================================== Signal List====================> */}
          <Tab
            as={Link}
            to="/admin/signallist"
            fontWeight="bold"
            color={location.pathname === "/admin/signallist" ? "#244c9c" : "gray.500"}
            borderBottom={location.pathname === "/admin/signallist" && "2px solid"}
            borderColor={location.pathname === "/admin/signallist" && "#244c9c"}
            pb={2}
            _hover={{ color: "#244c9c" }}
            _focus={{ outline: "none" }}
          >
            Signal List
          </Tab>

          {/* <===================================== Add RA & RA List====================> */}
          <Tab
            as={Link}
            to="/admin/addRA"
            fontWeight="bold"
            color={location.pathname === "/admin/addRA" ? "#244c9c" : "gray.500"}
            borderBottom={location.pathname === "/admin/addRA" && "2px solid"}
            borderColor={location.pathname === "/admin/addRA" && "#244c9c"}
            pb={2}
            _hover={{ color: "#244c9c" }}
            _focus={{ outline: "none" }}
          >
            Add RA & RA List
          </Tab>

          {/* <=======================Client List and Dealer List=====================> */}
          <Tab
            as={Link}
            to="/admin/clientsList"
            fontWeight="bold"
            color={
              location.pathname === "/admin/clientsList" ? "#244c9c" : "gray.500"
            }
            borderBottom={location.pathname === "/admin/clientsList" && "2px solid"}
            borderColor={location.pathname === "/admin/clientsList" && "#244c9c"}
            pb={2}
            _hover={{ color: "#244c9c" }}
            _focus={{ outline: "none" }}
          >
            Clients List & Details
          </Tab>

          {/* <======================= Add Dealer and Dealer List =====================> */}
          <Tab
            as={Link}
            to="/admin/addDealer"
            fontWeight="bold"
            color={location.pathname === "/admin/addDealer" ? "#244c9c" : "gray.500"}
            borderBottom={location.pathname === "/admin/addDealer" && "2px solid"}
            borderColor={location.pathname === "/admin/addDealer" && "#244c9c"}
            pb={2}
            _hover={{ color: "#244c9c" }}
            _focus={{ outline: "none" }}
          >
            Add Dealer & Dealer List
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box
              display="flex"
              flexDirection={{ base: "column", md: "row" }}
              justifyContent="space-between"
              p={5}
              gap={5}
            >
              <Box flex="1" bg="white" p={6} borderRadius="md" boxShadow="md">
                <Heading as="h3" size="lg" mb={4}>
                  Add Research Analyst
                </Heading>
                <Stack
                  spacing={4}
                  as="form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddRA();
                  }}
                >
                  <FormControl id="name" isRequired isInvalid={errors.name}>
                    <FormLabel>RA Name</FormLabel>
                    <Input
                      type="text"
                      placeholder="Enter RA Name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                    {errors.name && (
                      <Text color="red.500" fontSize="sm">
                        {errors.name}
                      </Text>
                    )}
                  </FormControl>
                  <FormControl id="email" isRequired isInvalid={errors.email}>
                    <FormLabel>RA Email</FormLabel>
                    <Input
                      type="email"
                      placeholder="Enter RA Email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                    {errors.email && (
                      <Text color="red.500" fontSize="sm">
                        {errors.email}
                      </Text>
                    )}
                  </FormControl>
                  <FormControl id="phone" isRequired isInvalid={errors.phone}>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      type="tel"
                      placeholder="Enter Phone Number"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                    {errors.phone && (
                      <Text color="red.500" fontSize="sm">
                        {errors.phone}
                      </Text>
                    )}
                  </FormControl>
                  <FormControl
                    id="password"
                    isRequired
                    isInvalid={errors.password}
                  >
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Enter Password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                    {errors.password && (
                      <Text color="red.500" fontSize="sm">
                        {errors.password}
                      </Text>
                    )}
                  </FormControl>
                  <FormControl
                    id="confirmPassword"
                    isRequired
                    isInvalid={errors.confirmPassword}
                  >
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    {errors.confirmPassword && (
                      <Text color="red.500" fontSize="sm">
                        {errors.confirmPassword}
                      </Text>
                    )}
                  </FormControl>
                  <Button type="submit" colorScheme="blue">
                    Add RA
                  </Button>
                </Stack>
              </Box>

              <Box flex="1" bg="white" p={6} borderRadius="md" boxShadow="md">
                <Heading as="h3" size="lg" mb={4}>
                  Research Analysts List
                </Heading>
                <Table variant="striped" colorScheme="gray">
                  <Thead>
                    <Tr>
                      <Th>#</Th>
                      <Th  textTransform="capitalize">Username</Th>
                      <Th  textTransform="capitalize">Phone Number</Th>
                      <Th  textTransform="capitalize">Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {currentItems.map((ra, index) => (
                      <Tr key={ra._id}>
                        <Td>{index + 1}</Td>
                        <Td>{ra.userName}</Td>
                        <Td>{ra.profile.number}</Td>
                        <Td>
                          <Switch
                            size="md"
                            isChecked={ra.isActive}
                            onChange={() => toggleStatus(ra._id, ra.isActive)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                {totalPages>1?
                <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={4}
              >
                <Button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  colorScheme={currentPage === 1 ? "gray" : "blue"}
                >
                  Previous
                </Button>
                <Box>
                  Page {currentPage} of {totalPages}
                </Box>
                <Button
                  onClick={handleNext}
                  colorScheme={currentPage === totalPages ? "gray" : "blue"}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </Box>
                :""}
                
              </Box>
            </Box>
          </TabPanel>
          <TabPanel></TabPanel>
          <TabPanel></TabPanel>
          <TabPanel>
            <Box
              display="flex"
              flexDirection={{ base: "column", md: "row" }}
              justifyContent="space-between"
              p={5}
              gap={5}
            >
              <Box flex="1" bg="white" p={6} borderRadius="md" boxShadow="md">
                <Heading as="h3" size="lg" mb={4}>
                  Add Research Analyst
                </Heading>
                <Stack
                  spacing={4}
                  as="form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddRA();
                  }}
                >
                  <FormControl id="name" isRequired isInvalid={errors.name}>
                    <FormLabel>RA Name</FormLabel>
                    <Input
                      type="text"
                      placeholder="Enter RA Name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                    {errors.name && (
                      <Text color="red.500" fontSize="sm">
                        {errors.name}
                      </Text>
                    )}
                  </FormControl>
                  <FormControl id="email" isRequired isInvalid={errors.email}>
                    <FormLabel>RA Email</FormLabel>
                    <Input
                      type="email"
                      placeholder="Enter RA Email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                    {errors.email && (
                      <Text color="red.500" fontSize="sm">
                        {errors.email}
                      </Text>
                    )}
                  </FormControl>
                  <FormControl id="phone" isRequired isInvalid={errors.phone}>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      type="tel"
                      placeholder="Enter Phone Number"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                    {errors.phone && (
                      <Text color="red.500" fontSize="sm">
                        {errors.phone}
                      </Text>
                    )}
                  </FormControl>
                  <FormControl
                    id="password"
                    isRequired
                    isInvalid={errors.password}
                  >
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Enter Password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                    {errors.password && (
                      <Text color="red.500" fontSize="sm">
                        {errors.password}
                      </Text>
                    )}
                  </FormControl>
                  <FormControl
                    id="confirmPassword"
                    isRequired
                    isInvalid={errors.confirmPassword}
                  >
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    {errors.confirmPassword && (
                      <Text color="red.500" fontSize="sm">
                        {errors.confirmPassword}
                      </Text>
                    )}
                  </FormControl>
                  <Button type="submit" colorScheme="blue">
                    Add RA
                  </Button>
                </Stack>
              </Box>

              <Box flex="1" bg="white" p={6} borderRadius="md" boxShadow="md">
                <Heading as="h3" size="lg" mb={4}>
                  Research Analysts List
                </Heading>
                <Table variant="striped" colorScheme="gray">
                  <Thead>
                    <Tr>
                      <Th>#</Th>
                      <Th  textTransform="capitalize">Username</Th>
                      <Th  textTransform="capitalize">Phone Number</Th>
                      <Th  textTransform="capitalize">Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {currentItems.map((ra, index) => (
                      <Tr key={ra._id}>
                        <Td>{index + 1}</Td>
                        <Td>{ra.userName}</Td>
                        <Td>{ra.profile.number}</Td>
                        <Td>
                          <Switch
                            size="md"
                            isChecked={ra.isActive}
                            onChange={() => toggleStatus(ra._id, ra.isActive)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                {totalPages>1?
                <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={4}
              >
                <Button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  colorScheme={currentPage === 1 ? "gray" : "blue"}
                >
                  Previous
                </Button>
                <Box>
                  Page {currentPage} of {totalPages}
                </Box>
                <Button
                  onClick={handleNext}
                  colorScheme={currentPage === totalPages ? "gray" : "blue"}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </Box>
                :""}
                
              </Box>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
