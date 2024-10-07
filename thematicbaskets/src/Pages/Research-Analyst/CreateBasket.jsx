import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Input,
  List,
  ListItem,
  InputGroup,
  InputRightElement,
  Text,
  Textarea,
  Select,
  RadioGroup,
  Stack,
  Radio,
  useToast,
  IconButton,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { MdArrowDropDown } from "react-icons/md";
import { SearchIcon } from "@chakra-ui/icons";
import axios from "axios";
import Cookies from "js-cookie";
import {
  FormControl,
  FormLabel,
  Heading,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
// import Navbar from "../Components/Navbar";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { fetchSymbols } from "../Redux/symbolReducer/action";
import { useDispatch, useSelector } from "react-redux";
import { fetchSymbols } from "../../Redux/symbolReducer/action";
import { postBasketData } from "../../Redux/basketReducer/action";
import Navbar from "../../Components/Research-Analyst/Navbar";


export default function CreateBasket() {
  const location = useLocation();
  const dispatch = useDispatch();
  const data = useSelector((store) => store.symbolsReducer.symbols);
  let token = Cookies.get("login_token_ra");

  const initialData = {
    basket_name: "",
    basket_description: "",
    basket_rational: "",
    expiry_date: "",
    fund_required: "",
    annual_returns: "",
    cagr: "",
    success_rate: "",
    average_rate: "",
    symbols_info: [],
  };

  const [basketData, setBasketData] = useState(initialData);
  const [numRows, setNumRows] = useState(initialData.symbols_info.length);
  const [tableRows, setTableRows] = useState(initialData.symbols_info);
  const [isLoading, setIsLoading] = useState(false);
  const [isquantityValid, setIsquantityValid] = useState(false);
  const [fourMonthReturns, setFourMonthReturns] = useState(["", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");

  const [currentMonthReturns, setCurrentMonthReturns] = useState("");
  const [factSheetURL, setFactSheetURL] = useState("");
  const [specialBasket, setSpecialBasket] = useState(null);
  const [volatility, setVolatility] = useState("");
  const [underlyingIndex, setUnderlyingIndex] = useState("");
  const [symbols, setSymbols] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  // const [showOptions, setShowOptions] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null); // Track selected row index
  const [wait, setWait] = useState(false);
  const [index, setIndex] = useState(null);
  const inputRef = useRef(null);
  const toast = useToast();
  const dropdownRef = useRef(null);
  const dropdownRefs = useRef([]);

  const [searchTerms, setSearchTerms] = useState([]);
  const [showOptions, setShowOptions] = useState([]);
  const navigate = useNavigate();

  const userName = Cookies.get("username_ra");
  const currentDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 5))
    .toISOString()
    .split("T")[0];

  const maxLength = 2500;
  useEffect(() => {
    dispatch(fetchSymbols(token));
  }, []);


  useEffect(() => {
    setSymbols(data);
  }, [data]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      dropdownRefs.current.forEach((ref, index) => {
        if (ref && !ref.contains(event.target)) {
          const newShowOptions = [...showOptions];
          newShowOptions[index] = false;
          setShowOptions(newShowOptions);
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions]);

  // const handleClickOutside = (event) => {
  //   if (inputRef.current && !inputRef.current.contains(event.target)) {
  //     // setShowOptions(false);
  //     setSelectedRowIndex(null); // Clear selected row index
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  const handleInputChange = (e) => {
    setBasketData({
      ...basketData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRowChange = (index, key, value) => {
    const updatedRows = [...tableRows];
    updatedRows[index][key] = value;

    setIndex(index);
    if (
      key === "stopLoss" &&
      parseFloat(value) >= parseFloat(updatedRows[index].takeProfit)
    ) {
      updatedRows[index].takeProfit = (parseFloat(value) + 1).toString();
    }

    if (
      key === "takeProfit" &&
      parseFloat(value) <= parseFloat(updatedRows[index].stopLoss)
    ) {
      updatedRows[index].stopLoss = (parseFloat(value) - 1).toString();
    }

    setTableRows(updatedRows);
  };

  const handleNumRowsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 15) {
      setErrorMessage("Number of Scripts cannot exceed 15.");
    } else {
      setErrorMessage("");
      setNumRows(value);
    }
  };

  const generateRows = () => {
    if (numRows > 0 && numRows <= 15) {
      const newRows = Array.from({ length: numRows }, () => ({
        name: "",
        symbol: "",
        quantity: "",
        stopLoss: "",
        takeProfit: "",
      }));
      setTableRows(newRows);
    }
  };

  const handleSelectChange = (index, value) => {
    const selectedSymbol = symbols.find((symbol) => symbol.symbol === value);
    if (selectedSymbol) {
      setTableRows((prevRows) => {
        const updatedRows = [...prevRows];
        updatedRows[index] = {
          ...updatedRows[index], // Keep other fields unchanged
          name: selectedSymbol.name, // Update only `name`
          symbol: selectedSymbol.symbol, // Update only `symbol`
        };
        return updatedRows;
      });

      const newShowOptions = [...showOptions];
      newShowOptions[index] = false;
      setShowOptions(newShowOptions);
    }
  };

  const handleSearchChange = (index, value) => {
    setIndex(index);

    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = value;
    setSearchTerms(newSearchTerms);

    const newShowOptions = new Array(tableRows.length).fill(false); // Close all dropdowns
    newShowOptions[index] = true; // Open only the current dropdown

    setShowOptions(newShowOptions);
  };

  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = today.getFullYear();

    return `${year}-${month}-${day}`;
  };

  const filteredSymbols = symbols.filter((item) =>
    item.name.toLowerCase().includes(searchTerms[index]?.toLowerCase() || "")
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    let quantityFlag = true;
    let scriptEmpty = true;
    let inputfield = false;
    let symbolFlag = true;
    let specialbasketfield = true;
    let correctDate = true;
    let underlineIndex = true;
    let tableRowsFlag = false;
    let sum = 0;

    if (tableRows.length > 0) {
      tableRowsFlag = true;
    } else {
      alert(`Please gernate Number of Script First`);
    }
    // Check if expiry date is in the future
    let selectedDate = new Date(basketData.expiry_date);
    let currentDate = new Date();
    if (selectedDate < currentDate) {
      alert("You cannot select a past date.");
      correctDate = false;
      return;
    }

    // Calculate sum of quantities
    tableRows.forEach((row) => {
      sum += parseFloat(row.quantity); // Parse quantity as float
    });

    // Validate total quantity sum
    // if (sum !== 100) {
    //   alert(`The total quantity must equal 100% before submitting. Your quantity is ${sum}`);
    // } else {
    //   quantityFlag = true;
    // }

    // Check if underlying index is selected
    if (!underlyingIndex) {
      underlineIndex = false;
      alert(`Please select one volatility option`);
      return;
    }

    // Check if special basket is selected
    if (specialBasket == null) {
      specialbasketfield = false;
      alert("Please select one option in Special Basket");
      return;
    }

    // Check for duplicate names in tableRows
    let names = new Set();
    let duplicateFound = false;
    tableRows.forEach((row) => {
      if (names.has(row.name)) {
        alert(`Duplicate name found: ${row.name}`);
        symbolFlag = false;
        duplicateFound = true;
        return;
      } else {
        names.add(row.name); // Add name to Set if not duplicate
      }
    });

    tableRows.forEach((row, index) => {
      if (row.name === "") {
        alert(`Script is empty in row # ${index + 1}`);
        scriptEmpty = false;
      }
    });

    if (duplicateFound) return; // Exit early if duplicate name is found

    // Check if any table field is empty
    let IsTableFieldEmpty = tableRows.filter(
      (ele) => ele.stopLoss !== "" && ele.takeProfit !== ""
    );
    if (IsTableFieldEmpty.length !== tableRows.length) {
      alert("One or more table fields are empty. Please fill them.");
      return;
    }

    // Proceed if all validations pass
    if (
      symbolFlag &&
      quantityFlag &&
      tableRowsFlag &&
      specialbasketfield &&
      underlineIndex &&
      scriptEmpty &&
      correctDate
    ) {
      try {
        setIsLoading(true);

        // Prepare data to send
        const dataToSend = {
          title: basketData.basket_name.trim(),
          description: basketData.basket_description,
          rationale: basketData.basket_rational,
          expiryDate: basketData.expiry_date,
          // creationDate: getCurrentDate(),
          // createdBy: userName,
          exchange: "NSE_EQ",
          // fundRequired: basketData.fund_required,
          // basketInfo: {
          //   annualReturns: basketData.annual_returns,
          //   averageRate: basketData.average_rate,
          //   cagr: basketData.cagr,
          //   successRate: basketData.success_rate,
          // },
          instrumentList: tableRows.map(row => ({
            instrument: row.symbol, // Symbol becomes instrument
            securityId: Math.floor(Math.random() * 10000), // Generate securityId
            stopLoss: Number(row.stopLoss), // Take stopLoss from table row
            takeProfit: Number(row.takeProfit), // Take takeProfit from table row
            currentPrice:Number((Math.random() * 500).toFixed(2)), // Fetch or mock current price
            quantity: Number(row.quantity), // Take quantity from table row
          })),
          
          // [tableRows.reduce((acc, item, index) => {
          //   // Generate key like c1, c2, c3, etc.
          //   const key = `c${index + 1}`;
          //   acc[key] = {
          //     quantity: item.quantity,
          //     name: item.symbol,
          //     stopLoss: item.stopLoss,
          //     takeProfit: item.takeProfit,
          //   };
          //   return acc;
          // }, {})],
          specialBasket: specialBasket,
          // volatility: volatility,
          riskLevel:volatility,
          underlyingIndex: underlyingIndex,
          // factSheetURL: factSheetURL,
        };

        // Log data to be sent
      
        setWait(true);
        console.log(dataToSend,"dataToSend")
        dispatch(postBasketData(dataToSend, token)).then((res) => {
          console.log(res,"postBasketData")
          if (res.detail === "Token has expired") {
            Cookies.set("login_token_ra", "");
            Cookies.set("username_ra", "");
            navigate("/ra");
          }
          if (res !== undefined) {
            if (res.status === "success") {
              setWait(false);
              toast({
                title: `Basket successfully created`,
                position: "bottom",
                status: `${res.status}`,
                duration: 2000,
                isClosable: true,
              });
              setCurrentMonthReturns("");
              setFourMonthReturns(["", "", "", ""]);
              setNumRows([]);
              setTableRows([]);
              setSearchTerms([]);
              setIsquantityValid(false);
              setBasketData(initialData);
              setVolatility("");
              setUnderlyingIndex("");
              setSpecialBasket("");
              setFactSheetURL("");
            } else {
              setWait(false);
              if (
                res.message == "You do not Have permission to access the data"
              ) {
                Cookies.set("login_token_ra", "");
                Cookies.set("username_ra", "");
                navigate("/ra");
              }
              toast({
                title: `${res.message}`,
                position: "bottom",
                status: `${res.status}`,
                duration: 2000,
                isClosable: true,
              });
            }
          }

          if (res == undefined) {
            toast({
              title: `${"Basket Name Already Exists"}`,
              position: "bottom",
              status: `warning`,
              duration: 2000,
              isClosable: true,
            });
            setWait(false);
          }
        });

        setIsLoading(false);
      } catch (error) {
        console.log("Error creating basket:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Box bg="gray.100" minHeight="100vh">
      <Navbar />

      <Tabs variant="unstyled" mt="10px" borderBottomColor="gray.200">
        <TabList display="flex">
          <Tab
            as={Link}
            to="/ra/dashboard"
            fontWeight="bold"
            color={location.pathname === "/ra/dashboard" ? "#244c9c" : "gray.500"}
            borderBottom={location.pathname === "/ra/dashboard" && "2px solid"}
            borderColor={location.pathname === "/ra/dashboard" && "#244c9c"}
            pb={2}
            _hover={{ color: "#244c9c" }}
            _focus={{ outline: "none" }}
          >
            Basket List
          </Tab>
          <Tab
            as={Link}
            to="/ra/create-basket"
            fontWeight="bold"
            color={
              location.pathname === "/ra/create-basket" ? "#244c9c" : "gray.500"
            }
            borderBottom={location.pathname === "/ra/create-basket" && "2px solid"}
            borderColor={location.pathname === "/ra/create-basket" && "#244c9c"}
            pb={2}
            _hover={{ color: "#244c9c" }}
            _focus={{ outline: "none" }}
          >
            Create Basket
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <form
              onSubmit={handleSubmit}
              style={{ width: "70%", margin: "auto" }}
            >
              <Box p={6} bg="white" borderRadius="lg" boxShadow="md">
                <Heading size="md" mb={4}>
                  Create a New Basket
                </Heading>

                <FormControl mb={4}>
                  <FormLabel htmlFor="basket_name">Basket Name</FormLabel>
                  <Input
                    type="text"
                    id="basket_name"
                    name="basket_name"
                    maxLength={80}
                    value={basketData.basket_name}
                    onChange={handleInputChange}
                    placeholder="Name of the Basket"
                    isRequired
                  />
                </FormControl>

                <Box display={"flex"} gap={"5"}>
                  <FormControl mb={4}>
                    <FormLabel htmlFor="basket_description">
                      Description
                    </FormLabel>
                    <Textarea
                      type="text"
                      id="basket_description"
                      name="basket_description"
                      value={basketData.basket_description}
                      onChange={handleInputChange}
                      placeholder="Description"
                      isRequired
                      maxLength={maxLength}
                    />
                    <Text fontSize="sm" color="gray.500" textAlign={"right"}>
                      {maxLength - basketData.basket_description.length}{" "}
                      characters remaining
                    </Text>
                  </FormControl>

                  <FormControl mb={4}>
                    <FormLabel htmlFor="basket_rational">
                      Basket Rational
                    </FormLabel>
                    <Textarea
                      type="text"
                      id="basket_rational"
                      name="basket_rational"
                      value={basketData.basket_rational}
                      onChange={handleInputChange}
                      placeholder="Rational"
                      isRequired
                      maxLength={maxLength}
                    />
                    <Text fontSize="sm" color="gray.500" textAlign={"right"}>
                      {maxLength - basketData.basket_rational.length} characters
                      remaining
                    </Text>
                  </FormControl>
                </Box>

                <Box display={"flex"} gap={"5"}>
                  <FormControl mb={4}>
                    <FormLabel htmlFor="expiry_date">Expiry Date</FormLabel>
                    <Input
                      type="date"
                      id="expiry_date"
                      name="expiry_date"
                      min={currentDate}
                      max={maxDate}
                      value={basketData.expiry_date}
                      onChange={handleInputChange}
                      isRequired
                    />
                  </FormControl>

                  <FormControl mb={4}>
                    <FormLabel htmlFor="currentMonthReturns">
                      Risk Level
                    </FormLabel>
                    <Select
                      required
                      value={volatility}
                      onChange={(e) => setVolatility(e.target.value)}
                    >
                      <option value="">Select Risk Level</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </Select>
                  </FormControl>
                </Box>

                <Box
                  display={"flex"}
                  justifyContent={"space-evenly"}
                  gap={"10"}
                >
                  <FormControl mb={4}>
                    <FormLabel htmlFor="currentMonthReturns">
                      Fact Sheet URL
                    </FormLabel>
                    <Input
                      type="text"
                      id="factSheetURL"
                      name="factSheetURL"
                      value={factSheetURL}
                      onChange={(e) => setFactSheetURL(e.target.value)}
                      placeholder="Fact Sheet URL "
                      isRequired
                    />
                  </FormControl>

                  <FormControl mb={4}>
                    <FormLabel htmlFor="currentMonthReturns">
                      Special Basket
                    </FormLabel>
                    <RadioGroup value={specialBasket}>
                      <Stack spacing={5} direction="row">
                        <Radio
                          colorScheme={
                            specialBasket === true ? "green" : "gray"
                          }
                          value={true}
                          onChange={() => setSpecialBasket(true)}
                        >
                          Yes
                        </Radio>
                        <Radio
                          colorScheme={specialBasket === false ? "red" : "gray"}
                          value={false}
                          onChange={() => setSpecialBasket(false)}
                        >
                          No
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>

                  <FormControl mb={4}>
                    <FormLabel htmlFor="currentMonthReturns">
                      Select Underlying Index
                    </FormLabel>
                    <Select
                      required
                      value={underlyingIndex}
                      onChange={(e) => setUnderlyingIndex(e.target.value)}
                    >
                      <option value="">Select Underlying Index</option>
                      <option value="NIFTY 50">NIFTY 50</option>
                      <option value="NIFTY MIDCAP 100">
                        NIFTY MIDCAP 100{" "}
                      </option>
                      <option value="NIFTY BANK">NIFTY BANK</option>
                      <option value="NIFTY 100">NIFTY 100</option>
                      <option value="NIFTY COMMODITIES">
                        NIFTY COMMODITIES
                      </option>
                      <option value="NIFTY CONSUMPTION">
                        NIFTY CONSUMPTION
                      </option>
                      <option value="NIFTY FIN SERVICE">
                        NIFTY FIN SERVICE
                      </option>
                      <option value="NIFTY IT">NIFTY IT</option>
                      <option value="NIFTY MIDCAP 50"> NIFTY MIDCAP 50</option>
                      <option value="NIFTY REALTY">NIFTY REALTY</option>
                      <option value="NIFTY INFRA">NIFTY INFRA</option>
                      <option value="NIFTY ENERGY"> NIFTY ENERGY</option>
                      <option value="NIFTY FMCG">NIFTY FMCG</option>
                      <option value="NIFTY MNC">NIFTY MNC</option>
                      <option value="NIFTY PHARMA">NIFTY PHARMA</option>
                      {/* <option value="NIFTY PSU">NIFTY PSU</option> */}
                      {/* <option value="NIFTY PSU">NIFTY PSU</option> */}
                      <option value="NIFTY AUTO">NIFTY AUTO</option>
                      <option value="NIFTY METAL">NIFTY METAL</option>
                      <option value="NIFTY MEDIA">NIFTY MEDIA</option>
                      <option value="NIFTY ALPHA 50">NIFTY ALPHA 50</option>
                      <option value="NIFTY MIDCAP 150">NIFTY MIDCAP 150</option>
                      <option value="NIFTY SMLCAP 50">NIFTY SMLCAP 50</option>
                      <option value="NIFTY SMLCAP 100">NIFTY SMLCAP 100</option>
                      <option value="NIFTY SMLCAP 250 ">
                        NIFTY SMLCAP 250{" "}
                      </option>
                      <option value="NIFTY 500">NIFTY 500</option>
                      <option value="NIFTY CPSE">NIFTY CPSE</option>
                      <option value="NIFTY NEXT 50">NIFTY NEXT 50</option>
                      <option value="NIFTY MID SELECT">NIFTY MID SELECT</option>
                      <option value="NIFTY HEALTHCARE">NIFTY HEALTHCARE</option>
                      <option value="NIFTY CONSR DURBL">
                        NIFTY CONSR DURBL
                      </option>
                      <option value="NIFTY OIL AND GAS">
                        NIFTY OIL AND GAS
                      </option>
                      <option value="NIFTY LARGEMID250">
                        NIFTY LARGEMID250
                      </option>
                      <option value="NIFTY INDIA MFG">NIFTY INDIA MFG</option>
                      <option value="NIFTY IND DIGITAL">
                        NIFTY IND DIGITAL
                      </option>
                      <option value="NIFTY TATA 25 CAP">
                        NIFTY TATA 25 CAP
                      </option>
                    </Select>
                  </FormControl>
                </Box>

                <FormControl mb={4}>
                  <FormLabel htmlFor="symbols_info">
                    Script Information
                  </FormLabel>
                  <Box>
                    <Input
                      type="number"
                      id="numRows"
                      name="numRows"
                      value={numRows}
                      onChange={handleNumRowsChange}
                      placeholder="Number of Scripts"
                      isRequired
                      min="1"
                      max="15"
                      width="50%"
                      mr={4}
                    />
                    <Button
                      onClick={generateRows}
                      colorScheme="blue"
                      isDisabled={numRows > 15 || numRows < 1 || !numRows}
                    >
                      Generate Rows
                    </Button>
                    {errorMessage && (
                      <Text color="red.500" mt={2}>
                        {errorMessage}
                      </Text>
                    )}
                  </Box>
                  {tableRows.length > 0 && (
                    <Table variant="simple" mt={4}>
                      <Thead>
                        <Tr>
                          <Th>#</Th>
                          <Th textTransform="capitalize">Scripts</Th>
                          <Th textTransform="capitalize">Quantity </Th>
                          <Th textTransform="capitalize">Take Profit </Th>
                          <Th textTransform="capitalize">Stop Loss </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {tableRows.map((row, index) => (
                          <Tr key={index}>
                            <Td>{index + 1}</Td>

                            <Td>
                              <Box
                                position="relative"
                                display="inline-block"
                                width="283px"
                                ref={dropdownRef}
                              >
                                <InputGroup>
                                  <Input
                                    value={tableRows[index].name}
                                    onClick={() =>
                                      handleSearchChange(
                                        index,
                                        searchTerms[index]
                                      )
                                    }
                                    placeholder="Select Scripts"
                                    variant="filled"
                                    bg="gray.100"
                                    _focus={{
                                      bg: "white",
                                      borderColor: "gray.300",
                                    }}
                                    readOnly
                                    cursor="pointer"
                                  />
                                  <InputRightElement width="2.5rem">
                                    <IconButton
                                      aria-label="Dropdown icon"
                                      icon={<MdArrowDropDown />}
                                      variant="ghost"
                                      onClick={() =>
                                        handleSearchChange(
                                          index,
                                          searchTerms[index]
                                        )
                                      }
                                    />
                                  </InputRightElement>
                                </InputGroup>
                                {showOptions[index] && (
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
                                        value={searchTerms[index]}
                                        onChange={(e) =>
                                          handleSearchChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                        placeholder="Search Scripts"
                                        bg="gray.50"
                                        border="1px"
                                        borderColor="gray.300"
                                        _focus={{
                                          bg: "white",
                                          borderColor: "blue.500",
                                        }}
                                      />
                                      <InputRightElement width="2.5rem">
                                        <IconButton
                                          aria-label="Search database"
                                          icon={<SearchIcon color="gray.500" />}
                                          variant="ghost"
                                          onClick={() =>
                                            handleSearchChange(index, "")
                                          }
                                        />
                                      </InputRightElement>
                                    </InputGroup>

                                    <List spacing={1}>
                                      {filteredSymbols.length ? (
                                        filteredSymbols.map((item) => (
                                          <ListItem
                                            key={item.symbol}
                                            onClick={() =>
                                              handleSelectChange(
                                                index,
                                                item.symbol
                                              )
                                            }
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
                            </Td>

                            <Td>
                              <Input
                                value={row.quantity}
                                required
                                onChange={(e) =>
                                  handleRowChange(
                                    index,
                                    "quantity",
                                    e.target.value
                                  )
                                }
                                type="number"
                                placeholder="Quantity"
                                min={1}
                              />
                            </Td>

                            <Td>
                              <Input
                                value={row.takeProfit}
                                required
                                onChange={(e) =>
                                  handleRowChange(
                                    index,
                                    "takeProfit",
                                    e.target.value
                                  )
                                }
                                type="number"
                                placeholder="Take Profit"
                              />
                            </Td>
                            <Td>
                              <Input
                                value={row.stopLoss}
                                required
                                min={1}
                                onChange={(e) =>
                                  handleRowChange(
                                    index,
                                    "stopLoss",
                                    e.target.value
                                  )
                                }
                                type="number"
                                placeholder="Stop Loss"
                              />
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  )}
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  mt={4}
                  // isLoading={wait}
                >
                  Create Basket
                </Button>
              </Box>
            </form>
          </TabPanel>

          <TabPanel>
            <form
              onSubmit={handleSubmit}
              style={{ width: "70%", margin: "auto" }}
            >
              <Box p={6} bg="white" borderRadius="lg" boxShadow="md">
                <Heading size="md" mb={4}>
                  Create a New Basket
                </Heading>

                <FormControl mb={4}>
                  <FormLabel htmlFor="basket_name">Basket Name</FormLabel>
                  <Input
                    type="text"
                    id="basket_name"
                    name="basket_name"
                    maxLength={80}
                    value={basketData.basket_name}
                    onChange={handleInputChange}
                    placeholder="Name of the Basket"
                    isRequired
                  />
                </FormControl>

                <Box display={"flex"} gap={"5"}>
                  <FormControl mb={4}>
                    <FormLabel htmlFor="basket_description">
                      Description
                    </FormLabel>
                    <Textarea
                      type="text"
                      id="basket_description"
                      name="basket_description"
                      value={basketData.basket_description}
                      onChange={handleInputChange}
                      placeholder="Description"
                      isRequired
                    />
                  </FormControl>

                  <FormControl mb={4}>
                    <FormLabel htmlFor="basket_rational">
                      Basket Rational
                    </FormLabel>
                    <Textarea
                      type="text"
                      id="basket_rational"
                      name="basket_rational"
                      value={basketData.basket_rational}
                      onChange={handleInputChange}
                      placeholder="Rational"
                      isRequired
                    />
                  </FormControl>
                </Box>

                <Box display={"flex"} gap={"5"}>
                  <FormControl mb={4}>
                    <FormLabel htmlFor="expiry_date">Expiry Date</FormLabel>
                    <Input
                      type="date"
                      id="expiry_date"
                      name="expiry_date"
                      min={currentDate}
                      max={maxDate}
                      value={basketData.expiry_date}
                      onChange={handleInputChange}
                      isRequired
                    />
                  </FormControl>

                  <FormControl mb={4}>
                    <FormLabel htmlFor="currentMonthReturns">
                      Risk Level
                    </FormLabel>
                    <Select
                      required
                      value={volatility}
                      onChange={(e) => setVolatility(e.target.value)}
                    >
                      <option value="">Select Risk Level</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </Select>
                  </FormControl>
                </Box>

                <Box
                  display={"flex"}
                  justifyContent={"space-evenly"}
                  gap={"10"}
                >
                  <FormControl mb={4}>
                    <FormLabel htmlFor="currentMonthReturns">
                      Fact Sheet URL
                    </FormLabel>
                    <Input
                      type="text"
                      id="factSheetURL"
                      name="factSheetURL"
                      value={factSheetURL}
                      onChange={(e) => setFactSheetURL(e.target.value)}
                      placeholder="Fact Sheet URL "
                      isRequired
                    />
                  </FormControl>

                  <FormControl mb={4}>
                    <FormLabel htmlFor="currentMonthReturns">
                      Special Basket
                    </FormLabel>
                    <RadioGroup value={specialBasket}>
                      <Stack spacing={5} direction="row">
                        <Radio
                          colorScheme={
                            specialBasket === true ? "green" : "gray"
                          }
                          value={true}
                          onChange={() => setSpecialBasket(true)}
                        >
                          Yes
                        </Radio>
                        <Radio
                          colorScheme={specialBasket === false ? "red" : "gray"}
                          value={false}
                          onChange={() => setSpecialBasket(false)}
                        >
                          No
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>

                  <FormControl mb={4}>
                    <FormLabel htmlFor="currentMonthReturns">
                      Select Underlying Index
                    </FormLabel>
                    <Select
                      required
                      value={underlyingIndex}
                      onChange={(e) => setUnderlyingIndex(e.target.value)}
                    >
                      <option value="">Select Underlying Index</option>
                      <option value="NIFTY 50">NIFTY 50</option>
                      <option value="NIFTY MIDCAP 100">
                        NIFTY MIDCAP 100{" "}
                      </option>
                      <option value="NIFTY BANK">NIFTY BANK</option>
                      <option value="NIFTY 100">NIFTY 100</option>
                      <option value="NIFTY COMMODITIES">
                        NIFTY COMMODITIES
                      </option>
                      <option value="NIFTY CONSUMPTION">
                        NIFTY CONSUMPTION
                      </option>
                      <option value="NIFTY FIN SERVICE">
                        NIFTY FIN SERVICE
                      </option>
                      <option value="NIFTY IT">NIFTY IT</option>
                      <option value="NIFTY MIDCAP 50"> NIFTY MIDCAP 50</option>
                      <option value="NIFTY REALTY">NIFTY REALTY</option>
                      <option value="NIFTY INFRA">NIFTY INFRA</option>
                      <option value="NIFTY ENERGY"> NIFTY ENERGY</option>
                      <option value="NIFTY FMCG">NIFTY FMCG</option>
                      <option value="NIFTY MNC">NIFTY MNC</option>
                      <option value="NIFTY PHARMA">NIFTY PHARMA</option>
                      <option value="NIFTY PSE">NIFTY PSE</option>
                      <option value="NIFTY PSE">NIFTY PSE</option>
                      <option value="NIFTY AUTO">NIFTY AUTO</option>
                      <option value="NIFTY METAL">NIFTY METAL</option>
                      <option value="NIFTY MEDIA">NIFTY MEDIA</option>
                      <option value="NIFTY ALPHA 50">NIFTY ALPHA 50</option>
                      <option value="NIFTY MIDCAP 150">NIFTY MIDCAP 150</option>
                      <option value="NIFTY SMLCAP 50">NIFTY SMLCAP 50</option>
                      <option value="NIFTY SMLCAP 100">NIFTY SMLCAP 100</option>
                      <option value="NIFTY SMLCAP 250 ">
                        NIFTY SMLCAP 250{" "}
                      </option>
                      <option value="NIFTY 500">NIFTY 500</option>
                      <option value="NIFTY CPSE">NIFTY CPSE</option>
                      <option value="NIFTY NEXT 50">NIFTY NEXT 50</option>
                      <option value="NIFTY MID SELECT">NIFTY MID SELECT</option>
                      <option value="NIFTY HEALTHCARE">NIFTY HEALTHCARE</option>
                      <option value="NIFTY CONSR DURBL">
                        NIFTY CONSR DURBL
                      </option>
                      <option value="NIFTY OIL AND GAS">
                        NIFTY OIL AND GAS
                      </option>
                      <option value="NIFTY LARGEMID250">
                        NIFTY LARGEMID250
                      </option>
                      <option value="NIFTY INDIA MFG">NIFTY INDIA MFG</option>
                      <option value="NIFTY IND DIGITAL">
                        NIFTY IND DIGITAL
                      </option>
                      <option value="NIFTY TATA 25 CAP">
                        NIFTY TATA 25 CAP
                      </option>
                    </Select>
                  </FormControl>
                </Box>

                <FormControl mb={4}>
                  <FormLabel htmlFor="symbols_info">
                    Script Information
                  </FormLabel>
                  <Box>
                    <Input
                      type="number"
                      id="numRows"
                      name="numRows"
                      value={numRows}
                      onChange={handleNumRowsChange}
                      placeholder="Number of Scripts"
                      isRequired
                      min="1"
                      // max="10"
                      width="50%"
                      mr={4}
                    />
                    <Button onClick={generateRows} colorScheme="blue">
                      Number of Scripts
                    </Button>
                  </Box>
                  {tableRows.length > 0 && (
                    <Table variant="simple" mt={4}>
                      <Thead>
                        <Tr>
                          <Th>#</Th>
                          <Th textTransform="capitalize">Scripts</Th>
                          <Th textTransform="capitalize">Quantity </Th>
                          <Th textTransform="capitalize">Take Profit </Th>
                          <Th textTransform="capitalize">Stop Loss </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {tableRows.map((row, index) => (
                          <Tr key={index}>
                            <Td>{index + 1}</Td>

                            <Td>
                              <Box
                                position="relative"
                                display="inline-block"
                                width="288px"
                                ref={dropdownRef}
                              >
                                <InputGroup>
                                  <Input
                                    value={tableRows[index].name}
                                    onClick={() =>
                                      handleSearchChange(
                                        index,
                                        searchTerms[index]
                                      )
                                    }
                                    placeholder="Select Scripts"
                                    variant="filled"
                                    bg="gray.100"
                                    _focus={{
                                      bg: "white",
                                      borderColor: "gray.300",
                                    }}
                                    readOnly
                                    cursor="pointer"
                                  />
                                  <InputRightElement width="2.5rem">
                                    <IconButton
                                      aria-label="Dropdown icon"
                                      icon={<MdArrowDropDown />}
                                      variant="ghost"
                                      onClick={() =>
                                        handleSearchChange(
                                          index,
                                          searchTerms[index]
                                        )
                                      }
                                    />
                                  </InputRightElement>
                                </InputGroup>
                                {showOptions[index] && (
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
                                        value={searchTerms[index]}
                                        onChange={(e) =>
                                          handleSearchChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                        placeholder="Search Scripts"
                                        bg="gray.50"
                                        border="1px"
                                        borderColor="gray.300"
                                        _focus={{
                                          bg: "white",
                                          borderColor: "blue.500",
                                        }}
                                      />
                                      <InputRightElement width="2.5rem">
                                        <IconButton
                                          aria-label="Search database"
                                          icon={<SearchIcon color="gray.500" />}
                                          variant="ghost"
                                          onClick={() =>
                                            handleSearchChange(index, "")
                                          }
                                        />
                                      </InputRightElement>
                                    </InputGroup>

                                    <List spacing={1}>
                                      {filteredSymbols.length ? (
                                        filteredSymbols.map((item) => (
                                          <ListItem
                                            key={item.symbol}
                                            onClick={() =>
                                              handleSelectChange(
                                                index,
                                                item.symbol
                                              )
                                            }
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
                            </Td>

                            <Td>
                              <Input
                                value={row.quantity}
                                required
                                onChange={(e) =>
                                  handleRowChange(
                                    index,
                                    "quantity",
                                    e.target.value
                                  )
                                }
                                type="number"
                                placeholder="Quantity"
                                min={1}
                              />
                            </Td>

                            <Td>
                              <Input
                                value={row.takeProfit}
                                required
                                onChange={(e) =>
                                  handleRowChange(
                                    index,
                                    "takeProfit",
                                    e.target.value
                                  )
                                }
                                type="number"
                                placeholder="Take Profit"
                              />
                            </Td>
                            <Td>
                              <Input
                                value={row.stopLoss}
                                required
                                min={1}
                                onChange={(e) =>
                                  handleRowChange(
                                    index,
                                    "stopLoss",
                                    e.target.value
                                  )
                                }
                                type="number"
                                placeholder="Stop Loss"
                              />
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  )}
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  mt={4}
                  // isLoading={wait}
                >
                  Create Basket
                </Button>
              </Box>
            </form>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
