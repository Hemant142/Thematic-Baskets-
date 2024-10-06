import React, { useState, useEffect, useRef } from "react";
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
  Switch,
  IconButton,
  Heading,
  useDisclosure,
  Input,
  DrawerFooter,
  DrawerHeader,
  DrawerContent,
  DrawerOverlay,
  Drawer,
  DrawerBody,
  FormControl,
  FormLabel,
  DrawerCloseButton,
  Spacer,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Components/Research-Analyst/Navbar";

import Cookies from "js-cookie";
import axios from "axios";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ArrowBackIcon, DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchSymbols } from "../../Redux/symbolReducer/action";
import { MdArrowDropDown } from "react-icons/md";

const clientData = [
  { id: 1, name: "Hemant" },
  { id: 2, name: "Amit" },
  { id: 3, name: "Priya" },
  { id: 4, name: "Rahul" },
  { id: 5, name: "Sneha" },
  { id: 6, name: "Vikram" },
  { id: 7, name: "Anjali" },
  { id: 8, name: "Rohit" },
  { id: 9, name: "Nisha" },
  { id: 10, name: "Arjun" },
  { id: 11, name: "Meena" },
  { id: 12, name: "Suresh" },
  { id: 13, name: "Kavita" },
  { id: 14, name: "Ramesh" },
  { id: 15, name: "Neha" },
  { id: 16, name: "Vijay" },
  { id: 17, name: "Sunita" },
  { id: 18, name: "Manoj" },
  { id: 19, name: "Pooja" },
  { id: 20, name: "Ajay" },
];

