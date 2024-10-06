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
  Input,
  InputGroup,
  InputLeftElement,
  Heading,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Components/Dealer/Navbar";
import Cookies from "js-cookie";
import axios from "axios";
import {
  FaArrowLeft,
  FaArrowRight,
  FaPlus,
  FaBell,
  FaSearch,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBasketClientList,
  fetchClients,
  postAddToBasket,
} from "../../Redux/clientReducer/action";
import {
  IoArrowBackCircle,
  IoArrowBackCircleOutline,
  IoChevronBackCircleOutline,
} from "react-icons/io5";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { fetchSymbols } from "../../Redux/symbolReducer/action";

export default function DealerBasketDetails() {
  const [data, setData] = useState(null);
  const [basketClientList, setBasketClientList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientCurrentPage, setClientCurrentPage] = useState(1);
  const [totalFundRequired, setTotalFundRequired] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [toggle, setToggle] = useState(false);
  const [status, setStatus] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  let { id } = useParams();
  let token = Cookies.get("login_token_dealer");
  const Symbols = useSelector((store) => store.symbolsReducer.symbols);

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

        navigate("/dealer");
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
    dispatch(fetchBasketClientList(id, token))
      .then((res) => {
     
        setBasketClientList(res.data.response);
      })
      .catch((error) =>{
// console.log(error,"error")
if(error.response.data.detail!=="There is no client with this basket"){

  toast({
    title: `${error.message} error`,
    position: "bottom",
    status: "error",
    duration: 2000,
    isClosable: true,
  })
}
      }
      );
  }, [id, token, toggle]);

  useEffect(() => {
    if (data) {
      const total = instruments.reduce(
        (acc, instrument) => acc + calculateFundREquired(instrument),
        0
      );
      setTotalFundRequired(total);
    }
  }, [data]);

  useEffect(() => {
    dispatch(fetchClients(token));
  }, [dispatch, token, toggle]);

  useEffect(() => {
    dispatch(fetchSymbols());
  }, []);

  const handleAddToBasket = (item) => {
    let addBasket = {
      basketId: id,
      clientId: item._id,
      dealerId: item.dealerId,
    };

    dispatch(postAddToBasket(addBasket, token))
      .then((res) => {
  
        if (res.status === "success") {
          setToggle(!toggle);
          toast({
            title: `Client added to basket.`,
            position: "bottom",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        }
        if (res.status === "error") {

          setToggle(!toggle);
          toast({
            title: `${res.message} error`,
            position: "bottom",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
   
      if(error.response.data.detail =="WhatsApp Token has expired" ){
        toast({
          title: `${error.response.data.detail} error`,
          position: "bottom",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }else{
        toast({
          title: `${error.message} error`,
          position: "bottom",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
        
      });
  };

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
  // const totalClientPages = Math.ceil(clientData.length / itemsPerPage);

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

  // const handleSearchChange = (e) => {
  //   setSearchTerm(e.target.value);
  // };

  // const handleSearchChange = (e) => {
  //   setSearchTerm(e.target.value);
  //   setClientCurrentPage(1); // Reset to first page on new search
  // };

  // Handle search change and reset page
const handleSearchChange = (e) => {
  setSearchTerm(e.target.value);
  setClientCurrentPage(1); // Reset to first page on new search
};

// Calculate filteredClients and update pagination
const filteredClients = clientData.filter((client) =>

  client.clientId.toLowerCase().includes(searchTerm.toLowerCase()) ||client.userName.toLowerCase().includes(searchTerm.toLowerCase())
);

// Calculate total pages based on filtered results
const totalClientPages = Math.ceil(filteredClients.length / itemsPerPage);

// Calculate pagination indices
const clientStartIndex = (clientCurrentPage - 1) * itemsPerPage;
const clientEndIndex = clientStartIndex + itemsPerPage;
const currentInstrumentsClient = filteredClients.slice(
  clientStartIndex,
  clientEndIndex
);


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

  const handleOrderStatus = (ClientId) => {
    // Ensure basketClientList is defined and has elements
    if (!basketClientList || basketClientList.length === 0) return "N/A";

    const orderStatus = basketClientList.filter(
      (ele) => ele.clientId === ClientId
    );

    // If orderStatus is found, return the first match
    if (orderStatus.length > 0) {
      return orderStatus[0].orderStatus;
    }

    // Default return value if no match is found
    return "N/A";
  };


  const handleAddAllClients = () => {
    const promises = currentInstrumentsClient.map((client) => {
      const addBasket = {
        basketId: id,
        clientId: client._id,
        dealerId: client.dealerId,
      };
      return dispatch(postAddToBasket(addBasket, token));
    });

    // Wait for all add operations to complete
    Promise.all(promises)
      .then((results) => {
     
        const successCount = results.filter(
          (res) => res.status === "success"
        ).length;
        const errorCount = results.length - successCount;

        setToggle(!toggle);

        if (successCount > 0) {
          toast({
            title: `${successCount} client(s) added to basket.`,
            position: "bottom",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        }

        if (errorCount > 0) {
          toast({
            title: `${errorCount} client(s) could not be added.`,
            position: "bottom",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        toast({
          title: `${error.message} error`,
          position: "bottom",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  };

  const handleSymbolName = (symbol) => {
    if (symbol !== "" && symbol !== null) {
      let filterSymbolName = Symbols.filter((ele) => ele.symbol == symbol);
      let result = filterSymbolName[0];

      if (result !== undefined) {
        return result.name;
      }
    }

    return symbol; // Return an empty string if the symbol is not found or invalid
  };

  const handleUpsidePotential = (instrumentListData) => {
    let cmp = Number(instrumentListData.cmp);
    let takeProfit = Number(instrumentListData.takeProfit);

    let upsidePotential = ((takeProfit - cmp) / cmp) * 100;

    let upsidePotentialPercentage = Math.floor(upsidePotential);
    if(upsidePotentialPercentage<0){
      return `Target Achieved`
    }
    return `${upsidePotentialPercentage}%`;
  };

  const rationalLines=data.rational.split('\n').map(line=>line.trim()).filter(line=>line.length>0)

  const handleBackClick = () => {
    navigate("/dealer/dashboard");
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
                      <Th
                        textTransform="capitalize"
                        fontWeight="bold"
                        fontSize="sm"
                      >
                        Script Name
                      </Th>
                      <Th
                        fontSize="sm"
                        fontWeight="bold"
                        textTransform="capitalize"
                        paddingRight="2"
                        whiteSpace="nowrap"
                      >
                        Upside Potential
                      </Th>
                      <Th
                        textTransform="capitalize"
                        fontWeight="bold"
                        fontSize="sm"
                      >
                        QTY
                      </Th>
                      {status === "APPROVED" && (
                        <Th
                          textTransform="capitalize"
                          fontWeight="bold"
                          fontSize="sm"
                        >
                          Status
                        </Th>
                      )}
                      <Th
                        textTransform="capitalize"
                        fontWeight="bold"
                        fontSize="sm"
                      >
                        Stop Loss
                      </Th>
                      <Th
                        textTransform="capitalize"
                        fontWeight="bold"
                        fontSize="sm"
                      >
                        CMP
                      </Th>
                      <Th
                        textTransform="capitalize"
                        fontWeight="bold"
                        fontSize="sm"
                      >
                        Take Profit
                      </Th>
                      <Th
                        textTransform="capitalize"
                        fontWeight="bold"
                        fontSize="sm"
                      >
                        Quantile
                      </Th>
                      <Th
                        textTransform="capitalize"
                        fontWeight="bold"
                        fontSize="sm"
                      >
                        Fund Req
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {currentInstruments.length > 0 &&
                      currentInstruments.map((instrument, index) => (
                        <Tr key={index}>
                          <Td>{instrumentStartIndex + index + 1}</Td>
                          <Td
                            fontWeight="semibold"
                            fontSize="sm"
                            whiteSpace="nowrap"
                            verticalAlign="middle"
                          >
                            {handleSymbolName(instrument.name)}
                          </Td>
                          <Td fontSize="sm" verticalAlign="middle">
                            {handleUpsidePotential(instrument) < 1
                              ? "Target Achieved"
                              : handleUpsidePotential(instrument)}
                          </Td>
                          <Td fontSize={{ base: "sm", md: "md" }}>
                            {instrument.quantity}
                          </Td>
                          {status === "APPROVED" && (
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

                {currentInstruments.length >= 10 || totalPages > 1 ? (
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
  <Table
    variant="simple"
    size="sm"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="md"
    boxShadow="sm"
    bg="white"
  >
    {/* Table header */}
    <Thead>
      <Tr>
        <Th fontSize="sm" fontWeight="bold">#</Th>
        <Th fontSize="sm" textTransform="capitalize" fontWeight="bold">Client ID</Th>
        <Th fontSize="sm" textTransform="capitalize" fontWeight="bold">Client Name</Th>
        <Th fontSize="sm" textTransform="capitalize" fontWeight="bold">Order Status</Th>
        <Th>
          <InputGroup size="sm" mt={2}>
            <InputLeftElement pointerEvents="none">
              <FaSearch color="gray.500" />
            </InputLeftElement>
            <Input
              placeholder="Search client"
              value={searchTerm}
              onChange={handleSearchChange}
              borderRadius="md"
              focusBorderColor="blue.500"
              bg="gray.50"
            />
          </InputGroup>
        </Th>
      </Tr>
    </Thead>
    {/* Table body */}
    <Tbody>
      {currentInstrumentsClient.length > 0 ? (
        currentInstrumentsClient.map((client, index) => {
          const orderStatus = handleOrderStatus(client._id);
          let statusColor;

          switch (orderStatus) {
            case "PENDING":
              statusColor = "gray.500";
              break;
            case "ORDER PLACED":
              statusColor = "blue.500";
              break;
            case "TRADE COMPLETED":
              statusColor = "green.500";
              break;
            case "INSUFFICIENT FUND":
              statusColor = "red.500";
              break;
            default:
              statusColor = "gray.500";
          }

          return (
            <Tr
              key={index}
              _hover={{ bg: "gray.50" }}
              transition="background-color 0.2s ease"
            >
              <Td fontSize="sm" color="gray.700">
                {clientStartIndex + index + 1}
              </Td>
              <Td fontSize="sm" color="gray.700">
                {client.clientId}
              </Td>
              <Td
                color="blue.500"
                fontWeight="bold"
                fontFamily="helvetica"
                fontSize={{ base: "sm", md: "md" }}
              >
                {client.userName}
              </Td>
              <Td
                fontFamily="helvetica"
                color={statusColor}
                fontWeight="semibold"
                fontSize="sm"
              >
                {orderStatus}
              </Td>
              <Td>
                {!isClientInBasket(client._id) && (
                  <Flex justifyContent="flex-end">
                    <Button
                      colorScheme="green"
                      leftIcon={<FaPlus />}
                      size="xs"
                      onClick={() => handleAddToBasket(client)}
                      variant="outline"
                      _hover={{ bg: "green.500", color: "white" }}
                    >
                      Add to Basket
                    </Button>
                  </Flex>
                )}
              </Td>
            </Tr>
          );
        })
      ) : (
        <Tr>
          <Td
            colSpan={5}
            textAlign="center"
            fontSize="sm"
            color="gray.500"
          >
            No Client has been assigned
          </Td>
        </Tr>
      )}
    </Tbody>
  </Table>

  {filteredClients.length > 0 && totalClientPages > 1 && (
    <Flex justifyContent="space-between" mt="4">
      {clientCurrentPage === 1 ? (
        <Button size="sm" colorScheme="gray" leftIcon={<FaArrowLeft />}>
          Previous
        </Button>
      ) : (
        <Button
          onClick={() => handlePageChangeClient(clientCurrentPage - 1)}
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
        <Button size="sm" colorScheme="gray" rightIcon={<FaArrowRight />}>
          Next
        </Button>
      ) : (
        <Button
          onClick={() => handlePageChangeClient(clientCurrentPage + 1)}
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
                <Td>
                  {data.description.length > 1000
                    ? `${data.description.substring(0, 1000)}...`
                    : data.description}
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <strong>Basket Rational:</strong>
                </Td>
                <Td>
          {rationalLines.map((line, index) => (
            <Box key={index} display="flex" mb={4}>
              {/* <Text as="span" mr={2} fontSize="md" color="gray.700"> */}
              <Heading as='h5' size='sm' mr={2}>

                •
              </Heading>
              {/* </Text> */}
              <Text fontSize="sm" color="gray.700">
                {line}
              </Text>
            </Box>
          ))}
        </Td>
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
