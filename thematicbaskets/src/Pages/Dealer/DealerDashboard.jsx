import React, { useEffect } from "react";
import Navbar from "../../Components/Dealer/Navbar";
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
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { fetchBasket, getSuccessAction } from "../../Redux/basketReducer/action";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchSymbols } from "../../Redux/symbolReducer/action";

export default function DealerDashboard() {
  let token = Cookies.get("login_token_dealer");
  let data = useSelector((store) => store.basketReducer);

  const toast = useToast();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchSymbols());
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/dealer");
      return;
    }

    dispatch(fetchBasket(token))
      .then((res) => {
        if (
          res.data.message == "You do not Have permission to access the data"
        ) {
          Cookies.set("login_token_dealer", ``);
          Cookies.set("username_dealer", "");

          // navigate("/dealer");
        } else {
          let approvedBaskets = res.data.response.data.filter(
            (ele) => ele.rahStatus === "APPROVED"
          );

          dispatch(getSuccessAction(approvedBaskets.reverse()));
        }
      })
      .catch((error) => {
      
        if(error.response.data.detail!=="Basket does not exist"){
          toast({
            title: `${error.message} error`,
            position: "bottom",
            status: "error",
            duration: 2000,
            isClosable: true,
          })
        
        }
      });
  }, [dispatch, token, toast, navigate]);

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

  const truncateHeading = (description, length = 20) => {
    if (description.length <= length) {
      return description;
    }
    return `${description.substring(0, length)}...`;
  };

  const truncateDescription = (description, length = 40) => {
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
          <Tab
            as={Link}
            to="/dealer/dashboard"
            fontWeight="bold"
            color={location.pathname === "/dealer/dashboard" ? "#244c9c" : "gray.500"}
            borderBottom={location.pathname === "/dealer/dashboard" && "2px solid"}
            borderColor={location.pathname === "/dealer/dashboard" && "#244c9c"}
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
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
                  {data.baskets.map((basket) => (
                    <Link key={basket._id} to={`/dealer/basket-details/${basket._id}`}>
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
