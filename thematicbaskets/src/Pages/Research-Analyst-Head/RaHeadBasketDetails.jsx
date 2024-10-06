import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Heading,
  Th,
  Td,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Badge,
  useToast,
  IconButton,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
// import Navbar from "../../Cenrum-ResearchAnalyst-Head/Components/Navbar";
import Navbar from "../../Components/RasearchAnalyst-Head/Navbar"
import Cookies from "js-cookie";
import axios from "axios";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useDispatch,useSelector } from "react-redux";
import { fetchSingleBasketData, updateBasketData } from "../../Redux/basketReducer/action";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { fetchSymbols } from "../../Redux/symbolReducer/action";


export default function RaHeadBasketDetails() {
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [totalFundRequired, setTotalFundRequired] = useState(0);
  const [researchHeadMessage, setresearchHeadMessage] = useState("");
  const [updateToggle, setUpdateToggle] = useState(false);
  const [statusUpdated,setStatusUpdated]=useState(true)
  const [rejected,setRejected]=useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  let { id } = useParams();
  let token = Cookies.get("login_token_rh");

  const Symbols = useSelector((store) => store.symbolsReducer.symbols);


  useEffect(() => {
    dispatch(fetchSingleBasketData(id, token))
      .then((res) => {
  
        if (res.message == "You do not Have permission to access the data") {
          Cookies.set("login_token_rh","")
          Cookies.set("username_rh","")
          navigate('/rahead');
        }
        if(res.rahStatus=="REJECTED"||res.rahStatus=="APPROVED"){
          setStatusUpdated(false)
        }
        if(res.rahStatus=="REJECTED"){
          setRejected(true)
        }
        setStatus(res.rahStatus);
       
        setData(res)})
      .catch((error) => console.log(error));
  }, [id, token, updateToggle]);

  useEffect(() => {
    if (data) {
      const total = instruments.reduce((acc, instrument) => acc + calculateFundREquired(instrument), 0);
      setTotalFundRequired(total);
    }
  }, [data]);

  useEffect(() => {
    dispatch(fetchSymbols());
  }, []);

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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInstruments = instruments.slice(startIndex, endIndex);


  const handleReject = () => {
    setShowRejectModal(true);
  };

  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
    setresearchHeadMessage("");
  };


  const handleConfirmReject = () => {
   
   
    if(researchHeadMessage!==""){
      let decision = "REJECTED";
   
      dispatch(updateBasketData(decision, id, token,researchHeadMessage))
      .then((res) => {
        if (res.status === "success") {
          // setStatusUpdated(false)
          toast({
            title: "Basket data has been rejected.",
            position: "bottom",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        } else {
          toast({
            title: res.message,
            position: "bottom",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        }
        setUpdateToggle(!updateToggle);
      })
      .catch((error) => {
        toast({
          title: "An error occurred.",
          position: "bottom",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        console.log(error);
      });
    setShowRejectModal(false);
    setresearchHeadMessage(""); 
    }
   
  };

  const handleApproved = () => {
    let decision = "APPROVED";
    dispatch(updateBasketData(decision, id, token,researchHeadMessage))
      .then((res) => {

        if (res.status === "success") {
          // setStatusUpdated(false)
          toast({
            title: "Basket data has been approved.",
            position: "bottom",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        } else {
          toast({
            title: res.message,
            position: "bottom",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        }
        setUpdateToggle(!updateToggle);
      })
      .catch((error) => {
        toast({
          title: "An error occurred.",
          position: "bottom",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        console.log(error);
      });
  };


  const calculateQuantile=(instrumentListData)=>{
    const qty = instrumentListData.quantity;
    const stopLoss = instrumentListData.stopLoss;
    const takeProfit = instrumentListData.takeProfit;
    const cmp = instrumentListData.cmp;
    const quantile = (cmp - stopLoss) / (takeProfit - stopLoss);
    // Convert quantile to percentage
    const quantilePercentage = quantile * 100;
  
    let Result=Math.floor(quantilePercentage)
 
  return`${Result}%`
    }
  
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
    
      return (
        <Badge colorScheme={badgeColor}>
          {badgeText}
        </Badge>
      );
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
    return `${upsidePotentialPercentage}%`
     
    };

    const rationalLines=data.rational.split('\n').map(line=>line.trim()).filter(line=>line.length>0)
    // console.log(rationalLines,"rational Lines")
    const handleBackClick=()=>{
      navigate("/rahead/dashboard")
    }
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
          bgColor: "#1a3a6b"  // Darker shade for hover
        }}
        transition="all 0.3s ease"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.2)"
        _active={{
          transform: "scale(0.95)",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
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
          overflowX="auto" // Ensure horizontal scrolling on small screens
        >
          <Tabs onChange={(index) => setActiveTab(index)} variant="enclosed">
            <TabList>
              <Tab fontWeight="bold">Compositions</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Table variant="simple" colorScheme="teal" size="sm">
                  <Thead>
                    <Tr>
                      <Th  fontSize="sm">#</Th>
                      <Th  textTransform="capitalize"  fontSize="sm">Script Name</Th>
                      <Th
                        fontSize="sm"
                        fontWeight="bold"
                        textTransform="capitalize"
                      >
                          Upside Potential
                        </Th>
                      <Th  textTransform="capitalize"  fontSize="sm">QTY</Th>
                      {status =="APPROVED" ? <Th  textTransform="capitalize"  fontSize="sm">Status</Th> : ""}
                      <Th  textTransform="capitalize"  fontSize="sm">Stop Loss</Th>
                      <Th  textTransform="capitalize"  fontSize="sm">CMP</Th>
                      <Th  textTransform="capitalize"  fontSize="sm">Take Profit</Th>
                      <Th  textTransform="capitalize"  fontSize="sm">Quantile</Th>
                      <Th  textTransform="capitalize"  fontSize="sm">Fund Req</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {currentInstruments.map((instrument, index) => (
                      <Tr key={index}>
                        <Td>{startIndex + index + 1}</Td>
                        <Td
                          fontWeight="semibold"
                          fontSize="sm"
                          whiteSpace="nowrap"
                          verticalAlign="middle"
                        >
                          {handleSymbolName(instrument.name)}
                        </Td>
                          <Td fontSize="sm" verticalAlign="middle">
                          {handleUpsidePotential(instrument)<1?"Target Achieved":handleUpsidePotential(instrument)}
                        </Td>

                        <Td fontSize={{ base: "sm", md: "md" }}>
                          {instrument.quantity}
                        </Td>
                        {status =="APPROVED" && <Td>
                          <InstrumentRow instrument={instrument} />
                           
                          </Td>}
                        <Td>{instrument.stopLoss}</Td>
                        <Td>{instrument.cmp}</Td>
                        <Td>{instrument.takeProfit}</Td>
                        <Td>{calculateQuantile(instrument)}</Td>
                        <Td>{calculateFundREquired(instrument)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                {currentInstruments.length >= 10||totalPages>1?(   <Flex justifyContent="space-between" mt="4">
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
                </Flex>):""}
             
                {statusUpdated?( <Box
                  display={"flex"}
                  justifyContent={"space-evenly"}
                  marginTop={"5"}
                >{}
                  <Button colorScheme="green" onClick={handleApproved}>
                    Approve
                  </Button>
                  <Button colorScheme="red" onClick={handleReject}>
                    Reject
                  </Button>
                </Box>):""}
               
              </TabPanel>
              <TabPanel>
                <Text>Client data will be displayed here.</Text>
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
                <Td fontFamily={"helvetica"}>{data.description}</Td>
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
                  <strong> Created By:</strong>
                </Td>
                <Td fontFamily={"helvetica"}>{data.createdBy}</Td>
              </Tr>
              <Tr>
                <Td>
                  <strong>Exchange Type:</strong>
                </Td>
                <Td fontFamily={"helvetica"} >{data.exchangeType}</Td>
              </Tr>
              <Tr>
                <Td>
                  <strong>Minimum Fund Required:</strong>
                </Td>
                <Td fontFamily={"helvetica"}> {totalFundRequired}</Td>
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
                      width={{ base: "90%", md: "40%", lg: "50%" }}
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
                      width={{ base: "50%", md: "30%", lg: "50%" }}
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
                      width={{ base: "50%", md: "30%", lg: "30%" }}
                      textAlign={"center"}
                      borderRadius="md"
                    >
                      No
                    </Text>
                  )}
                </Td>
              </Tr>

              {rejected?  <Tr>
                <Td>
                  <strong>Rejection Reason:</strong>
                </Td>
                <Td>{data.rejectedReason}</Td>
              </Tr>:""}
            </Tbody>
          </Table>
        </Box>
      </Flex>

      {/* Rejection Reason Modal */}
      <Modal isOpen={showRejectModal} onClose={handleCloseRejectModal}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Provide Reason for Rejection</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      <Textarea
        placeholder="Enter reason for rejection..."
        rows={4}
        value={researchHeadMessage}
        onChange={(e) => setresearchHeadMessage(e.target.value)}
        width="100%"
        resize="none"
        border="1px solid #5274ac"
        _focus={{ borderColor: "#5274ac", boxShadow: "0 0 0 1px #5274ac" }}
      />
    </ModalBody>
    <ModalFooter>
      <Button colorScheme="red" mr={3} onClick={handleCloseRejectModal}>
        Close
      </Button>
      <Button
        colorScheme="blue"
        onClick={handleConfirmReject}
        disabled={!researchHeadMessage}
      >
        Confirm Reject
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
    </Box>
  );
}