export default function RaBasketDetails() {
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientCurrentPage, setClientCurrentPage] = useState(1);
  const [status, setStatus] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [totalFundRequired, setTotalFundRequired] = useState(0);

  const [killSwitch, setKillSwitch] = useState(true);
  const [rejected, setRejected] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const dropdownRef = useRef(null);
  const [showOptions, setShowOptions] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); 
 

  // Handle search input change
  const handleSearchInputChange = (value) => {
    setSearchTerm(value);
  };

  // Toggle the dropdown for symbol selection
  const handleDropdownToggle = () => {
    setShowOptions((prev) => !prev);
  };


  const toast = useToast();

  let { id } = useParams();
  let token = Cookies.get("login_token_ra");
  const Symbols = useSelector((store) => store.symbolsReducer.symbols);

  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  // Form state for new instrument
  const [newInstrument, setNewInstrument] = useState({
    quantity: "",
    name: "",
    stopLoss: "",
    takeProfit: "",
  });

  const [editableInstruments, setEditableInstruments] = useState([]);
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
        Cookies.set("login_token_ra", "");
        Cookies.set("username_ra", "");

        navigate("/");
      }
      if (response.data.response.data[0].rahStatus == "REJECTED" || "PENDING") {
        setKillSwitch(false);
      }
      if (response.data.response.data[0].rahStatus == "REJECTED") {
        setRejected(true);
      }

      setStatus(response.data.response.data[0].rahStatus);
      setData(response.data.response.data[0]);
    } catch (error) {
      console.error(error.message, "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, token]);

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
  const totalClientPages = Math.ceil(clientData.length / itemsPerPage);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageChangeClient = (newPage) => {
    setClientCurrentPage(newPage);
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInstruments = instruments.slice(startIndex, endIndex);

  const clientStartIndex = (clientCurrentPage - 1) * itemsPerPage;
  const clientEndIndex = clientStartIndex + itemsPerPage;
  const currentInstrumentsClient = clientData.slice(
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

    if (upsidePotentialPercentage < 0) {
      return `Target Achieved`;
    }

    return `${upsidePotentialPercentage}%`;
  };
  const handleBackClick = () => {
    navigate("/ra/dashboard");
  };

  const rationalLines = data.rational
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  // Clone the instruments data for editing
  const handleEditClick = () => {
    const instrumentsCopy = JSON.parse(JSON.stringify(currentInstruments));
    setEditableInstruments(instrumentsCopy);
    onOpen(); // Opens the Drawer instead of the Drawer
  };

  // Handle input change for editable fields
  const handleInputChange = (index, field, value) => {
    const updatedInstruments = [...editableInstruments];
    updatedInstruments[index][field] = value;
    setEditableInstruments(updatedInstruments);
  };

  // Save changes function
  const handleSaveChanges = () => {
    // You can now send editableInstruments to your API or update the state
    console.log("Updated Instruments: ", editableInstruments);
    onClose();
  };

  const handleDelete = (index) => {
    const updatedInstruments = [...editableInstruments];
    updatedInstruments.splice(index, 1); // Remove the instrument at the specific index
    setEditableInstruments(updatedInstruments); // Update the state
  };

  const handleAddInstrument = () => {
    // Check if all required fields are filled
    if (!newInstrument.name || !newInstrument.quantity || !newInstrument.stopLoss || !newInstrument.takeProfit) {
      toast({
        title: "Error",
        description: "Please fill in all fields before adding.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return; // Do not proceed if any field is empty
    }
  
    setEditableInstruments([...editableInstruments, newInstrument]);
    setNewInstrument({ quantity: '', name: '', stopLoss: '', takeProfit: '' }); // Reset form
    setSearchTerm("");
    onAddClose(); // Close the add form
  
    // Show success toast
    toast({
      title: "Instrument Added",
      description: `${newInstrument.name} was successfully added.`,
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top-right",
    });
  };
  

  const isFormValid = () => {
    return newInstrument.name && newInstrument.quantity && newInstrument.stopLoss && newInstrument.takeProfit;
  };

   // Filter symbols based on the search term
   const filteredSymbols = Symbols.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
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
          overflowX="auto" // Ensure horizontal scrolling on small screens
        >
          <Tabs
            onChange={(index) => setActiveTab(index)}
            variant="enclosed"
            width={"100%"}
          >
            <TabList>
              <Tab fontWeight="bold">Compositions</Tab>
              {/* <Tab fontWeight="bold">Client</Tab>  */}
              <Button
                colorScheme="teal"
                variant="outline"
                ml={6}
                onClick={handleEditClick}
              >
                Edit
              </Button>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Table variant="simple" colorScheme="teal" size="sm">
                  <Thead>
                    <Tr>
                      <Th fontSize="sm">#</Th>
                      <Th fontSize="sm" textTransform="capitalize">
                        Script Name
                      </Th>
                      <Th
                        fontSize="sm"
                        fontWeight="bold"
                        textTransform="capitalize"
                      >
                        Upside Potential
                      </Th>
                      <Th textTransform="capitalize" fontSize="sm">
                        QTY
                      </Th>
                      {status == "APPROVED" ? (
                        <Th textTransform="capitalize" fontSize="sm">
                          Status
                        </Th>
                      ) : (
                        ""
                      )}
                      <Th textTransform="capitalize" fontSize="sm">
                        Stop Loss
                      </Th>
                      <Th textTransform="capitalize" fontSize="sm">
                        CMP
                      </Th>
                      <Th textTransform="capitalize" fontSize="sm">
                        Take Profit
                      </Th>
                      <Th textTransform="capitalize" fontSize="sm">
                        Quantile
                      </Th>
                      <Th textTransform="capitalize" fontSize="sm">
                        Fund Req
                      </Th>

                      {/* <Th textTransform="capitalize" fontSize="sm">Kill Switch</Th> */}
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
                          {handleUpsidePotential(instrument) < 1
                            ? "Target Achieved"
                            : handleUpsidePotential(instrument)}
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

                        {/* <Td
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Switch size="md" />
                          </Td> */}
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
              {/* <=========================================Client Data Displayed========================> */}
              {/* <TabPanel>
                <Table variant="simple" colorScheme="teal" size="sm">
                  <Thead>
                    <Tr>
                      <Th>#</Th>
                      <Th>Name</Th>
                      
                    </Tr>
                  </Thead>
                  <Tbody>
                    {currentInstrumentsClient.map((client, index) => (
                      <Tr key={index}>
                        <Td>{clientStartIndex + index + 1}</Td>
                        <Td color="blue.500" fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>{client.name}</Td>
                       
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                <Flex justifyContent="space-between" mt="4">
                  {clientCurrentPage === 1 ? (
                    <Button size="sm" colorScheme="gray" leftIcon={<FaArrowLeft />}>
                      Previous
                    </Button>
                  ) : (
                    <Button onClick={() => handlePageChangeClient(clientCurrentPage - 1)} size="sm" colorScheme="blue" leftIcon={<FaArrowLeft />}>
                      Previous
                    </Button>
                  )}
                  <Text>Page {clientCurrentPage} of {totalClientPages}</Text>
                  {clientCurrentPage === totalClientPages ? (
                    <Button size="sm" colorScheme="gray" rightIcon={<FaArrowRight />}>
                      Next
                    </Button>
                  ) : (
                    <Button onClick={() => handlePageChangeClient(clientCurrentPage + 1)} size="sm" colorScheme="blue" rightIcon={<FaArrowRight />}>
                      Next
                    </Button>
                  )}
                </Flex>
              </TabPanel> */}
            </TabPanels>
          </Tabs>
        </Box>

        {/* Drawer for editing instruments */}
          <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xl"> 
      <DrawerOverlay />
      <DrawerContent bg="white" borderRadius="lg" boxShadow="xl">
        <DrawerCloseButton />
        <DrawerHeader
          fontSize="lg"
          fontWeight="semibold"
          textAlign="center"
          borderBottom="1px solid"
          borderColor="gray.200"
          py="3"
          bg="gray.50"
          color="black"
          textTransform="uppercase"
          letterSpacing="wider"
        >
          Edit Instruments
        </DrawerHeader>

        <DrawerBody px="4" py="4">
          <Box mb="4">
          <Flex>
          <Text fontSize="md" fontWeight="medium" mb="2" color="gray.600">
              Instrument Details
            </Text>
  <Spacer />
  <Button colorScheme="green" onClick={onAddOpen} mb="4" size="sm">
              Add Script
            </Button>
</Flex>
           
            
            <Table variant="simple" colorScheme="blue" size="md">
              <Thead bg="gray.100">
                <Tr>
                  <Th>#</Th>
                  <Th>Script Name</Th>
                  <Th>CMP</Th>
                  <Th>QTY</Th>
                  <Th>Stop Loss</Th>
                  <Th>Take Profit</Th>
                  <Th>Exit</Th>
                </Tr>
              </Thead>
              <Tbody>
                {editableInstruments.map((instrument, index) => (
                  <Tr key={index} _hover={{ bg: "gray.50" }}>
                    <Td>{index + 1}</Td>
                    <Td>{instrument.name}</Td>
                    <Td>{instrument.cmp}</Td>
                    <Td>
                    {instrument.quantity}
                      {/* <Input
                        value={instrument.quantity}
                        onChange={(e) =>
                          handleInputChange(index, "quantity", e.target.value)
                        }
                        size="md" // Changed to medium size
                        borderColor="gray.300"
                        borderRadius="md"
                        width="100%" // Set width to full
                        _focus={{ borderColor: "blue.400" }}
                        py="2" // Reduced padding for a smaller height
                      /> */}
                    </Td>
                    <Td>
                      <Input
                        value={instrument.stopLoss}
                        onChange={(e) =>
                          handleInputChange(index, "stopLoss", e.target.value)
                        }
                        size="md" // Changed to medium size
                        borderColor="gray.300"
                        borderRadius="md"
                        width="100%" // Set width to full
                        _focus={{ borderColor: "red.400" }}
                        py="2" // Reduced padding for a smaller height
                      />
                    </Td>
                    <Td>
                      <Input
                        value={instrument.takeProfit}
                        onChange={(e) =>
                          handleInputChange(index, "takeProfit", e.target.value)
                        }
                        size="md" // Changed to medium size
                        borderColor="gray.300"
                        borderRadius="md"
                        width="100%" // Set width to full
                        _focus={{ borderColor: "green.400" }}
                        py="2" // Reduced padding for a smaller height
                      />
                    </Td>
                    <Td>
                      <Button
                        leftIcon={<DeleteIcon />}
                        colorScheme="red"
                        size="sm"
                        // borderRadius="md"
                        _hover={{ bg: "red.100", transform: "scale(1.05)" }}
                        onClick={() => handleDelete(index)}
                      >
                        Exit
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </DrawerBody>

        <DrawerFooter
          borderTop="1px solid"
          borderColor="gray.200"
          bg="gray.50"
          py="3"
        >
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleSaveChanges}
            size="md"
            fontWeight="medium"
            // borderRadius="full"
            px="6"
            _hover={{
              bg: "blue.600",
              color: "white",
              transform: "scale(1.05)",
            }}
          >
            Save
          </Button>
          <Button
            variant="outline"
            colorScheme="gray"
            size="md"
            // borderRadius="full"
            onClick={onClose}
            _hover={{
              bg: "gray.200",
              boxShadow: "lg",
              transform: "scale(1.05)",
            }}
          >
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>

        {/* Add Instrument Modal */}
        <Drawer isOpen={isAddOpen} placement="right" onClose={onAddClose}  size="md">
      <DrawerOverlay />
      <DrawerContent bg="white" borderRadius="lg" boxShadow="xl">
        <DrawerCloseButton />
        <DrawerHeader
          fontSize="xl"
          fontWeight="semibold"
          textAlign="center"
          borderBottom="1px solid"
          borderColor="gray.200"
          py="4"
          bg="gray.50"
          color="black"
        >
          Add Script
        </DrawerHeader>

        <DrawerBody px="5" py="6">
          <FormControl mb="4">
            <FormLabel>Name</FormLabel>
            <Box position="relative" ref={dropdownRef}>
              <InputGroup>
                <Input
                  value={newInstrument.name}
                  onClick={handleDropdownToggle}
                  placeholder="Select Script"
                  variant="filled"
                  bg="gray.100"
                  _focus={{ bg: "white", borderColor: "gray.300" }}
                  readOnly
                  cursor="pointer"
                />
                <InputRightElement width="2.5rem">
                  <IconButton
                    aria-label="Dropdown icon"
                    icon={<MdArrowDropDown />}
                    variant="ghost"
                    onClick={handleDropdownToggle}
                  />
                </InputRightElement>
              </InputGroup>

              {showOptions && (
                <Box
                  position="absolute"
                  top="100%"
                  left={0}
                  right={0}
                  bg="white"
                  boxShadow="lg"
                  zIndex={10}
                  maxHeight="200px"
                  overflowY="auto"
                  borderRadius="md"
                  mt={1}
                  p={2}
                >
                  <InputGroup mb={2}>
                    <Input
                      value={searchTerm}
                      onChange={(e) => handleSearchInputChange(e.target.value)}
                      placeholder="Search Scripts"
                      bg="gray.50"
                      border="1px"
                      borderColor="gray.300"
                      _focus={{ bg: "white", borderColor: "blue.500" }}
                    />
                    <InputRightElement width="2.5rem">
                      <IconButton
                        aria-label="Search database"
                        icon={<SearchIcon color="gray.500" />}
                        variant="ghost"
                        onClick={() => handleSearchInputChange('')}
                      />
                    </InputRightElement>
                  </InputGroup>

                  <List spacing={1}>
                    {filteredSymbols.length ? (
                      filteredSymbols.map((item) => (
                        <ListItem
                          key={item.symbol}
                          onClick={() => {
                            setShowOptions(false); // Close dropdown on select
                            setNewInstrument({ ...newInstrument, name: item.name }); // Update the selected name
                          }}
                          cursor="pointer"
                          _hover={{ background: "gray.100" }}
                          px={4}
                          py={2}
                          borderRadius="md"
                          bg="gray.50"
                          mb={1}
                        >
                          {item.name}
                        </ListItem>
                      ))
                    ) : (
                      <Text px={4} py={2} color="gray.500">
                        No options found
                      </Text>
                    )}
                  </List>
                </Box>
              )}
            </Box>
          </FormControl>

          <FormControl mb="4">
            <FormLabel>Quantity</FormLabel>
            <Input
              value={newInstrument.quantity}
              onChange={(e) =>
                setNewInstrument({
                  ...newInstrument,
                  quantity: e.target.value,
                })
              }
              placeholder="Quantity"
              isRequired
              type="number"
            />
          </FormControl>

          <FormControl mb="4">
            <FormLabel>Stop Loss</FormLabel>
            <Input
              value={newInstrument.stopLoss}
              onChange={(e) =>
                setNewInstrument({
                  ...newInstrument,
                  stopLoss: e.target.value,
                })
              }
              isRequired
              placeholder="Stop Loss"
              type="number"
            />
          </FormControl>

          <FormControl mb="4">
            <FormLabel>Take Profit</FormLabel>
            <Input
              value={newInstrument.takeProfit}
              onChange={(e) =>
                setNewInstrument({
                  ...newInstrument,
                  takeProfit: e.target.value,
                })
              }
              isRequired
              placeholder="Take Profit"
              type="number"
            />
          </FormControl>
        </DrawerBody>

        <DrawerFooter
          borderTop="1px solid"
          borderColor="gray.200"
          bg="gray.50"
          py="4"
        >
          <Button
            colorScheme="blue"
            onClick={handleAddInstrument}
            mr={3}
            size="md"
            fontWeight="medium"
            borderRadius="full"
            isDisabled={!isFormValid()} // Disable button if form is not valid
          >
            Add
          </Button>
          <Button variant="outline" colorScheme="gray" onClick={onAddClose}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>

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
                <Td>
                  <Text fontSize="sm">{data.title}</Text>
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <strong>Basket Description:</strong>
                </Td>
                <Td>
                  <Text fontSize="sm">{data.description}</Text>
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
                      <Heading as="h5" size="sm" mr={2}>
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
                <Td>
                  <Text fontSize="sm">{data.expiryDate}</Text>
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <strong>Creation Date:</strong>
                </Td>
                <Td>
                  <Text fontSize="sm">{data.creationDate}</Text>
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <strong>Exchange Type:</strong>
                </Td>
                <Td>
                  <Text fontSize="sm">{data.exchangeType}</Text>
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <strong>Minimum Fund Required:</strong>
                </Td>
                <Td>
                  <Text fontSize="sm">{totalFundRequired}</Text>
                </Td>
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
                      width={{ base: "80%", md: "50%", lg: "50%" }}
                      textAlign={"center"}
                      borderRadius="md"
                      fontSize="sm"
                    >
                      Pending
                    </Text>
                  )}
                  {data.rahStatus === "APPROVED" && (
                    <Text
                      bg="green.200"
                      p="1"
                      px="3"
                      width={{ base: "80%", md: "50%", lg: "55%" }}
                      textAlign={"center"}
                      borderRadius="md"
                      fontSize="sm"
                    >
                      Approved
                    </Text>
                  )}
                  {data.rahStatus === "REJECTED" && (
                    <Text
                      bg="red.200"
                      p="1"
                      px="3"
                      width={{ base: "80%", md: "50%", lg: "55%" }}
                      textAlign={"center"}
                      borderRadius="md"
                      fontSize="sm"
                    >
                      Rejected
                    </Text>
                  )}
                </Td>
              </Tr>
              {rejected ? (
                <Tr>
                  <Td>
                    <strong>Rejected Reason:</strong>
                  </Td>
                  <Td>
                    <Text fontSize="sm">
                      {data.rejectedReason !== null
                        ? data.rejectedReason
                        : "Reason Is Not Mentioned"}
                    </Text>
                  </Td>
                </Tr>
              ) : (
                ""
              )}
            </Tbody>
          </Table>
        </Box>
      </Flex>
    </Box>
  );
}
