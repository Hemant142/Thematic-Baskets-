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
} from "@chakra-ui/react";
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
import Navbar from "../../Components/Admin/Navbar"
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { fetchSymbols } from "../../Redux/symbolReducer/action";
import { useDispatch, useSelector } from "react-redux";
import { postBasketData } from "../../Redux/basketReducer/action";


export default function CreateBasket() {
  const location = useLocation();
  const dispatch = useDispatch();
  const data = useSelector((store) => store.symbolsReducer.symbols);
  let token = Cookies.get("login_token_admin");

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
  const [isAllocationValid, setIsAllocationValid] = useState(false);
  const [fourMonthReturns, setFourMonthReturns] = useState(["", "", "", ""]);
  const [currentMonthReturns, setCurrentMonthReturns] = useState("");
  const [specialBasket, setSpecialBasket] = useState(null);
  const [volatility,setVolatility]=useState('')
  const [underlyingIndex,setUnderlyingIndex]=useState('')
  const [symbols, setSymbols] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null); // Track selected row index
  const inputRef = useRef(null);
  const toast = useToast();
  const userName = Cookies.get('username_admin');

  useEffect(() => {
    dispatch(fetchSymbols());
  }, [dispatch]);

  useEffect(() => {
    setSymbols(data);
  }, [data]);

  const filteredData = symbols.filter((item) =>
    item.sym.toLowerCase().includes(filter.toLowerCase())
  );

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setShowOptions(false);
      setSelectedRowIndex(null); // Clear selected row index
    }
  };

  const handleSelectOption = (item) => {
    if (selectedRowIndex !== null) {
      const updatedRows = [...tableRows];
      updatedRows[selectedRowIndex].name = item.sym; // Update the 'name' field with selected symbol
      setTableRows(updatedRows);
      setSelectedOption(item.sym);
      setShowOptions(false);
      setSelectedRowIndex(null); // Clear selected row index
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBasketData({ ...basketData, [name]: value });
  };

  const handleNumRowsChange = (event) => {
    const { value } = event.target;
    setNumRows(parseInt(value));
  };

  const generateRows = () => {
    const rows = [];
    for (let i = 1; i <= numRows; i++) {
      rows.push({
        name: "",
        allocation: "",
        stopLoss: "",
        takeProfit: "",
      });
    }
    setTableRows(rows);
  };

  // const handleRowChange = (index, field, value) => {
  //   const updatedRows = [...tableRows];

  //   updatedRows[index][field] = value;
  //   if(field=='name'){
  //     setFilter(updatedRows[index][field])
  //   }

  //   setTableRows(updatedRows);
  // };
  const handleRowChange = (index, field, value) => {
    const updatedRows = [...tableRows];
    updatedRows[index][field] = value;

    setTableRows(updatedRows);
  };

  const handleFourMonthChange = (index, value) => {
    const updatedReturns = [...fourMonthReturns];
    updatedReturns[index] = value; // Ensure the value is a number
    setFourMonthReturns(updatedReturns);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    let allocationFlag = false;
    let symbolFlag = false;
    let inputfield=false
    let specialbasketfield=true

    let underlineIndex=true
    let sum = 0;
    tableRows.forEach((row) => {
      sum += parseFloat(row.allocation); // Parse allocation as float
    });
    if (sum !== 100) {
      alert(
        `The total allocation must equal 100% before submitting. Your allocation is ${sum}`
      );
    } else {
      allocationFlag = true;
    }
 
    if(underlyingIndex==""){
      underlineIndex=false
      alert(`Please select one volatility options`)
    }
if(specialBasket==null){
  alert('Please select one option in Special Basket')
  specialbasketfield=false
}
    let names = new Set();
    tableRows.forEach((row) => {
      sum += parseFloat(row.allocation); // Parse allocation as float
      if (names.has(row.name)) {
        alert(`Duplicate name found: ${row.name}`);
        return; // Exit early if duplicate name is found
      } else {
        symbolFlag = true;
      }
      names.add(row.name); // Add name to Set if not duplicate
    });
       
    let IsTableFieldEmpty=tableRows.filter((ele)=>ele.stopLoss!==""&&ele.takeProfit!=="")

    if(IsTableFieldEmpty.length==tableRows.length){
      inputfield=true
    }else{
      alert('one table filed is empty please fill')
    }

    function getCurrentDate() {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
      const year = today.getFullYear();

      return `${day}/${month}/${year}`;
    }
    const stringToBoolean = (str) => {
      return str.toLowerCase() === "true";
    };
    if (symbolFlag && allocationFlag && inputfield&&specialbasketfield &&volatility &&underlineIndex) {
      try {
        setIsLoading(true);

        const dataToSend = {
          title: basketData.basket_name,
          description: basketData.basket_description,
          rational: basketData.basket_rational,
          expiryDate: basketData.expiry_date,
          creationDate: getCurrentDate(),
          createdBy:userName,
          exchangeType: "NSE_EQ",
          fundRequired: basketData.fund_required,
          basketInfo: {
            annualReturns: basketData.annual_returns,
            averageRate: basketData.average_rate,
            cagr: basketData.cagr,
            successRate: basketData.success_rate,
          },

          instrumentList: tableRows.reduce((acc, item, index) => {
            // Generate key like c1, c2, c3, etc.
            const key = `c${index + 1}`;
            acc[key] = {
              allocation: item.allocation,
              name: item.name,
              stopLoss: item.stopLoss,
              takeProfit: item.takeProfit,
            };

            return acc;
          }, {}),
          specialBasket: specialBasket,
          volatility:volatility,
          underlyingIndex:underlyingIndex,
          currentMonthReturns: currentMonthReturns,
          fourMonthReturns: fourMonthReturns,
        };
    

         dispatch(postBasketData(dataToSend, token))
         .then((res)=>{
       
          if(res.status=='success'){
            toast({
              title: `Basket successfully created`,
              position: "bottom",
              status: `${res.status}`,
              duration: 2000,
              isClosable: true,
          })

          setCurrentMonthReturns("");
          setFourMonthReturns(["", "", "", ""]);
          setNumRows([]);
          setTableRows([]);
          setIsAllocationValid(false);
          setBasketData(initialData);
          setVolatility('')
          setUnderlyingIndex("")
          setSpecialBasket("")
          }else{
            toast({
              title: `${res.message}`,
              position: "bottom",
              status: `${res.status}`,
              duration: 2000,
              isClosable: true,
          })
          }
         })
         .catch((error)=>{
    
          toast({
            title: `${error.response.data.message} error`,
            position: "bottom",
            status: 'error',
            duration: 2000,
            isClosable: true,
          })
        })
        setIsLoading(false);
      
      } catch (error) {
        console.error("Error creating basket:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleShowOptions = (index) => {
    setSelectedRowIndex(index); // Set the selected row index
    setShowOptions(true); // Show options for the selected row
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setShowOptions(true);
  };

  return (
    <Box bg="gray.100" minHeight="100vh">
      <Navbar />

      <Tabs variant="unstyled" mt="10px" borderBottomColor="gray.200">
        <TabList display="flex">
          <Tab
            as={Link}
            to="/dashboard"
            fontWeight="bold"
            color={location.pathname === "/dashboard" ? "#244c9c" : "gray.500"}
            borderBottom={location.pathname === "/dashboard" && "2px solid"}
            borderColor={location.pathname === "/dashboard" && "#244c9c"}
            pb={2}
            _hover={{ color: "#244c9c" }}
            _focus={{ outline: "none" }}
          >
            Basket List
          </Tab>
          <Tab
            as={Link}
            to="/create-basket"
            fontWeight="bold"
            color={
              location.pathname === "/create-basket" ? "#244c9c" : "gray.500"
            }
            borderBottom={location.pathname === "/create-basket" && "2px solid"}
            borderColor={location.pathname === "/create-basket" && "#244c9c"}
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
                      value={basketData.expiry_date}
                      onChange={handleInputChange}
                      isRequired
                    />
                  </FormControl>

                  <FormControl mb={4}>
                    <FormLabel htmlFor="fund_required">Fund Required</FormLabel>
                    <Input
                      type="number"
                      id="fund_required"
                      name="fund_required"
                      value={basketData.fund_required}
                      onChange={handleInputChange}
                      placeholder="Fund Required"
                      isRequired
                    />
                  </FormControl>

                  <FormControl mb={4}>
                    <FormLabel htmlFor="currentMonthReturns">
                    Volatility
                    </FormLabel>
                  <Select placeholder="Select Volatility" required onChange={((e)=>setVolatility(e.target.value))}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                   
                  </Select>
                  </FormControl>
                </Box>

                <Box display={"flex"} gap={"2"}>
                  <FormControl mb={4}>
                    <FormLabel htmlFor="annual_returns">
                      Annual Returns
                    </FormLabel>
                    <Input
                      type="number"
                      id="annual_returns"
                      name="annual_returns"
                      value={basketData.annual_returns}
                      onChange={handleInputChange}
                      placeholder="Annual Returns"
                      isRequired
                    />
                  </FormControl>

                  <FormControl mb={4}>
                    <FormLabel htmlFor="cagr">3 YR CAGR</FormLabel>
                    <Input
                      type="number"
                      id="cagr"
                      name="cagr"
                      value={basketData.cagr}
                      onChange={handleInputChange}
                      placeholder="3 YR CAGR"
                      isRequired
                    />
                  </FormControl>

                  <FormControl mb={4}>
                    <FormLabel htmlFor="success_rate">Success Rate</FormLabel>
                    <Input
                      type="number"
                      id="success_rate"
                      name="success_rate"
                      value={basketData.success_rate}
                      onChange={handleInputChange}
                      placeholder="Success Rate"
                      isRequired
                    />
                  </FormControl>

                  <FormControl mb={4}>
                    <FormLabel htmlFor="average_rate">Average Rate</FormLabel>
                    <Input
                      type="number"
                      id="average_rate"
                      name="average_rate"
                      value={basketData.average_rate}
                      onChange={handleInputChange}
                      placeholder="Average Rate"
                      isRequired
                    />
                  </FormControl>
                </Box>

                {/* ===========================================4 monnth Returns ======================================== */}
                <FormLabel htmlFor="average_rate">
                  Fourth Month Return{" "}
                </FormLabel>
                <Box display={"flex"} gap={"2"}>
                  <FormControl mb={4}>
                    <Input
                      type="number"
                      id="first_month"
                      name="first_month"
                      value={fourMonthReturns[0]}
                      onChange={(e) =>
                        handleFourMonthChange(0, `${e.target.value}`)
                      }
                      placeholder="First Month Returns"
                      isRequired
                    />
                  </FormControl>

                  <FormControl mb={4}>
                    <Input
                      type="number"
                      id="second_month"
                      name="second_month"
                      value={fourMonthReturns[1]}
                      onChange={(e) =>
                        handleFourMonthChange(1, `${e.target.value}`)
                      }
                      placeholder="Second Month Returns"
                      isRequired
                    />
                  </FormControl>

                  <FormControl mb={4}>
                    <Input
                      type="number"
                      id="third_month"
                      name="third_month"
                      value={fourMonthReturns[2]}
                      onChange={(e) =>
                        handleFourMonthChange(2, `${e.target.value}`)
                      }
                      placeholder="Third Month Returns"
                      isRequired
                    />
                  </FormControl>

                  <FormControl mb={4}>
                    <Input
                      type="number"
                      id="fourth_month"
                      name="fourth_month"
                      value={fourMonthReturns[3]}
                      onChange={(e) =>
                        handleFourMonthChange(3, `${e.target.value}`)
                      }
                      placeholder="Fourth Month Returns"
                      isRequired
                    />
                  </FormControl>
                </Box>

                {/* ===========================================Current Month  Returns ======================================== */}
                <Box
                  display={"flex"}
                  justifyContent={"space-evenly"}
                  gap={"10"}
                >
                  <FormControl mb={4}>
                    <FormLabel htmlFor="currentMonthReturns">
                      Current Month Returns
                    </FormLabel>
                    <Input
                      type="number"
                      id="currentMonthReturns"
                      name="currentMonthReturns"
                      value={currentMonthReturns}
                      onChange={(e) => setCurrentMonthReturns(e.target.value)}
                      placeholder="Current Month Returns"
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
              colorScheme={specialBasket === true ? 'green' : 'gray'}
              value={true}
              onChange={() => setSpecialBasket(true)}
            >
              Yes
            </Radio>
            <Radio
              colorScheme={specialBasket === false ? 'red' : 'gray'}
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
                  <Select placeholder="Select Underlying Index" required onChange={(e)=>setUnderlyingIndex(e.target.value)} >
                    <option value="NIFTY 50">NIFTY 50</option>
                    <option value="SENSEX">SENSEX</option>
                    <option value="Small Cap">Small Cap</option>
                    <option value="Mid Cap">Mid Cap</option>
                  </Select>
                  </FormControl>

                   
                </Box>

                <FormControl mb={4}>
                  <FormLabel htmlFor="symbols_info">
                    Symbols Information
                  </FormLabel>
                  <Box>
                    <Input
                      type="number"
                      id="numRows"
                      name="numRows"
                      value={numRows}
                      onChange={handleNumRowsChange}
                      placeholder="Number of symbols"
                      isRequired
                      min="1"
                      max="10"
                      width="50%"
                      mr={4}
                    />
                    <Button onClick={generateRows} colorScheme="blue">
                      Generate Rows
                    </Button>
                  </Box>
                  {tableRows.length > 0 && (
                    <Table variant="simple" mt={4}>
                      <Thead>
                        <Tr>
                          <Th>Symbol</Th>
                          <Th>Allocation (%)</Th>
                          <Th>Stop Loss </Th>
                          <Th>Take Profit </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {tableRows.map((row, index) => (
                          <Tr key={index}>
                            <Td>
                              <Select
                                width={"280px"}
                                value={row.name}
                                required
                                onChange={(e) =>
                                  handleRowChange(index, "name", e.target.value)
                                }
                                placeholder="Select symbol"
                                variant="filled"
                                bg="gray.100"
                                _focus={{
                                  bg: "white",
                                  borderColor: "gray.300",
                                }}
                              >
                                {symbols.map((item, idx) => (
                                  <option key={idx} value={item.sym}>
                                    {item.sym}
                                  </option>
                                ))}
                              </Select>
                              {/* <InputRightElement width="2.5rem">
      <SearchIcon color="gray.300" />
    </InputRightElement> */}
                            </Td>
                            <Td>
                              <Input
                                value={row.allocation}
                                required
                                onChange={(e) =>
                                  handleRowChange(
                                    index,
                                    "allocation",
                                    e.target.value
                                  )
                                }
                                type="number"
                                placeholder="Allocation %"
                              />
                            </Td>
                            <Td>
                              <Input
                                value={row.stopLoss}
                                required
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
                                placeholder="Take Profit "
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
                  isLoading={isLoading}
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
