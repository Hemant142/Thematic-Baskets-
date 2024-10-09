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
  Tabs,
  Heading,
  Stack,
  useToast,
  Text,
  Switch,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getDealers,
  postResearchAnalystAndDealer,
  postResearchAnalystDealer,
  updateStatus,
} from "../../Redux/raDealerReducer/action";
import Cookies from "cookies-js";

export default function AddDealerAndDealerList() {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [toggle, setToggle] = useState(false);
  const itemsPerPage = 10;
  const toast = useToast();
  const dispatch = useDispatch();
  let token = Cookies.get("login_token_admin");
  let dealerList = useSelector((store) => store.raDealerReducer.dealer);

  const [form, setForm] = useState({
    dealerId: "",
    dealerName: "",
    dealerEmail: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getDealers(token));
  }, [toggle]);

  const totalPages = Math.ceil(dealerList.length / itemsPerPage);
  const currentItems = dealerList.slice(
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
    if (!form.dealerId) newErrors.dealerId = "Dealer ID is required";
    if (!form.dealerName) newErrors.dealerName = "Dealer Name is required";
    if (!form.dealerEmail) newErrors.dealerEmail = "Dealer Email is required";
    if (!form.phone) newErrors.phone = "Phone number is required";
    if (!form.password) newErrors.password = "Password is required";
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddDealer = () => {
    if (!validateForm()) {
      return;
    }
    let sendData = {
      profile: {
        emailId: form.dealerEmail,
        number: form.phone,
      },
      passWord: form.password,
      roll: "dealer",
      userName: form.dealerName,
      centrumDealerId: form.dealerId,
    };


    dispatch(postResearchAnalystAndDealer(sendData, token))
      .then((res) => {
      
        if (res.status == "success") {
          setToggle(!toggle);
          toast({
            title: "Dealer added.",
            description: "The Dealer has been added successfully.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });

          setForm({
            dealerId: "",
            dealerName: "",
            dealerEmail: "",
            phone: "",
            password: "",
            confirmPassword: "",
          });
          setErrors({});
        }

        if (res.status == "error") {
          toast({
            title: "Dealer warring.",
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
      let endpoint="dealer-status"
      dispatch(updateStatus(id, status, token,endpoint))
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
      dispatch(updateStatus(id, status, token))
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
        <TabList display="flex" flexWrap="wrap">
       
         <Tab
            as={Link}
            to="/admin/dashboard"
            fontWeight="bold"
            color={location.pathname === "/admin/dashboard" ? "#244c9c" : "gray.500"}
            borderBottom={location.pathname === "/admin/dashboard" && "2px solid"}
            borderColor={location.pathname === "/admin/dashboard" && "#244c9c"}
            pb={2}
            px={4}
            mb={2}
            _hover={{ color: "#244c9c" }}
            _focus={{ outline: "none" }}
          >
            Basket List
          </Tab>

          <Tab
            as={Link}
            to="/admin/algolist"
            fontWeight="bold"
            color={location.pathname === "/admin/algolist" ? "#244c9c" : "gray.500"}
            borderBottom={location.pathname === "/admin/algolist" && "2px solid"}
            borderColor={location.pathname === "/admin/algolist" && "#244c9c"}
            pb={2}
            px={4}
            mb={2}
            _hover={{ color: "#244c9c" }}
            _focus={{ outline: "none" }}
          >
            Algo List
          </Tab>
          <Tab
            as={Link}
            to="/admin/signallist"
            fontWeight="bold"
            color={location.pathname === "/admin/signallist" ? "#244c9c" : "gray.500"}
            borderBottom={location.pathname === "/admin/signallist" && "2px solid"}
            borderColor={location.pathname === "/admin/signallist" && "#244c9c"}
            pb={2}
            px={4}
            mb={2}
            _hover={{ color: "#244c9c" }}
            _focus={{ outline: "none" }}
          >
            Signal List
          </Tab>
          <Tab
            as={Link}
            to="/admin/addRA"
            fontWeight="bold"
            color={location.pathname === "/admin/addRA" ? "#244c9c" : "gray.500"}
            borderBottom={location.pathname === "/admin/addRA" && "2px solid"}
            borderColor={location.pathname === "/admin/addRA" && "#244c9c"}
            pb={2}
            px={4}
            mb={2}
            _hover={{ color: "#244c9c" }}
            _focus={{ outline: "none" }}
          >
            Add RA & RA List
          </Tab>
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
            px={4}
            mb={2}
            _hover={{ color: "#244c9c" }}
            _focus={{ outline: "none" }}
          >
            Clients List & Details
          </Tab>
          <Tab
            as={Link}
            to="/admin/addDealer"
            fontWeight="bold"
            color={location.pathname === "/admin/addDealer" ? "#244c9c" : "gray.500"}
            borderBottom={location.pathname === "/admin/addDealer" && "2px solid"}
            borderColor={location.pathname === "/admin/addDealer" && "#244c9c"}
            pb={2}
            px={4}
            mb={2}
            _hover={{ color: "#244c9c" }}
            _focus={{ outline: "none" }}
          >
            Add Dealer & Dealer List
          </Tab>
        </TabList>
      </Tabs>

      <Box
        display="flex"
        flexDirection={{ base: "column", md: "row" }}
        p={4}
        pt={2}
      >
        <Box
          flex="1"
          bg="white"
          p={6}
          borderRadius="md"
          boxShadow="md"
          mb={{ base: 6, md: 0 }}
          mr={{ md: 6 }}
        >
          <Heading size="lg" mb={6} color="#244c9c">
            Add Dealer
          </Heading>

          <Stack
            spacing={4}
            as="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddDealer();
            }}
          >
            <FormControl id="dealerId" isRequired isInvalid={errors.dealerId}>
              <FormLabel htmlFor="dealerId">Dealer ID</FormLabel>
              <Input
                id="dealerId"
                type="text"
                value={form.dealerId}
                onChange={handleChange}
                required
              />
              {errors.name && (
                <Text color="red.500" fontSize="sm">
                  {errors.name}
                </Text>
              )}
            </FormControl>

            <FormControl
              id="dealerName"
              isRequired
              isInvalid={errors.dealerName}
            >
              <FormLabel htmlFor="dealerName">Dealer name</FormLabel>
              <Input
                id="dealerName"
                type="text"
                value={form.dealerName}
                onChange={handleChange}
                required
              />
              {errors.name && (
                <Text color="red.500" fontSize="sm">
                  {errors.name}
                </Text>
              )}
            </FormControl>

            <FormControl
              id="dealerEmail"
              isRequired
              isInvalid={errors.dealerEmail}
            >
              <FormLabel>Dealer Email</FormLabel>
              <Input
                id="dealerEmail"
                type="email"
                value={form.dealerEmail}
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
                id="phone"
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

            <FormControl id="password" isRequired isInvalid={errors.password}>
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
              Add Dealer
            </Button>
          </Stack>
        </Box>

        <Box flex="1" bg="white" p={6} borderRadius="md" boxShadow="md">
          <Heading size="lg" mb={6} color="#244c9c">
            Dealer List
          </Heading>
          <Table variant="striped" colorScheme="gray">
            <Thead>
              <Tr>
                <Th  textTransform="capitalize">ID</Th>
                <Th textTransform="capitalize">Name</Th>
                {/* <Th>Email</Th> */}
                <Th  textTransform="capitalize">Phone</Th>
                <Th textTransform="capitalize">Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentItems.map((dealer) => (
                <Tr key={dealer._id}>
                  <Td>{dealer.centrumDealerId}</Td>
                  <Td>{dealer.userName}</Td>
                  {/* <Td>{dealer.profile.emailId}</Td> */}
                  <Td>{dealer.profile.number}</Td>
                  <Td>
                    <Switch
                      isChecked={dealer.isActive}
                      onChange={() => toggleStatus(dealer._id, dealer.isActive)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
{totalPages>1?(

<Box display="flex" justifyContent="space-between" mt={4}>
<Button onClick={handlePrevious}
 colorScheme={currentPage === 1 ? "gray" : "blue"}
disabled={currentPage === 1}>
  Previous
</Button>
<Text>
  Page {currentPage} of {totalPages}
</Text>
<Button onClick={handleNext}
 colorScheme={currentPage === totalPages ? "gray" : "blue"}
disabled={currentPage === totalPages}>
  Next
</Button>
</Box>
):""}
        
        </Box>
      </Box>
    </Box>
  );
}
