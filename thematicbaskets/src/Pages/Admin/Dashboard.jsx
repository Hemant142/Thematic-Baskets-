import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Admin/Navbar"
import NoData from "../../Images/NoData.avif"
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  Text,
  SimpleGrid,
  Image,
  Badge,
  Flex,
  Divider,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useToast,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { fetchBasket, getSuccessAction } from "../../Redux/basketReducer/action";
import { Link, useLocation } from "react-router-dom";

export default function Dashboard() {
  let token = Cookies.get("login_token_admin");
  let { baskets, loading } = useSelector((store) => store.basketReducer);
  const toast = useToast();
  const [filter, setFilter] = useState("");
  const [expired, setExpired] = useState("");
  const [filterData, setFilterData] = useState([]);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchBasket(token))
      .then((res) => {

        dispatch(getSuccessAction(res.data.response.data.reverse()));
        setFilterData(res.data.response.data);
      })
      .catch((error) =>{

        if (error.response.data.detail !== "Basket does not exist") {
          toast({
            title: `${error.message} error`,
            position: "bottom",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        }
      }
      
      );
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    const currentHours = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
  
    if (filter === "EXPIRED") {
      const expiredData = baskets.filter((ele) => {
        const expiryDate = new Date(ele.expiryDate + "T15:30:00");  // Assuming the expiry date is in "YYYY-MM-DD" format

        // Check if the basket is expired
        const isExpired = !ele.isActive || 
                          (expiryDate <= currentDate) || 
                          (expiryDate.toDateString() === currentDate.toDateString() && 
                          (currentHours > 15 || (currentHours === 15 && currentMinutes >= 30)));
    
        return isExpired;
      });
    
 
      setFilterData(expiredData);
    
    } else if (filter !== "") {
      const filteredData = baskets.filter((ele) => {
        const expiryDate = new Date(ele.expiryDate);
        const isActiveAndNotExpired = ele.isActive &&
          (expiryDate >= currentDate || (
            expiryDate.getDate() === currentDate.getDate() &&
            expiryDate.getMonth() === currentDate.getMonth() &&
            expiryDate.getFullYear() === currentDate.getFullYear() &&
            (currentHours < 15 || (currentHours === 15 && currentMinutes < 30))
          ));
  
        return ele.rahStatus === filter && isActiveAndNotExpired;
      });
      setFilterData(filteredData);
    } else {
      setFilterData(baskets);
    }
  }, [filter, baskets]);
  

  const getStatusStyles = (basket) => {
    if (isExpired(basket)) {
      return {
        borderColor: "purple.500",
        boxShadow: "0 0 10px 2px purple",
      };
    }

    switch (basket.rahStatus) {
      case "APPROVED":
        return {
          borderColor: "green.500",
          boxShadow: "0 0 10px 2px green",
        };
      case "REJECTED":
        return {
          borderColor: "red.500",
          boxShadow: "0 0 10px 2px red",
        };
      case "PENDING":
      default:
        return {
          borderColor: "gray.500",
          boxShadow: "0 0 10px 2px gray",
        };
    }
  };


  const truncateDescription = (description, length = 40) => {
    if (description.length <= length) {
      return description;
    }
    return `${description.substring(0, length)}...`;
  };
  const truncateHeading = (description, length = 20) => {
    if (description.length <= length) {
      return description;
    }
    return `${description.substring(0, length)}...`;
  };

  function isExpired(basket) {
    // Function to get the current date and time in the "Asia/Kolkata" timezone
    const getCurrentKolkataTime = () => {
      return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    };
  
    // Get the current datetime in the "Asia/Kolkata" timezone
    const currentDate = getCurrentKolkataTime();
    const currentHours = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
  
    // Parse the expiry date and add the time "15:30:00"
    const expiryDate = new Date(basket.expiryDate + "T15:30:00");  // Assuming the expiry date is in "YYYY-MM-DD" format
  
    // Check if the basket should be expired
    const isExpired =
      !basket.isActive ||
      (expiryDate <= currentDate) ||
      (expiryDate.toDateString() === currentDate.toDateString() && 
       (currentHours > 15 || (currentHours === 15 && currentMinutes >= 30)));
  
    return isExpired;
  }
  return (
    <Box>
      <Navbar />

      <Tabs
        position="relative"
        variant="unstyled"
        mt="10px"
        borderBottomWidth="1px"
        borderBottomColor="gray.200"
      >
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
            <Box p={5}>
              {baskets.length > 0 ? (
                <Stack direction="row" marginBottom={10} spacing={4}>
                  <Tabs variant="soft-rounded" colorScheme="teal">
                    <TabList>
                      <Tab
                        onClick={() => setFilter("")}
                        _selected={{ bg: "orange.300", color: "white" }}
                        _hover={{ bg: "orange.200" }}
                      >
                        <Heading as="h4" size="md">
                          ALL
                        </Heading>
                      </Tab>
                      <Tab
                        onClick={() => setFilter("PENDING")}
                        _selected={{ bg: "gray.300", color: "white" }}
                        _hover={{ bg: "gray.200" }}
                      >
                        <Heading as="h4" size="md">
                          PENDING
                        </Heading>
                      </Tab>
                      <Tab
                        onClick={() => setFilter("APPROVED")}
                        _selected={{ bg: "green.300", color: "white" }}
                        _hover={{ bg: "green.200" }}
                      >
                        <Heading as="h4" size="md">
                          APPROVED
                        </Heading>
                      </Tab>
                      <Tab
                        onClick={() => setFilter("REJECTED")}
                        _selected={{ bg: "red.300", color: "white" }}
                        _hover={{ bg: "red.200" }}
                      >
                        <Heading as="h4" size="md">
                          REJECTED
                        </Heading>
                      </Tab>
                      <Tab
                        onClick={() => setFilter("EXPIRED")}
                        _selected={{ bg: "purple.300", color: "white" }}
                        _hover={{ bg: "purple.200" }}
                      >
                        <Heading as="h4" size="md">
                          EXPIRED
                        </Heading>
                      </Tab>
                    </TabList>
                  </Tabs>
                </Stack>
              ) : (
                ""
              )}

              {filterData.length>0?(

              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
                {filterData.map((basket) => (
                  <Link key={basket._id} to={`/admin/basket-details/${basket._id}`}>
                    <Card
                      {...getStatusStyles(basket)}
                      borderRadius="lg"
                      overflow="hidden"
                      transition="transform 0.2s"
                      _hover={{ transform: "scale(1.05)" }}
                    >
                      <CardHeader p={4} bg="gray.50">
                        <Flex align="center">
                          <Image
                            src={basket.basketSymbolUrl}
                            alt={basket.title}
                            boxSize="50px"
                            mr={4}
                            borderRadius="full"
                            border="2px solid"
                            borderColor="gray.200"
                          />
                          <Box>
                            <Heading size="md">
                              {truncateHeading(basket.title)}
                            </Heading>
                            <Badge
                              colorScheme={
                                isExpired(basket)
                                  ? "purple"
                                  : basket.rahStatus === "APPROVED"
                                  ? "green"
                                  : basket.rahStatus === "REJECTED"
                                  ? "red"
                                  : "gray"
                              }
                            >
                              {basket.rahStatus}
                            </Badge>

                            {/* <Badge
                              colorScheme={
                                !basket.isActive ||
                                new Date(basket.expiryDate) <= new Date()
                                  ? "purple"
                                  : basket.rahStatus === "APPROVED"
                                  ? "green"
                                  : basket.rahStatus === "REJECTED"
                                  ? "red"
                                  : "gray"
                              }
                            >
                              {basket.rahStatus}
                            </Badge> */}
                          </Box>
                        </Flex>
                      </CardHeader>
                      <Divider />
                      <CardBody p={4}>
                        <Stack spacing={3}>
                          <Box>
                            <Text fontWeight="bold" fontSize="lg">
                              Description
                            </Text>
                            <Text pt="2" fontSize="sm">
                              {truncateDescription(basket.description)}
                            </Text>
                          </Box>
                          {/* <Box>
                            <Flex justify="space-between">
                              <Text fontWeight="bold" fontSize="lg">
                                Minimum Fund Required
                              </Text>
                              <Text pt="2" fontSize="sm">
                                ₹{basket.fundRequired || "N/A"}
                              </Text>
                            </Flex>
                          </Box> */}
                          <Box>
                            <Flex justify="space-between">
                              <Text fontWeight="bold" fontSize="lg">
                                Clients Subscribed
                              </Text>
                              <Text pt="2" fontSize="sm">
                                {basket.clientsSubscribed || "N/A"}
                              </Text>
                            </Flex>
                          </Box>
                          <Box>
                            <Flex justify="space-between">
                              <Text fontWeight="bold" fontSize="lg">
                                Creation Date
                              </Text>
                              <Text pt="2" fontSize="sm">
                                {basket.creationDate}
                              </Text>
                            </Flex>
                          </Box>
                          <Box>
                            <Flex justify="space-between">
                              <Text fontWeight="bold" fontSize="lg">
                                Expiry Date
                              </Text>
                              <Text pt="2" fontSize="sm">
                                {basket.expiryDate}
                              </Text>
                            </Flex>
                          </Box>
                          <Box>
                            <Flex justify="space-between">
                              <Text fontWeight="bold" fontSize="lg">
                                Exchange Type
                              </Text>
                              <Text pt="2" fontSize="sm">
                                {basket.exchangeType}
                              </Text>
                            </Flex>
                          </Box>
                        </Stack>
                      </CardBody>
                    </Card>
                  </Link>
                ))}
              </SimpleGrid>
              ):(
                <Box
  display="flex"
  alignItems="center"
  justifyContent="center"
  width="100%"
  height="100%"
>
  <Image
    src={NoData}
    alt="No Data"
    boxSize={{ base: "90%", md: "70%", lg: "50%" }}
    objectFit="contain"
    borderRadius="lg"
    shadow="lg"
  />
</Box>
              )}
            </Box>
          </TabPanel>

          <TabPanel>
            <Box p={5}>
              {/* <Heading size="md" mb={4}>
                Create a New Basket
              </Heading> */}
              {/* Add your form or content for creating a new basket here */}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
