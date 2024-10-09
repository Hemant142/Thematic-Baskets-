import React, { useEffect, useState } from "react";
import Navbar from "../../Components/RasearchAnalyst-Head/Navbar"
import NoData from "../../Images/NoData.avif";
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
  Button,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { fetchBasket, getSuccessAction } from "../../Redux/basketReducer/action";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function RaHeadDashboard() {
  const [filter, setFilter] = useState("");
  const [filterData, setFilterData] = useState([]);
  let token = Cookies.get("login_token_rh");
  let data = useSelector((store) => store.basketReducer);
let {baskets}=data
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    dispatch(fetchBasket(token))
      .then((res) => {
        console.log(res,"fetchBasket")
        if (res.data.detail === "Token has expired") {
          Cookies.set("login_token_rh", "");
          Cookies.set("username_rh", "");
          
        }
        if(res.data.status==="success"){
          dispatch(getSuccessAction(res.data.data.basketList.reverse()));
          setFilterData(res.data.data.basketList);
        }
        if (
          res.data.message == "You do not Have permission to access the data"
        ) {
          Cookies.set("login_token_rh", "");
          Cookies.set("username_rh", "");
          navigate("rahead/");
        }
        
      })
      .catch((error) => {
        if (error.response.data.detail !== "Basket does not exist") {
          toast({
            title: `${error.message} error`,
            position: "bottom",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        }
      });
  }, []);

  // useEffect(() => {
  //   const currentDate = new Date();
  //   const currentHours = currentDate.getHours();
  //   const currentMinutes = currentDate.getMinutes();

  //   if (filter === "EXPIRED") {
  //     const expiredData = data.baskets.filter((ele) => {
  //       const expiryDate = new Date(ele.expiryDate + "T15:30:00"); // Assuming the expiry date is in "YYYY-MM-DD" format

  //       // Check if the basket is expired
  //       const isExpired =
  //         !ele.isActive ||
  //         expiryDate <= currentDate ||
  //         (expiryDate.toDateString() === currentDate.toDateString() &&
  //           (currentHours > 15 ||
  //             (currentHours === 15 && currentMinutes >= 30)));

  //       return isExpired;
  //     });

  //     setFilterData(expiredData);
  //   } else if (filter !== "") {
  //     const filteredData = data.baskets.filter((ele) => {
  //       const expiryDate = new Date(ele.expiryDate);
  //       const isActiveAndNotExpired =
  //         ele.isActive &&
  //         (expiryDate >= currentDate ||
  //           (expiryDate.getDate() === currentDate.getDate() &&
  //             expiryDate.getMonth() === currentDate.getMonth() &&
  //             expiryDate.getFullYear() === currentDate.getFullYear() &&
  //             (currentHours < 15 ||
  //               (currentHours === 15 && currentMinutes < 30))));

  //       return ele.rahStatus === filter && isActiveAndNotExpired;
  //     });
  //     setFilterData(filteredData);
  //   } else {
  //     setFilterData(data.baskets);
  //   }
  // }, [filter, data]);

  useEffect(() => {
    const currentDate = new Date();
    const currentHours = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();

    const isExpired = (basket) => {
      const expiryDate = new Date(basket.expiryDate + "T15:30:00");
      return (
        !basket.isActive ||
        expiryDate <= currentDate ||
        (expiryDate.toDateString() === currentDate.toDateString() &&
          (currentHours > 15 || (currentHours === 15 && currentMinutes >= 30)))
      );
    };

    if (filter === "EXPIRED") {
      const expiredData = baskets.filter(isExpired);
      setFilterData(expiredData);
    } else if (filter === "PENDING") {
      const pendingData = baskets.filter(
        (basket) =>
          basket.instrumentList.some(
            (instrument) =>
              instrument.instrumentType === "Primary" &&
              instrument.raHeadStatus === ""
          ) && !isExpired(basket)
      );
      setFilterData(pendingData);
    } else if (filter === "APPROVED") {
      const approvedData = baskets.filter(
        (basket) =>
          basket.instrumentList.some(
            (instrument) =>
              instrument.raHeadStatus === "APPROVED"
          ) && !isExpired(basket)
      );
      setFilterData(approvedData);
    } else if (filter === "REJECTED") {
      const rejectedData = baskets.filter(
        (basket) =>
          basket.instrumentList.some(
            (instrument) =>
              instrument.raHeadStatus === "REJECTED"
          ) && !isExpired(basket)
      );
      setFilterData(rejectedData);
    } else {
      setFilterData(baskets); // Show all baskets
    }
  }, [filter, baskets]);


  const getStatusStyles = (basket) => {
    if (isExpired(basket)) {
      return {
        borderColor: "purple.500",
        boxShadow: "0 0 10px 2px purple",
      };
    }

    switch (handleStatus(basket)) {
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
      return new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );
    };

    // Get the current datetime in the "Asia/Kolkata" timezone
    const currentDate = getCurrentKolkataTime();
    const currentHours = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();

    // Parse the expiry date and add the time "15:30:00"
    const expiryDate = new Date(basket.expiryDate + "T15:30:00"); // Assuming the expiry date is in "YYYY-MM-DD" format

    // Check if the basket should be expired
    const isExpired =
      !basket.isActive ||
      expiryDate <= currentDate ||
      (expiryDate.toDateString() === currentDate.toDateString() &&
        (currentHours > 15 || (currentHours === 15 && currentMinutes >= 30)));

    return isExpired;
  }


  const handleStatus=(basket)=>{
    let isApproved = false;
        let isRejected = false;
        let isPending = false;
  
        // Check instruments of type "Primary"
        basket.instrumentList.forEach((instrument) => {
          if (instrument.instrumentType === "Primary") {
            if (instrument.raHeadStatus === "APPROVED") {
              isApproved = true;
            } else if (instrument.raHeadStatus === "") {
              isPending = true;
            } else if (instrument.raHeadStatus === "REJECTED") {
              isRejected = true;
            }
          }
        });
  
        // Setting the basket status based on the instruments
        if (isRejected) {
          // setStatus("REJECTED");
         return "REJECTED"
      
         
        } else if (isPending) {
          
        return "PENDING"
        } else if (isApproved) {
          // setStatus("APPROVED");
     
         return "APPROVED"
        }
  
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
          <Tab
            as={Link}
            to="/rahead/dashboard"
            fontWeight="bold"
            color={location.pathname === "/rahead/dashboard" ? "#244c9c" : "gray.500"}
            borderBottom={location.pathname === "/rahead/dashboard" && "2px solid"}
            borderColor={location.pathname === "/rahead/dashboard" && "#244c9c"}
            pb={2}
            _hover={{ color: "#244c9c" }}
            _focus={{ outline: "none" }}
          >
            Basket List
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box p={5}>
              {data.baskets.length > 0 ? (
                <Stack direction="row" marginBottom={10} spacing={4}>
                  <Tabs variant="soft-rounded" colorScheme="teal">
                  <TabList>
        <Tab onClick={() => setFilter("")} _selected={{ bg: "orange.300", color: "white" }} _hover={{ bg: "orange.200" }}>
          <Heading as="h4" size="md">ALL</Heading>
        </Tab>
        <Tab onClick={() => setFilter("PENDING")} _selected={{ bg: "gray.300", color: "white" }} _hover={{ bg: "gray.200" }}>
          <Heading as="h4" size="md">PENDING</Heading>
        </Tab>
        <Tab onClick={() => setFilter("APPROVED")} _selected={{ bg: "green.300", color: "white" }} _hover={{ bg: "green.200" }}>
          <Heading as="h4" size="md">APPROVED</Heading>
        </Tab>
        <Tab onClick={() => setFilter("REJECTED")} _selected={{ bg: "red.300", color: "white" }} _hover={{ bg: "red.200" }}>
          <Heading as="h4" size="md">REJECTED</Heading>
        </Tab>
        <Tab onClick={() => setFilter("EXPIRED")} _selected={{ bg: "purple.300", color: "white" }} _hover={{ bg: "purple.200" }}>
          <Heading as="h4" size="md">EXPIRED</Heading>
        </Tab>
      </TabList>
                  </Tabs>
                </Stack>
              ) : (
                ""
              )}
              {filterData.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
                  {filterData.map((basket) => (
                    <Link key={basket._id} to={`/rahead/basket-details/${basket._id}`}>
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
                              src={basket.basketSymbolURL}
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
                                    : handleStatus(basket) === "APPROVED"
                                    ? "green"
                                    : handleStatus(basket) === "REJECTED"
                                    ? "red"
                                    : "gray"
                                }
                              >
                                {handleStatus(basket)}
                              </Badge>
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
                                  {basket.exchange}
                                </Text>
                              </Flex>
                            </Box>
                          </Stack>
                        </CardBody>
                      </Card>
                    </Link>
                  ))}
                </SimpleGrid>
              ) : (
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
              <Heading size="md" mb={4}>
                Create a New Basket
              </Heading>
              {/* Add your form or content for creating a new basket here */}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
