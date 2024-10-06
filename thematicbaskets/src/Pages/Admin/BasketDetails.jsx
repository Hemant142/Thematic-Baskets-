import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  useToast,
  IconButton,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Components/Admin/Navbar"
import Cookies from "js-cookie";
import axios from "axios";
import { FaArrowLeft, FaArrowRight, FaPlus, FaBell } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBasketClientList,
  fetchAllClients,
  // fetchBasketClientList,
  // fetchClients,
  postAddToBasket,
} from "../../Redux/clientReducer/action";
import { ArrowBackIcon } from "@chakra-ui/icons";

export default function BasketDetails() {
  const [data, setData] = useState(null);
  const [basketClientList, setBasketClientList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientCurrentPage, setClientCurrentPage] = useState(1);
  const [totalFundRequired, setTotalFundRequired] = useState(0);
  const [clientId, setClientId] = useState("");
  const [status, setStatus] = useState("");
  const [toggle, setToggle] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  let { id } = useParams();
  let token = Cookies.get("login_token_admin");

  let clientData = useSelector((store) => store.clientsReducer.clients);

  if (clientData == undefined) {
    clientData = [];
  }
  const fetchData = async () => {
    try {
      const response = await axios.post(
        `https://centrum.stoq.club/api/backend/get-one/baskets?basket_id=${id}`,
        {},
        {
          headers: { "Access-Token": token },
        }
      );

      if (
        response.data.message == "You do not Have permission to access the data"
      ) {
        Cookies.set("login_token_dealer", ``);
        Cookies.set("username_dealer", "");

        navigate("/admin");
      }
      setStatus(response.data.response.data[0].rahStatus);
      setData(response.data.response.data[0]);
    } catch (error) {
      toast({
        title: `${error.message} error`,
        position: "bottom",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, token, toggle]);
  


  useEffect(() => {
    dispatch(fetchAllBasketClientList(id, token))
      .then((res) => {
    
        setBasketClientList(res.data.response);
      })
      .catch((error) => {
        console.log(error, "fetchBasketClientList ");
        if(error.response.data.detail!=="There is no client with this basket"){

          toast({
            title: `${error.message} error`,
            position: "bottom",
            status: "error",
            duration: 2000,
            isClosable: true,
          })
        }
      });
  }, [id, token, toggle]);

  useEffect(() => {
    dispatch(fetchAllClients(token));
  }, [dispatch, token, toggle]);

  useEffect(() => {
    if (data) {
      const total = instruments.reduce(
        (acc, instrument) => acc + calculateFundREquired(instrument),
        0
      );
      setTotalFundRequired(total);
    }
  }, [data]);
  if (!data) {
    return (
      <Box>
        <Navbar />
        <Text>Loading....</Text>
      </Box>
    );
  }

  const itemsPerPage = 10;

  const instruments = Object.values(data.instrumentList);
  const totalPages = Math.ceil(instruments.length / itemsPerPage);
  const totalClientPages = Math.ceil(clientData.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageChangeClient = (newPage) => {
    setClientCurrentPage(newPage);
  };

  const instrumentStartIndex = (currentPage - 1) * itemsPerPage;
  const instrumentEndIndex = instrumentStartIndex + itemsPerPage;
  const currentInstruments = instruments.slice(
    instrumentStartIndex,
    instrumentEndIndex
  );

  const isClientInBasket = (clientId) => {
    if (!basketClientList || basketClientList.length === 0) return false;

    return basketClientList.some((client) => client.clientId === clientId);
  };

  const clientStartIndex = (clientCurrentPage - 1) * itemsPerPage;
  const clientEndIndex = clientStartIndex + itemsPerPage;


  const currentInstrumentsClient = clientData
    .slice(clientStartIndex, clientEndIndex)
    .filter((client) => isClientInBasket(client._id));

  const calculateQuantile = (instrumentListData) => {
    const qty = instrumentListData.quantity;
    const stopLoss = instrumentListData.stopLoss;
    const takeProfit = instrumentListData.takeProfit;
    const cmp = instrumentListData.cmp;
    const quantile = (cmp - stopLoss) / (takeProfit - stopLoss);
    // Convert quantile to percentage
    const quantilePercentage = quantile * 100;
    let Result = Math.floor(quantilePercentage);

    return `${Result}%`;
  };

  const calculateFundREquired = (instrumentListData) => {
    const qty = instrumentListData.quantity;
    const cmp = instrumentListData.cmp;
    const fundRequired = Math.floor(cmp * qty);

    return fundRequired;
  };

  const handleOrderStatus = (ClientId) => {
    const orderStauts = basketClientList.filter(
      (ele) => ele.clientId == ClientId
    );

    if (orderStauts.length > 0) {
      return orderStauts[0].orderStatus;
    }
  };

  const InstrumentRow = ({ instrument }) => {
    const quantileValue = parseFloat(calculateQuantile(instrument));

    let badgeText;
    let badgeColor;

    if (quantileValue > 100) {
      badgeText = "Book Profit";
      badgeColor = "green";
    } else if (quantileValue > 0 && quantileValue <= 100) {
      badgeText = "Intrade";
      badgeColor = "green";
    } else {
      badgeText = "Stop Loss";
      badgeColor = "red";
    }

    return <Badge colorScheme={badgeColor}>{badgeText}</Badge>;
  };

  const handleBackClick = () => {
    navigate("/admin/dashboard");
  };

  return (
    <Box>
      <Navbar />

      <Flex align="center" justify="flex-start" mt={2} ml={4}>
        <IconButton
          icon={<ArrowBackIcon boxSize={8} />}
          aria-label="Go back"
          onClick={handleBackClick}
          size="lg"
          isRound
          bgColor="#244c9c"
          color="white"
          _hover={{
            transform: "scale(1.2)",
            boxShadow: "0 8px 15px rgba(0, 0, 0, 0.3)",
            bgColor: "#1a3a6b", // Darker shade for hover
          }}
          transition="all 0.3s ease"
          boxShadow="0 4px 6px rgba(0, 0, 0, 0.2)"
          _active={{
            transform: "scale(0.95)",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        />
      </Flex>

      <Flex
        direction={{ base: "column", md: "column", lg: "row" }}
        mt="10"
        m={{ base: "2", md: "5" }}
        gap={"10px"}
      >
        <Box
          bg="white"
          w={{ base: "100%", md: "100%", lg: "50%" }}
          p="5"
          borderRadius="md"
          boxShadow="md"
          mb={{ base: "5", md: "0" }}
          overflowX="auto"
        >
          <Tabs onChange={(index) => setActiveTab(index)} variant="enclosed">
            <TabList>
              <Tab fontWeight="bold">Compositions</Tab>
              <Tab fontWeight="bold">Client</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Table variant="simple" colorScheme="teal" size="sm">
                  <Thead>
                    <Tr>
                      <Th>#</Th>
                      <Th textTransform="capitalize">Script Name</Th>
                      <Th textTransform="capitalize">QTY</Th>
                      {status == "APPROVED" ? (
                        <Th textTransform="capitalize">Status</Th>
                      ) : (
                        ""
                      )}
                      <Th textTransform="capitalize">Stop Loss</Th>
                      <Th textTransform="capitalize">CMP</Th>
                      <Th textTransform="capitalize">Take Profit</Th>
                      <Th textTransform="capitalize">Quantile</Th>
                      <Th textTransform="capitalize">Fund Req</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {currentInstruments.length > 0 &&
                      currentInstruments.map((instrument, index) => (
                        <Tr key={index}>
                          <Td>{instrumentStartIndex + index + 1}</Td>
                          <Td
                            color="blue.500"
                            fontWeight="bold"
                            fontSize={{ base: "sm", md: "md" }}
                          >
                            {instrument.name}
                          </Td>
                          <Td fontSize={{ base: "sm", md: "md" }}>
                            {instrument.quantity}
                          </Td>
                          {status == "APPROVED" && (
                            <Td>
                              <InstrumentRow instrument={instrument} />
                            </Td>
                          )}
                          <Td>{instrument.stopLoss}</Td>
                          <Td>{instrument.cmp}</Td>
                          <Td>{instrument.takeProfit}</Td>
                          <Td>{calculateQuantile(instrument)}</Td>
                          <Td>{calculateFundREquired(instrument)}</Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
                {currentInstruments.length >= 10 && totalPages > 1 ? (
                  <Flex justifyContent="space-between" mt="4">
                    {currentPage === 1 ? (
                      <Button
                        size="sm"
                        colorScheme="gray"
                        leftIcon={<FaArrowLeft />}
                      >
                        Previous
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handlePageChange(currentPage - 1)}
                        size="sm"
                        colorScheme="blue"
                        leftIcon={<FaArrowLeft />}
                      >
                        Previous
                      </Button>
                    )}
                    <Text>
                      Page {currentPage} of {totalPages}
                    </Text>
                    {currentPage === totalPages ? (
                      <Button
                        size="sm"
                        colorScheme="gray"
                        rightIcon={<FaArrowRight />}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handlePageChange(currentPage + 1)}
                        size="sm"
                        colorScheme="blue"
                        rightIcon={<FaArrowRight />}
                      >
                        Next
                      </Button>
                    )}
                  </Flex>
                ) : (
                  ""
                )}
              </TabPanel>

              {/* <==========================================Client Panel==================================> */}
              <TabPanel>
                <Table variant="simple" colorScheme="teal" size="sm">
                  {currentInstrumentsClient.length > 0 && (
                    <Thead>
                      <Tr>
                        <Th>#</Th>
                        <Th textTransform="capitalize">Client ID</Th>
                        <Th>Name</Th>
                        <Th>Order Placed</Th>
                      </Tr>
                    </Thead>
                  )}
                  <Tbody>
                    {currentInstrumentsClient.length > 0 ? (
                      currentInstrumentsClient.map((client, index) => (
                        <Tr key={index}>
                          <Td>{clientStartIndex + index + 1}</Td>
                          <Td>{client.profile.clientId}</Td>
                          <Td
                            color="blue.500"
                            fontWeight="bold"
                            fontSize={{ base: "sm", md: "md" }}
                          >
                            {client.userName}
                          </Td>
                          <Td>{handleOrderStatus(client._id)}</Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan="3">No Client has been assigned</Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
                {currentInstrumentsClient.length === 10 &&
                  totalClientPages > 1 && (
                    <Flex justifyContent="space-between" mt="4">
                      {clientCurrentPage === 1 ? (
                        <Button
                          size="sm"
                          colorScheme="gray"
                          leftIcon={<FaArrowLeft />}
                        >
                          Previous
                        </Button>
                      ) : (
                        <Button
                          onClick={() =>
                            handlePageChangeClient(clientCurrentPage - 1)
                          }
                          size="sm"
                          colorScheme="blue"
                          leftIcon={<FaArrowLeft />}
                        >
                          Previous
                        </Button>
                      )}
                      <Text>
                        Page {clientCurrentPage} of {totalClientPages}
                      </Text>
                      {clientCurrentPage === totalClientPages ? (
                        <Button
                          size="sm"
                          colorScheme="gray"
                          rightIcon={<FaArrowRight />}
                        >
                          Next
                        </Button>
                      ) : (
                        <Button
                          onClick={() =>
                            handlePageChangeClient(clientCurrentPage + 1)
                          }
                          size="sm"
                          colorScheme="blue"
                          rightIcon={<FaArrowRight />}
                        >
                          Next
                        </Button>
                      )}
                    </Flex>
                  )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
        <Box
          bg="white"
          w={{ base: "100%", md: "100%", lg: "50%" }}
          p="5"
          borderRadius="md"
          boxShadow="md"
          mt={{ base: "5", md: "0" }}
        >
          <Text fontSize="xl" fontWeight="bold" mb="4" color="blue.500">
            Basket Info: {data.title}
          </Text>
          <Table variant="simple" size="sm">
            <Tbody>
              <Tr>
                <Td>
                  <strong>Basket Name:</strong>
                </Td>
                <Td>{data.title}</Td>
              </Tr>
              <Tr>
                <Td>
                  <strong>Basket Description:</strong>
                </Td>
                <Td>{data.description}</Td>
              </Tr>
              <Tr>
                <Td>
                  <strong>Basket Rational:</strong>
                </Td>
                <Td>{data.rational}</Td>
              </Tr>
              <Tr>
                <Td>
                  <strong>Expiry Date:</strong>
                </Td>
                <Td>{data.expiryDate}</Td>
              </Tr>
              <Tr>
                <Td>
                  <strong>Creation Date:</strong>
                </Td>
                <Td>{data.creationDate}</Td>
              </Tr>
              <Tr>
                <Td>
                  <strong>Exchange Type:</strong>
                </Td>
                <Td>{data.exchangeType}</Td>
              </Tr>
              <Tr>
                <Td>
                  <strong>Minimum Fund Required:</strong>
                </Td>
                <Td>{totalFundRequired}</Td>
              </Tr>
              <Tr>
                <Td>
                  <strong>Research Head Approval:</strong>
                </Td>
                <Td>
                  {data.rahStatus === "PENDING" && (
                    <Text
                      bg="gray.200"
                      p="1"
                      px="3"
                      width={"50%"}
                      textAlign={"center"}
                      borderRadius="md"
                    >
                      Pending
                    </Text>
                  )}
                  {data.rahStatus === "APPROVED" && (
                    <Text
                      bg="green.200"
                      p="1"
                      px="3"
                      width={"30%"}
                      textAlign={"center"}
                      borderRadius="md"
                    >
                      Yes
                    </Text>
                  )}
                  {data.rahStatus === "REJECTED" && (
                    <Text
                      bg="red.200"
                      p="1"
                      px="3"
                      width={"30%"}
                      textAlign={"center"}
                      borderRadius="md"
                    >
                      No
                    </Text>
                  )}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </Flex>
    </Box>
  );
}
