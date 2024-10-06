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
import NoData from "../../Images/NoData.avif"
import Cookies from "js-cookie";
import React, { useEffect } from "react";
import Navbar from "../../Components/Admin/Navbar"
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAlgo } from "../../Redux/algoandSignalsReducer/action";

export default function AlgoList() {
  const location = useLocation();
  const dispatch = useDispatch();
  let token = Cookies.get("login_token_admin");
  let {algo,loading}=useSelector((store)=>store.algoandSignalReducer)

  useEffect(()=>{
dispatch(fetchAlgo(token))
  },[])

  const getStatusStyles = (status) => {
    switch (status) {
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

              {algo.length>0?(

              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
                {loading
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <Card key={index} borderRadius="lg" overflow="hidden">
                        <CardHeader p={4} bg="gray.50">
                          <Flex align="center">
                            <SkeletonCircle size="50" mr={4} />
                            <Box>
                              <Skeleton height="20px" width="150px" />
                              <Skeleton height="20px" width="100px" mt={2} />
                            </Box>
                          </Flex>
                        </CardHeader>
                        <Divider />
                        <CardBody p={4}>
                          <Stack spacing={3}>
                            <SkeletonText mt="4" noOfLines={6} spacing="4" />
                          </Stack>
                        </CardBody>
                      </Card>
                    ))
                  : algo.map((basket) => (
                      <Link key={basket._id} to={`/admin/basket-details/${basket._id}`}>
                        <Card
                          {...getStatusStyles(basket.rahStatus)}
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
                                <Heading size="md">{truncateHeading(basket.title)}</Heading>
                                <Badge
                                  colorScheme={
                                    basket.rahStatus === "APPROVED"
                                      ? "green"
                                      : basket.rahStatus === "REJECTED"
                                      ? "red"
                                      : "gray"
                                  }
                                >
                                  {basket.rahStatus}
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

              {algo.length>0?(

              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
                {loading
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <Card key={index} borderRadius="lg" overflow="hidden">
                        <CardHeader p={4} bg="gray.50">
                          <Flex align="center">
                            <SkeletonCircle size="50" mr={4} />
                            <Box>
                              <Skeleton height="20px" width="150px" />
                              <Skeleton height="20px" width="100px" mt={2} />
                            </Box>
                          </Flex>
                        </CardHeader>
                        <Divider />
                        <CardBody p={4}>
                          <Stack spacing={3}>
                            <SkeletonText mt="4" noOfLines={6} spacing="4" />
                          </Stack>
                        </CardBody>
                      </Card>
                    ))
                  : algo.map((basket) => (
                      <Link key={basket._id} to={`/admin/basket-details/${basket._id}`}>
                        <Card
                          {...getStatusStyles(basket.rahStatus)}
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
                                <Heading size="md">{truncateHeading(basket.title)}</Heading>
                                <Badge
                                  colorScheme={
                                    basket.rahStatus === "APPROVED"
                                      ? "green"
                                      : basket.rahStatus === "REJECTED"
                                      ? "red"
                                      : "gray"
                                  }
                                >
                                  {basket.rahStatus}
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
        </TabPanels>
      </Tabs>
    </Box>
  );
}
